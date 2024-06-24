import React, { MouseEvent, useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Feature, Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import "ol/ol.css";
import {
  fromLonLat,
  get as getProjection,
  ProjectionLike,
  transform,
  transformExtent,
} from "ol/proj";
import styled, { css } from "styled-components";
import { WMTS } from "ol/source";
import { defaults as defaultControls } from "ol/control";
import { getTopLeft, getWidth } from "ol/extent";
import WMTSTileGrid from "ol/tilegrid/WMTS";
import ToolBar from "./Bar/ToolBar";
import ZoomBar from "./Bar/ZoomBar";
import useDetectionApi from "./API/useDetectionApi";
import ShipRightSideBar from "./Bar/SideBar/ShipRightSideBar";
import SelectionCloseBtn from "./Component/SelectionCloseBtn";
import ShipMainTip from "./ToolTip/ShipMainTip";
import ShipSideTip from "./ToolTip/ShipSideTip";
import VectorSource from "ol/source/Vector";
import { Polygon } from "ol/geom";
import { Fill, Stroke, Style } from "ol/style";
import { ShipList } from "./Data/ShipList";
import VectorLayer from "ol/layer/Vector";
import Select from "ol/interaction/Select";
import { click } from "ol/events/condition";
import { Coordinate } from "ol/coordinate";
interface Selection {
  x: number;
  y: number;
  width: number;
  height: number;
}
interface SelectedShip {
  label: string;
  center: [number, number];
}
const ProjectMap = styled.div<{ isToolIng: boolean }>`
  width: calc(100% - 296px);
  height: 100vh;
  position: relative;
  canvas {
    position: absolute;
    top: 0;
    left: 0;
  }
  ${({ isToolIng }) =>
    isToolIng &&
    css`
      filter: blur(5px);
    `}
`;

//before 가상 요소는 선택된 영역의 크기와 위치를 지정하고, box-shadow를 사용하여 선택된 영역 외부를 어둡게 만듭니다.
//after 가상 요소는 부모 요소 전체를 덮는 투명한 레이어를 만들어 선택된 영역이 아닌 부분을 덮습니다.
const BlurScreen = styled.div<{ selection: Selection | null }>`
  ${({ selection }) =>
    selection &&
    css`
      //선택한 영역
      &:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(2.5px);
        clip-path: polygon(
          0% 0%,
          0% 100%,
          ${selection.x}px 100%,
          ${selection.x}px ${selection.y}px,
          ${selection.x + selection.width}px ${selection.y}px,
          ${selection.x + selection.width}px ${selection.y + selection.height}px,
          ${selection.x}px ${selection.y + selection.height}px,
          ${selection.x}px 100%,
          100% 100%,
          100% 0%
        );
        z-index: 999;
      }
    `}
`;

const DetectionBox = styled.div<{ box: [number, number, number, number] }>`
  position: absolute;
  border: 2px solid red;
  left: ${({ box }) => box[0]}px;
  top: ${({ box }) => box[1] + 68}px;
  width: ${({ box }) => box[2] - box[0]}px;
  height: ${({ box }) => box[3] - box[1]}px;
  z-index: 1000;
`;

const SelectedBox = styled.div`
  position: absolute;
  border: 1px solid #fff;
  pointer-events: none;
  z-index: 1000;
  box-shadow: 4px 4px 10px 0px rgba(0, 0, 0, 0.6);
`;

