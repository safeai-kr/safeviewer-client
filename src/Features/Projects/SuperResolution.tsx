import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import "ol/ol.css";
import { fromLonLat, get as getProjection, transformExtent } from "ol/proj";
import styled, { css } from "styled-components";
import { WMTS } from "ol/source";
import { defaults as defaultControls } from "ol/control";
import { getTopLeft, getWidth } from "ol/extent";
import WMTSTileGrid from "ol/tilegrid/WMTS";
import ToolBar from "./Bar/ToolBar";
import ZoomBar from "./Bar/ZoomBar";
import useCustomApi from "./API/useDetectionApi";
import MagicBarTip from "./ToolTip/MagicBarTip";
import AreaModal from "./Modal/AreaModal";
import ResolutionModal from "./Modal/ResolutionModal";
import axios from "axios";
import useSuperResolutionApi from "./API/useSuperResolutionApi";
import LoadingModal from "./Modal/LoadingModal";

const ProjectMap = styled.div<{ isMagicTip: boolean }>`
  height: 100vh;
  position: relative;
  canvas {
    position: absolute;
    top: 0;
    left: 0;
  }
  ${({ isMagicTip }) =>
    isMagicTip &&
    css`
      filter: blur(2px);
    `}
`;

const BlurOverlay = styled.div<{
  top1: number;
  left1: number;
  width1: number;
  height1: number;
  top2: number;
  left2: number;
  width2: number;
  height2: number;
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2.5px);
  z-index: 1000;
  pointer-events: none;
  clip-path: polygon(
    0 0,
    100% 0,
    100% 100%,
    0 100%,
    0 ${({ top1 }) => `${top1}vh`},
    ${({ left1 }) => `${left1}vw`} ${({ top1 }) => `${top1}vh`},
    ${({ left1 }) => `${left1}vw`}
      ${({ top1, height1 }) => `${top1 + height1}vh`},
    ${({ left1, width1 }) => `${left1 + width1}vw`}
      ${({ top1, height1 }) => `${top1 + height1}vh`},
    ${({ left1, width1 }) => `${left1 + width1}vw`} ${({ top1 }) => `${top1}vh`},
    0 ${({ top1 }) => `${top1}vh`},
    0 ${({ top2 }) => `${top2}vh`},
    ${({ left2 }) => `${left2}vw`} ${({ top2 }) => `${top2}vh`},
    ${({ left2 }) => `${left2}vw`}
      ${({ top2, height2 }) => `${top2 + height2}vh`},
    ${({ left2, width2 }) => `${left2 + width2}vw`}
      ${({ top2, height2 }) => `${top2 + height2}vh`},
    ${({ left2, width2 }) => `${left2 + width2}vw`} ${({ top2 }) => `${top2}vh`},
    0 ${({ top2 }) => `${top2}vh`}
  );
`;

const AreaModalWrapper = styled.div<{
  top: number;
  left: number;
  width: number;
  height: number;
}>`
  position: absolute;
  cursor: pointer;
  top: ${({ top }) => top}vh;
  left: ${({ left }) => left}vw;
  width: ${({ width }) => width}vw;
  height: ${({ height }) => height}vh;
  z-index: 1001;
