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
import { Vector, WMTS } from "ol/source";
import { defaults as defaultControls } from "ol/control";
import { getTopLeft, getWidth } from "ol/extent";
import WMTSTileGrid from "ol/tilegrid/WMTS";
import ToolBar from "./Bar/ToolBar";
import ZoomBar from "./Bar/ZoomBar";
import useDetectionApi from "./API/useDetectionApi";
import CustomRightSideBar from "./Bar/SideBar/CustomRightSideBar";
import SelectionCloseBtn from "./Component/SelectionCloseBtn";
import DragTip from "./ToolTip/DragTip";
import CustomSideTip from "./ToolTip/CustomSideTip";
import axios from "axios";
import LoadingModal from "./Modal/LoadingModal";
import VectorSource from "ol/source/Vector";
import { Polygon } from "ol/geom";
import { Fill, Stroke, Style } from "ol/style";
import VectorLayer from "ol/layer/Vector";

interface Selection {
  x: number;
  y: number;
  width: number;
  height: number;
}
interface Prediction {
  label: number;
  score: number;
  box: [number, number, number, number]; // [x1, y1, x2, y2]
}

interface Result {
  label: number;
  score: number;
  oriented_bbox: [number, number][];
}

interface ModelOutput {
  image_url: string;
  results: string;
  status: string;
  status_message: string;
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
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(24, 25, 25, 0.50);
        backdrop-filter: blur(3px);
        z-index: 999; 
      }
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
        background: rgba(57, 58, 63, 0.50);
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

const SelectedBox = styled.div`
  position: absolute;
  border: 1px solid #fff;
  pointer-events: none;
  z-index: 1000;
  box-shadow: 4px 4px 10px 0px rgba(0, 0, 0, 0.6);
`;