const ShipDetection: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  // 기본값 설정
  const [longitude, setLongitude] = useState<number>(126.837598615);
  const [latitude, setLatitude] = useState<number>(36.96242917);
  useEffect(() => {
    sessionStorage.setItem("project", "Ship detection");
  }, []);

  const downloadLinkRef = useRef<HTMLAnchorElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);

  const [view, setView] = useState<View | null>(null);

  //선택된 영역
  const [selection, setSelection] = useState<Selection | null>(null);
  //선택이 완료되었는 지에 대한 상태
  const [isSelected, setIsSelected] = useState<boolean>(false);
  //마우스 클릭 지점(스크린샷 시작 지점)
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  //스크린샷 url
  const [screenshotUrl, setScreenshotUrl] = useState<string>("");

  //사진 레이어 추가용 state
  const [wmtsLayer, setWmtsLayer] = useState<TileLayer<WMTS> | null>(null);

  //툴팁 표시 상태
  const [isShipMainTip, setIsShipMainTip] = useState<boolean>(true);
  const [isShipSideTip, setIsShipSideTip] = useState<boolean>(false);

  //툴팁 진행 상태
  const [isToolIng, setIsToolIng] = useState<boolean>(true);

  //선택된 배
  const [selectedShip, setSelectedShip] = useState<SelectedShip | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const initialCoordinates = fromLonLat(
      [longitude, latitude],
      getProjection("EPSG:3857") as ProjectionLike
    );
    const initialView = new View({
      center: initialCoordinates,
      zoom: 16.5, // 초기 줌 레벨
      minZoom: 16.5, // 최소 줌 레벨
      maxZoom: 21, // 최대 줌 레벨
      projection: "EPSG:3857",
    });

    const osmLayer = new TileLayer({
      preload: Infinity,
      source: new OSM(),
    });

    const initialMap = new Map({
      target: mapRef.current,
      layers: [osmLayer],
      view: initialView,
      controls: defaultControls({
        zoom: false, // 기본 줌 컨트롤 비활성화
      }),
    });

    map.current = initialMap;
    setView(initialView);

    const addWmtsLayer = () => {
      if (!map.current) return;

      const projection = getProjection("EPSG:900913");
      if (!projection) return;
      const projectionExtent = projection.getExtent();
      if (!projectionExtent) return;

      const size = getWidth(projectionExtent) / 256;
      const resolutions = [];
      const matrixIds = [];
      for (let z = 0; z < 19; ++z) {
        resolutions[z] = size / Math.pow(2, z);
        matrixIds[z] = `EPSG:900913:${z}`;
      }

      const tileGrid = new WMTSTileGrid({
        origin: getTopLeft(projectionExtent),
        resolutions: resolutions,
        matrixIds: matrixIds,
      });

      const wmtsSource = new WMTS({
        url: "https://gsapi.safeai.kr/geoserver/viewer_test/gwc/service/wmts",
        layer: "viewer_test:pyeung_fine_4326",
        matrixSet: "EPSG:900913",
        format: "image/jpeg",
        tileGrid: tileGrid,
        style: "",
        wrapX: true,
        crossOrigin: "anonymous",
      });

      //평택항 레이어
      const pyeongtaekLayer = new TileLayer({
        source: wmtsSource,
        extent: transformExtent(
          [126.82416667, 36.94940278, 126.85103056, 36.97545556],
          "EPSG:4326",
          "EPSG:3857"
        ),
      });

      map.current.addLayer(pyeongtaekLayer);

      setWmtsLayer(pyeongtaekLayer);
    };

    addWmtsLayer();
    return () => {
      if (map.current) {
        map.current.setTarget(undefined);
      }
    };
  }, []);

  //줌 인/아웃
  const handleZoomIn = () => {
    if (view) {
      const zoom = view.getZoom();
      if (zoom !== undefined) {
        view.animate({ zoom: zoom + 0.5, duration: 300 });
      }
    }
  };

  const handleZoomOut = () => {
    if (view) {
      const zoom = view.getZoom();
      if (zoom !== undefined) {
        view.animate({ zoom: zoom - 0.5, duration: 300 });
      }
    }
  };

  //마우스 클릭 시 영역 선택 및 해제
  const handleMapMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (selectedTool === "drag") {
      const rect = mapRef?.current?.getBoundingClientRect();
      if (!rect) return;

      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      if (selection) {
        //영역 외부 클릭 시
        if (
          clickX < selection.x ||
          clickX > selection.x + selection.width ||
          clickY < selection.y ||
          clickY > selection.y + selection.height
        ) {
          setSelection(null);
          setIsSelected(false);
          setSelectedTool(null);
          if (map.current) {
            map.current.getInteractions().forEach((interaction) => {
              interaction.setActive(true);
            });
          }
          return;
        }
        //영역 내 클릭 시
        else {
          return;
        }
      }

      // 영역 시작점 지정
      setStartPoint({ x: clickX, y: clickY });
      // 영역 지정 시작
      setSelection({
        x: clickX,
        y: clickY,
        width: 0,
        height: 0,
      });
      // 지도 이동 방지(영역 지정할 때)
      if (map.current) {
        map.current.getInteractions().forEach((interaction) => {
          interaction.setActive(false);
        });
      }
    }
  };

  const handleMapMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (selectedTool !== "drag") return;
    if (!startPoint) return;

    const rect = mapRef?.current?.getBoundingClientRect();
    if (!rect) return;

    const newSelection = {
      x: Math.min(startPoint.x, e.clientX - rect.left),
      y: Math.min(startPoint.y, e.clientY - rect.top),
      width: Math.abs(e.clientX - rect.left - startPoint.x), //양수가 되도록 절대값 처리
      height: Math.abs(e.clientY - rect.top - startPoint.y),
    };

    //실제 영역 설정
    setSelection(newSelection);
  };

  const handleMapMouseUp = (e: MouseEvent<HTMLDivElement>) => {
    if (selectedTool !== "drag") return;
    setStartPoint(null);
    if (!selection) return;
    if (selection.width === 0 || selection.height === 0) return;

    const rect = mapRef?.current?.getBoundingClientRect();
    if (!rect) return;

    // 지도 캔버스 추출 (캔버스는 html요소. 그래픽 렌더링을 위한 도화지)
    const mapCanvas = mapRef.current?.querySelector("canvas");
    if (!mapCanvas) return;

    const scaleX = mapCanvas.width / rect.width;
    const scaleY = mapCanvas.height / rect.height;

    // 크롭된 캔버스 설정(캔버스 중에 사용하고 싶은 일부분)
    const croppedCanvas = document.createElement("canvas");

    //캔버스에 그림을 그리기 위한 캔버스의 렌더링 컨텍스트
    const context = croppedCanvas.getContext("2d");
    if (!context) return;

    croppedCanvas.width = selection.width * scaleX;
    croppedCanvas.height = selection.height * scaleY;
    context.drawImage(
      mapCanvas,
      selection.x * scaleX,
      selection.y * scaleY,
      croppedCanvas.width,
      croppedCanvas.height,
      0,
      0,
      selection.width * scaleX,
      selection.height * scaleY
    );

    const dataUrl = croppedCanvas?.toDataURL("image/png");
    setScreenshotUrl(dataUrl);
    setIsSelected(true);
  };

  //선택된 영역 우상단 X 버튼 클릭 시
  const handleCloseSelection = () => {
    setSelection(null);
    setIsSelected(false);
    setSelectedTool(null);
    if (map.current) {
      map.current.getInteractions().forEach((interaction) => {
        interaction.setActive(true);
      });
    }
  };

  //중앙 좌표 계산 함수

  const calculateCenter = (corners: Coordinate[]): Coordinate => {
    const [xSum, ySum] = corners.reduce(
      ([accX, accY], [x, y]) => [accX + x, accY + y],
      [0, 0]
    );
    const centerX = xSum / corners.length;
    const centerY = ySum / corners.length;
    return [centerX, centerY];
  };

  const rotatePoint = (
    x: number,
    y: number,
    cx: number,
    cy: number,
    angle: number
  ): Coordinate => {
    const adjustedAngle = angle * 0.98; // 각도를 약간 더 크게 조정 (다른 값으로 변경 시도)
    const radians = (Math.PI / 180) * adjustedAngle;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const nx = cos * (x - cx) + sin * (y - cy) + cx;
    const ny = -sin * (x - cx) + cos * (y - cy) + cy;
    return [nx, ny];
  };

  // 기준점 (126.82416667, 36.9754555)
  const referencePoint: [number, number] = [126.82416667, 36.9754555];

  // 픽셀 좌표를 위경도로 변환하는 함수
  const pixelToLatLon = (
    x: number,
    y: number,
    reference: [number, number],
    imageWidth: number,
    imageHeight: number
  ): [number, number] => {
    const lat = reference[1] - (y / imageHeight) * (reference[1] - 36.94940278); // 이미지 높이와 경도 범위를 사용하여 변환
    const lon = reference[0] + (x / imageWidth) * (126.85103056 - reference[0]); // 이미지 너비와 위도 범위를 사용하여 변환
    return [lon, lat];
  };

  //bbox그리기
  const drawBoundingBoxes = (
    map: Map | null,
    selectedShip: SelectedShip | null,
    setSelectedShip: (ship: SelectedShip | null) => void
  ) => {
    if (!map) return;

    const vectorSource = new VectorSource();

    ShipList.list.forEach((ship) => {
      const [xtl, ytl, width, height] = ship.bbox;
      const xbr = xtl + width;
      const ybr = ytl + height;

      // 픽셀 좌표를 위경도로 변환
      const corners: Coordinate[] = [
        pixelToLatLon(xtl, ytl, referencePoint, 9324, 11508),
        pixelToLatLon(xbr, ytl, referencePoint, 9324, 11508),
        pixelToLatLon(xbr, ybr, referencePoint, 9324, 11508),
        pixelToLatLon(xtl, ybr, referencePoint, 9324, 11508),
      ];

      // 중심점 계산
      const center = calculateCenter(corners);
      const rotation = ship.rotation || 0;

      // 좌표 회전
      const rotatedCorners = corners.map(([lon, lat]) =>
        rotatePoint(lon, lat, center[0], center[1], rotation)
      );

      // 좌표 변환
      const transformedCorners = rotatedCorners.map((corner) =>
        transform(corner, "EPSG:4326", "EPSG:3857")
      );

      const polygon = new Polygon([transformedCorners]);
      const feature = new Feature(polygon);
      feature.setStyle(
        new Style({
          stroke: new Stroke({
            color:
              selectedShip && selectedShip.label === ship.label
                ? "#F12FDE"
                : "#16E78F",
            width: 2,
          }),
          fill: new Fill({
            color: "rgba(0, 0, 0, 0)", // 내부를 채우지 않도록 투명 색상 설정
          }),
        })
      );
      feature.setId(ship.label); // 설정된 id로 기능 식별
      feature.set("center", calculateCenter(ship.corners as Coordinate[])); // 중앙 좌표 설정
      vectorSource.addFeature(feature);
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    map.addLayer(vectorLayer);

    const selectInteraction = new Select({
      condition: click,
      style: new Style({
        stroke: new Stroke({
          color: "#F12FDE",
          width: 2,
        }),
        fill: new Fill({
          color: "rgba(0, 0, 0, 0)",
        }),
      }),
    });

    selectInteraction.on("select", (e) => {
      const selectedFeatures = e.target.getFeatures();
      const selected = selectedFeatures.item(0);
      if (selected) {
        setSelectedShip({
          label: selected.getId() as string,
          center: selected.get("center"),
        });
      } else {
        setSelectedShip(null);
      }
    });

    map.addInteraction(selectInteraction);
  };
  useEffect(() => {
    drawBoundingBoxes(map.current, selectedShip, setSelectedShip);
  }, [selectedShip]);

  return (
    <>
      {isShipMainTip && (
        <ShipMainTip
          setIsShipMainTip={setIsShipMainTip}
          setIsShipSideTip={setIsShipSideTip}
        />
      )}
      {isShipSideTip && (
        <ShipSideTip
          setIsShipSideTip={setIsShipSideTip}
          setIsToolIng={setIsToolIng}
        />
      )}
      <ToolBar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
      <ZoomBar handleZoomIn={handleZoomIn} handleZoomOut={handleZoomOut} />
      <ProjectMap
        ref={mapRef}
        onMouseDown={handleMapMouseDown}
        onMouseMove={handleMapMouseMove}
        onMouseUp={handleMapMouseUp}
        isToolIng={isToolIng}
      >
        <BlurScreen selection={isSelected ? selection : null} />
        {view && (
          <>
            {selection !== null && (
              <>
                <SelectedBox
                  style={{
                    left: selection.x,
                    top: selection.y,
                    width: selection.width,
                    height: selection.height,
                  }}
                />
                {isSelected && (
                  <SelectionCloseBtn
                    position={{
                      right: selection.x + selection.width,
                      top: selection.y,
                    }}
                    onClose={handleCloseSelection}
                  />
                )}
              </>
            )}
            <a
              ref={downloadLinkRef}
              style={{ display: "none" }}
              href={screenshotUrl}
              download="screenshot.png"
            >
              Download Screenshot
            </a>
          </>
        )}
      </ProjectMap>
      <ShipRightSideBar
        selectedShip={selectedShip}
        setSelectedShip={setSelectedShip}
      />
    </>
  );
};

export default ShipDetection;