`;

const SuperResolution: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalPosition, setModalPosition] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  }>({
    top: (306 / 720) * 100,
    left: (110 / 1280) * 100,
    width: (524 / 1280) * 100,
    height: (282 / 720) * 100,
  });

  const secondModalPosition = {
    top: modalPosition.top,
    left: modalPosition.left + (modalPosition.width + (12 / 1280) * 100),
    width: modalPosition.width,
    height: modalPosition.height,
  };

  const [longitude, setLongitude] = useState<number>(6.229);
  const [latitude, setLatitude] = useState<number>(49.63724);
  useEffect(() => {
    sessionStorage.setItem("project", "Super resolution");
  }, []);

  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);

  const [view, setView] = useState<View | null>(null);
  const [isMagicTip, setIsMagicTip] = useState<boolean>(true);

  const [isModalClicked, setIsModalClicked] = useState<boolean>(false);

  const [clickedModalId, setClickedModalId] = useState<number | null>(null);
  useEffect(() => {
    if (!mapRef.current) return;

    const initialCoordinates = fromLonLat(
      [longitude, latitude],
      getProjection("EPSG:3857") as any
    );
    const initialView = new View({
      center: initialCoordinates,
      zoom: 17.8,
      minZoom: 17.8,
      maxZoom: 21,
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
        zoom: false,
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

      const luxembourgLayer = new TileLayer({
        source: wmtsSource,
        extent: transformExtent(
          [6.22301667, 49.635225, 6.23847778, 49.64069722],
          "EPSG:4326",
          "EPSG:3857"
        ),
      });

      map.current.addLayer(luxembourgLayer);
    };

    addWmtsLayer();
    return () => {
      if (map.current) {
        map.current.setTarget(undefined);
      }
    };
  }, []);

  //SuperResolution API 호출
  const handleApiCall = async (id: number) => {
    setIsLoading(true);
    const src1 = getImageSrc1(id);
    if (getImageSrc1(id) == null) return;
    // GCS 버킷에 파일 업로드
    const model_name = "Swin2SR"; // 모델이름
    const timestamp_date = new Date()
      .toISOString()
      .split("T")[0]
      .replace(/-/g, "");
    //파일 경로
    const fileName = `bentoml/${model_name}/${timestamp_date}/input/resolution_img_${new Date().getTime()}.png`;
    const blob = await fetch(src1).then((res) => res.blob());

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
    console.log(response);

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
        if (!outputImageUrl && task_id) {
          const fetchStatus = async () => {
            try {
              const statusResponse = await axios.post(
                "https://mlapi.safeai.kr/resolution/predict/status",
                {
                  task_id: task_id,
                }
              );
              console.log(statusResponse);
              const outputUrlFromStatus = statusResponse.data.output_url;

              // Output URL을 통해 이미지 가져오기
              if (outputUrlFromStatus) {
                setOutputImageUrl(outputUrlFromStatus);
                setIsLoading(false);
                clearInterval(statusInterval); // 요청 멈추기
                clearTimeout(timeout);
              }
            } catch (error) {
              console.error("Error: ", error);
            }
          };
          // 1.5초마다 fetchStatus 함수 호출
          const statusInterval = setInterval(fetchStatus, 1500);
          // 10초 후에 요청 멈추기
          const timeout = setTimeout(() => {
            clearInterval(statusInterval);
            setIsLoading(false);
            console.log("Timeout: 요청이 너무 오래 걸렸습니다.");
          }, 10000); // 10초 후에 요청을 멈춤
        }
      },
      onError: (error) => {
        console.error("API call error:", error);
      },
    });
  };

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

  const handleModalClick = (id: number) => {
    setIsModalClicked(true);
    setClickedModalId(id);
  };
  const images = [
    {
      id: 1,
      src1: require("./before1.png"),
      src2: require("./after1.png"),
    },
    {
      id: 2,
      src1: require("./before2.png"),
      src2: require("./after2.png"),
    },
  ];

  const getImageSrc1 = (id: number) => {
    const image = images.find((image) => image.id === id);
    return image ? image.src1 : "";
  };
  const getImageSrc2 = (id: number) => {
    const image = images.find((image) => image.id === id);
    return image ? image.src2 : "";
  };
  const mutation = useSuperResolutionApi();
  const [outputImageUrl, setOutputImageUrl] = useState<string | null>("");

  const resetState = () => {
    setSelectedTool(null);
    setIsLoading(false);
  };
  useEffect(() => {
    if (clickedModalId !== null) handleApiCall(clickedModalId);
  }, [clickedModalId]);
  useEffect(() => {
    resetState();
  }, []);
  return (
    <>
      {isLoading && <LoadingModal />}
      {isMagicTip && <MagicBarTip setIsMagicTip={setIsMagicTip} />}
      {isModalClicked && !isLoading && (
        <ResolutionModal
          imageSrc1={
            clickedModalId !== null ? getImageSrc1(clickedModalId) : ""
          }
          imageSrc2={
            clickedModalId !== null ? getImageSrc2(clickedModalId) : ""
          }
          setIsModalClicked={setIsModalClicked}
          outputUrl={outputImageUrl}
          setOutputImageUrl={setOutputImageUrl}
        />
      )}
      <ToolBar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
      <ZoomBar handleZoomIn={handleZoomIn} handleZoomOut={handleZoomOut} />
      <ProjectMap isMagicTip={isMagicTip} ref={mapRef} onClick={resetState}>
        {selectedTool === "magic" && (
          <>
            <BlurOverlay
              top1={modalPosition.top}
              left1={modalPosition.left}
              width1={modalPosition.width}
              height1={modalPosition.height}
              top2={secondModalPosition.top}
              left2={secondModalPosition.left}
              width2={secondModalPosition.width}
              height2={secondModalPosition.height}
              onClick={(e) => {
                e.stopPropagation(); // 클릭 이벤트가 부모로 전파되지 않도록
                resetState();
              }}
            />
            <AreaModalWrapper
              top={modalPosition.top}
              left={modalPosition.left}
              width={modalPosition.width}
              height={modalPosition.height}
              onClick={() => handleModalClick(1)}
            >
              <AreaModal />
            </AreaModalWrapper>
            <AreaModalWrapper
              top={secondModalPosition.top}
              left={secondModalPosition.left}
              width={secondModalPosition.width}
              height={secondModalPosition.height}
              onClick={() => handleModalClick(2)}
            >
              <AreaModal />
            </AreaModalWrapper>
          </>
        )}
      </ProjectMap>
    </>
  );
};

export default SuperResolution;