const CustomDetection: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const mutation = useDetectionApi();

  // 기본값 설정
  const [longitude, setLongitude] = useState<number>(126.837598615);
  const [latitude, setLatitude] = useState<number>(36.96242917);
  useEffect(() => {
    sessionStorage.setItem("project", "Custom detection");
  }, []);

  const downloadLinkRef = useRef<HTMLAnchorElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);

  //벡터 레이어(BBOX) 참조 상태
  const [vectorLayer, setVectorLayer] =
    useState<VectorLayer<VectorSource> | null>(null);
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
  const [isDragTip, setIsDragTip] = useState<boolean>(true);
  const [isSideTip, setIsSideTip] = useState<boolean>(false);

  //툴팁 진행 상태
  const [isToolIng, setIsToolIng] = useState<boolean>(true);

  //prediction output
  const [modelOutput, setModelOutput] = useState<ModelOutput | null>(null);
  //api요청 로딩상태
  const [isLoading, setIsLoading] = useState<boolean>(false);
  //검색 상태
  const [searchTxt, setSearchTxt] = useState<string>("");

  //지도 표출
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
        matrixIds[z] = "EPSG:900913:" + z;
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

  //Detection API 호출
  const handleApiCall = async () => {
    if (!screenshotUrl) return;
    setIsLoading(true);
    // GCS 버킷에 파일 업로드
    const model_name = "owlvit"; // 모델이름
    const timestamp_date = new Date()
      .toISOString()
      .split("T")[0]
      .replace(/-/g, "");
    //파일 경로
    const fileName = `bentoml/${model_name}/${timestamp_date}/input/detection_img_${new Date().getTime()}.png`;
    const blob = await fetch(screenshotUrl).then((res) => res.blob());

    //버킷에 파일 올리는 url 요청
    const response = await axios.post(
      `https://storage.googleapis.com/upload/storage/v1/b/ml-input-image/o?uploadType=media&name=${fileName}`,
      blob,
      {
        headers: {
          "Content-Type": "image/png",
        },
      }
    );

    //파일이 업로드 된 버킷의 URL
    const gcsURL = `https://storage.googleapis.com/ml-input-image/${fileName}`;
    const requestData = {
      image_url: gcsURL,
    };

    //버킷 URL을 통해 서버에 Compression 요청
    mutation.mutate(requestData, {
      onSuccess: async (response) => {
        console.log("API call success:", response);

        const task_id = response.data.task_id;
        console.log(task_id);
        if (!modelOutput && task_id) {
          const fetchStatus = async () => {
            try {
              const statusResponse = await axios.post(
                "https://mlapi.safeai.kr/detection/predict/status",
                {
                  task_id: task_id,
                }
              );
              console.log(statusResponse);

              const outputFromStatus = statusResponse.data.model_output[0];
              if (outputFromStatus) {
                setModelOutput(outputFromStatus);
                setIsLoading(false);
                clearInterval(statusInterval); // 요청 멈추기
              }
            } catch (error) {
              console.error("Error: ", error);
            }
          };
          // 1.5초마다 fetchStatus 함수 호출
          const statusInterval = setInterval(fetchStatus, 1500);
        }
      },
      onError: (error) => {
        console.error("API call error:", error);
      },
    });
  };

  /**
   * 이미지의 픽셀 좌표를 EPSG:4326 (위경도) 좌표로 변환합니다.
   * @param {number[]} pixel - [x, y] 형태의 픽셀 좌표
   * @param {number[]} extent - 이미지의 extent (EPSG:4326)
   * @param {number} imageWidth - 이미지의 너비 (픽셀)
   * @param {number} imageHeight - 이미지의 높이 (픽셀)
   * @returns {number[]} - [lon, lat] 형태의 위경도 좌표
   */
  const pixelToLatLon = (
    pixel: [number, number],
    extent: [number, number, number, number],
    selection: Selection
  ): [number, number] => {
    const [minLon, minLat, maxLon, maxLat] = extent;

    const relativeX = minLon + (pixel[0] / selection.width) * (maxLon - minLon);
    const relativeY =
      maxLat - (pixel[1] / selection.height) * (maxLat - minLat);

    return [relativeX, relativeY];
  };

  // bbox그리기
  const drawBoundingBoxes = (modelOutput: ModelOutput) => {
    if (!map.current || !modelOutput || !selection) return;
    console.log(modelOutput);
    const vectorSource = new VectorSource();
    if (selection === null) return;
    // selection의 좌표를 이용해 extent 설정

    // selection의 절대적인 위경도 좌표 계산
    const topLeft = map.current.getCoordinateFromPixel([
      selection.x,
      selection.y,
    ]);
    const bottomRight = map.current.getCoordinateFromPixel([
      selection.x + selection.width,
      selection.y + selection.height,
    ]);

    console.log(topLeft)
    console.log(bottomRight)
    console.log(selection)
    const [minLon, maxLat] = transform(topLeft, "EPSG:3857", "EPSG:4326");
    const [maxLon, minLat] = transform(bottomRight, "EPSG:3857", "EPSG:4326");

    const selectionExtent: [number, number, number, number] = [
      minLon,
      minLat,
      maxLon,
      maxLat,
    ];
    if (!modelOutput.results) return;
    const results: Result[] = JSON.parse(modelOutput.results);

    if (!results || !results.length || results.length === 0) return;
    console.log(results);

    // const mapCanvas = mapRef.current?.querySelector("canvas");
    // if (!mapCanvas) return;

    // const imageWidth = mapCanvas.width;
    // const imageHeight = mapCanvas.height;
    results.forEach((result) => {
      const bboxCoords = result.oriented_bbox.map((point) => {
        const latLon = pixelToLatLon(point, selectionExtent, selection);
        // const transformedPixel = map?.current?.getPixelFromCoordinate(
        //   transform(latLon, "EPSG:4326", "EPSG:3857")
        // );
  
        // 기존 픽셀 좌표와 변환된 후 다시 변환한 픽셀 좌표를 비교하여 콘솔에 출력
        // console.log("Original pixel:", point);
        // console.log("Transformed pixel:", transformedPixel);
        // console.log(latLon)
        return transform(latLon, "EPSG:4326", "EPSG:3857");
      });
      // console.log(bboxCoords);
      const labelColorMap: { [key: number]: string } = {
        0: "#FF9635",
        1: "#16E78F",
        2: "#FF42EC",
        9: "#E1FF27",
        10: "#E1FF27",
      };
      const polygon = new Polygon([bboxCoords]);
      const feature = new Feature(polygon);

      feature.setStyle(
        new Style({
          stroke: new Stroke({
            color: labelColorMap[result.label] || "#F12FDE",
            width: 2,
          }),
          fill: new Fill({
            color: "rgba(0, 0, 0, 0)",
          }),
        })
      );

      vectorSource.addFeature(feature);
    });

    const newVectorLayer = new VectorLayer({
      source: vectorSource,
    });

    map.current.addLayer(newVectorLayer);
    setVectorLayer(newVectorLayer);
  };

  useEffect(() => {
    if (modelOutput) {
      drawBoundingBoxes(modelOutput);
    }
  }, [modelOutput]);

  //줌 인/아웃
  const handleZoomIn = () => {
    if (view) {
      const zoom = view.getZoom();
      if (zoom !== undefined) {
        view.animate({ zoom: zoom + 1, duration: 300 });
      }
    }
  };

  const handleZoomOut = () => {
    if (view) {
      const zoom = view.getZoom();
      if (zoom !== undefined) {
        view.animate({ zoom: zoom - 1, duration: 300 });
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
          setModelOutput(null);
          setSearchTxt("");
          if (map.current && vectorLayer) {
            map.current.removeLayer(vectorLayer);
            setVectorLayer(null);
          }

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

    const scaleX = mapCanvas.width / rect.width / window.devicePixelRatio;
    const scaleY = mapCanvas.height / rect.height / window.devicePixelRatio;

    // 크롭된 캔버스 설정(캔버스 중에 사용하고 싶은 일부분)
    const croppedCanvas = document.createElement("canvas");

    //캔버스에 그림을 그리기 위한 캔버스의 렌더링 컨텍스트
    const context = croppedCanvas.getContext("2d");
    if (!context) return;

    croppedCanvas.width = selection.width * scaleX;
    croppedCanvas.height = selection.height * scaleY;
    context.drawImage(
      mapCanvas,
      selection.x * window.devicePixelRatio, // 좌표에 DPI 보정 추가
      selection.y * window.devicePixelRatio,
      selection.width * window.devicePixelRatio, // 너비와 높이에 DPI 보정 추가
      selection.height * window.devicePixelRatio,
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
    setModelOutput(null);
    setSearchTxt("");
    if (map.current && vectorLayer) {
      map.current.removeLayer(vectorLayer);
      setVectorLayer(null);
    }
    if (map.current) {
      map.current.getInteractions().forEach((interaction) => {
        interaction.setActive(true);
      });
    }
  };

  //영역 지정하면 api호출
  useEffect(() => {
    if (screenshotUrl && searchTxt !== "") {
      handleApiCall();
    }
  }, [screenshotUrl, searchTxt]);

  useEffect(() => {
    setSelectedTool(null);
    setIsLoading(false);
  }, []);
  return (
    <>
      {isLoading && <LoadingModal />}
      {isDragTip && (
        <DragTip setIsDragTip={setIsDragTip} setIsSideTip={setIsSideTip} />
      )}
      {isSideTip && (
        <CustomSideTip
          setIsSideTip={setIsSideTip}
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

      <CustomRightSideBar
        isLoading={isLoading}
        searchTxt={searchTxt}
        setSearchTxt={setSearchTxt}
        modelOutput={modelOutput}
        selection={selection}
        isSelected={isSelected}
      />
    </>
  );
};

export default CustomDetection;
