import React, { MouseEvent, useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import "ol/ol.css";
import { fromLonLat, get as getProjection, ProjectionLike } from "ol/proj";
import styled, { css } from "styled-components";
import { TileArcGISRest, WMTS } from "ol/source";

import { transformExtent } from "ol/proj";
import { defaults as defaultControls } from "ol/control";
import html2canvas from "html2canvas";
import { getTopLeft, getWidth } from "ol/extent";
import WMTSTileGrid from "ol/tilegrid/WMTS";
import ToolBar from "./Bar/ToolBar";
import ZoomBar from "./Bar/ZoomBar";
import useCustomApi from "./API/useDetectionApi";
import { useRecoilState } from "recoil";
import { IsCompressionModalState } from "../Map/Data/IsCompressionModalState";
import CompressionModal from "./Modal/CompressionModal";
import useCompressionApi from "./API/useCompressionApi";
import SelectionCloseBtn from "./Component/SelectionCloseBtn";
import SavedModal from "./Modal/SavedModal";
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
  height: 100vh;
  position: relative;
  canvas {
    position: absolute;
    top: 0;
    left: 0;
  }
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

const Compression: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const mutation = useCompressionApi();
  const [isCompressionModal, setIsCompressionModal] = useRecoilState<boolean>(
    IsCompressionModalState
  );
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  // 기본값 설정
  const [longitude, setLongitude] = useState<number>(6.230747225);
  const [latitude, setLatitude] = useState<number>(49.63796111);

  useEffect(() => {
    setLongitude(
      parseFloat(sessionStorage.getItem("longitude") || "6.23097225")
    );
    setLatitude(
      parseFloat(sessionStorage.getItem("latitude") || "49.63796111")
    );
  }, []);

  //탭으로 이동 시에 평택에서 넘어오면 위/경도 룩셈부르크 공항으로 지정
  useEffect(() => {
    if (sessionStorage.getItem("location") !== "Luxembourg Airport") {
      setLongitude(6.230747225);
      setLatitude(49.63796111);
    }
  }, [longitude, latitude]);

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
  //이미지 base64인코딩 string
  const [imageStr, setImageStr] = useState<string | "">("");

  //모달 내 save button 클릭 state
  const [isSaveClicked, setIsSaveClicked] = useState<boolean>(false);

  //사진 레이어 추가용 state
  const [wmtsLayer, setWmtsLayer] = useState<TileLayer<WMTS> | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const initialCoordinates = fromLonLat(
      [longitude, latitude - 0.002],
      getProjection("EPSG:3857") as ProjectionLike
    );
    const initialView = new View({
      center: initialCoordinates,
      zoom: 12, // 초기 줌 레벨
      minZoom: 16, // 최소 줌 레벨
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
        layer: "viewer_test:luxem_fine_4326",
        matrixSet: "EPSG:900913",
        format: "image/jpeg",
        tileGrid: tileGrid,
        style: "",
        wrapX: true,
        crossOrigin: "anonymous",
      });

      // 룩셈부르크 레이어
      const luxembourgLayer = new TileLayer({
        source: wmtsSource,
        extent: transformExtent(
          [6.22301667, 49.635225, 6.23847778, 49.64069722],
          "EPSG:4326",
          "EPSG:3857"
        ),
      });

      map.current.addLayer(luxembourgLayer);
      setWmtsLayer(luxembourgLayer);
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
    const requestData = {
      image_base64: imageStr,
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

  useEffect(() => {
    if (isCompressionModal) {
      handleApiCall(); ///
    }
  }, [isCompressionModal]);

  //api 호출 정상적으로 작동하는지 테스트용 코드
  useEffect(() => {
    // handleApiCall();
  }, []);

  return (
    <>
      <ProjectMap
        ref={mapRef}
        onMouseDown={handleMapMouseDown}
        onMouseMove={handleMapMouseMove}
        onMouseUp={handleMapMouseUp}
      >
        <BlurScreen selection={isSelected ? selection : null} />
        {view && (
          <>
            {isCompressionModal && screenshotUrl && (
              <CompressionModal
                url={screenshotUrl}
                setIsCompressionModal={setIsCompressionModal}
                setIsSaveClicked={setIsSaveClicked}
              />
            )}
            {/* Save버튼 클릭 시 */}
            {isSaveClicked && <SavedModal />}
            <ToolBar
              selectedTool={selectedTool}
              setSelectedTool={setSelectedTool}
            />
            <ZoomBar
              handleZoomIn={handleZoomIn}
              handleZoomOut={handleZoomOut}
            />
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
            {predictions.map((pred, index) => (
              <DetectionBox key={index} box={pred.box} />
            ))}
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

export default Compression;
