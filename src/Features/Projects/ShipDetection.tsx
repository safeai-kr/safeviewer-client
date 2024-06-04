import React, { MouseEvent, useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import "ol/ol.css";
import {
  fromLonLat,
  get as getProjection,
  ProjectionLike,
  transformExtent,
} from "ol/proj";
import styled from "styled-components";
import { WMTS } from "ol/source";
import { defaults as defaultControls } from "ol/control";
import { getTopLeft, getWidth } from "ol/extent";
import WMTSTileGrid from "ol/tilegrid/WMTS";
import ToolBar from "./Bar/ToolBar";
import ZoomBar from "./Bar/ZoomBar";
import useDetectionApi from "./API/useDetectionApi";

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

interface ApiResponse {
  image_url: string;
  candidate_labels: string;
  predictions: string; // json으로 파싱
}

const ProjectMap = styled.div`
  width: calc(100% - 296px);
  height: 100vh;
  position: relative;
  canvas {
    position: absolute;
    top: 0;
    left: 0;
  }
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
  border: 2px dashed #000;
  background-color: rgba(0, 0, 0, 0.2);
  pointer-events: none;
  z-index: 1000;
`;

const ShipDetection: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const mutation = useDetectionApi();

  const [predictions, setPredictions] = useState<Prediction[]>([]);
  // 기본값 설정
  const longitude = parseFloat(
    sessionStorage.getItem("longitude") || "126.837598615"
  );
  const latitude = parseFloat(
    sessionStorage.getItem("latitude") || "36.96242917"
  );

  const downloadLinkRef = useRef<HTMLAnchorElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);

  const [view, setView] = useState<View | null>(null);

  //선택된 영역
  const [selection, setSelection] = useState<Selection | null>(null);
  //마우스 클릭 지점(스크린샷 시작 지점)
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  //스크린샷 url
  const [screenshotUrl, setScreenshotUrl] = useState<string>("");
  //이미지 blob객체
  const [imageStr, setImageStr] = useState<string | "">("");

  //사진 레이어 추가용 state
  const [wmtsLayer, setWmtsLayer] = useState<TileLayer<WMTS> | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const initialCoordinates = fromLonLat(
      [longitude, latitude],
      getProjection("EPSG:3857") as ProjectionLike
    );
    const initialView = new View({
      center: initialCoordinates,
      zoom: 14, // 초기 줌 레벨
      minZoom: 12, // 최소 줌 레벨
      maxZoom: 19, // 최대 줌 레벨
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
        url: "http://34.155.198.90:8080/geoserver/viewer_test/gwc/service/wmts",
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
  const handleApiCall = () => {
    if (!imageStr) return;
    console.log(imageStr);
    const requestData = {
      image: imageStr,
      candidate_labels: "ship",
    };

    mutation.mutate(requestData, {
      onSuccess: (response) => {
        console.log("API call success:", response);
        // const apiResponse = response.data.predictions[0] as ApiResponse;
        // const parsedPredictions = JSON.parse(apiResponse.predictions); //JSON.parse(): JSON 문자열을 JavaScript 객체로 변환
        // setPredictions(parsedPredictions);
      },
      onError: (error) => {
        console.error("API call error:", error);
      },
    });
  };

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

    const width = Math.max(
      Math.abs(e.clientX - rect.left - startPoint.x),
      Math.abs(e.clientY - rect.top - startPoint.y)
    );
    const height = Math.max(
      Math.abs(e.clientX - rect.left - startPoint.x),
      Math.abs(e.clientY - rect.top - startPoint.y)
    );

    //width와 height 동일하게 해서 정사각형으로!
    const newSelection = {
      x: Math.min(startPoint.x, startPoint.x + width),
      y: Math.min(startPoint.y, startPoint.y + height),
      width: width,
      height: height,
    };

    //실제 영역 설정
    setSelection(newSelection);
  };

  // 데이터 URL에서 base64 인코딩된 부분을 추출
  const dataURLtoBase64 = (dataurl: string): string => {
    if (!dataurl) return "";
    const arr = dataurl.split(",");
    return arr[1]; // base64 인코딩된 데이터 부분만 리턴
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
    setImageStr(dataURLtoBase64(dataUrl));
  };

  useEffect(() => {
    //마우스를 뗐을 때 바로 이미지 다운로드
    if (screenshotUrl) {
      handleApiCall();
      // downloadLinkRef.current?.click();
    }
  }, [screenshotUrl]);

  // //api 호출 정상적으로 작동하는지 테스트용 코드
  // useEffect(() => {
  //   handleApiCall();
  // }, []);

  return (
    <>
      <ProjectMap
        ref={mapRef}
        onMouseDown={handleMapMouseDown}
        onMouseMove={handleMapMouseMove}
        onMouseUp={handleMapMouseUp}
      >
        {view && (
          <>
            <ToolBar
              selectedTool={selectedTool}
              setSelectedTool={setSelectedTool}
            />
            <ZoomBar
              handleZoomIn={handleZoomIn}
              handleZoomOut={handleZoomOut}
            />
            {selection !== null && (
              <SelectedBox
                style={{
                  left: selection.x,
                  top: selection.y,
                  width: selection.width,
                  height: selection.height,
                }}
              />
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
    </>
  );
};

export default ShipDetection;
