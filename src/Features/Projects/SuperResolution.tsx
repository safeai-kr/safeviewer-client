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
import { getWidth } from "ol/extent";
import WMTSTileGrid from "ol/tilegrid/WMTS";
import ToolBar from "./Bar/ToolBar";
import ZoomBar from "./Bar/ZoomBar";
import useCustomApi from "./API/useCustomApi";

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

const SuperResolution: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const location = useLocation();
  const mutation = useCustomApi();
  const state = location.state as
    | {
        longitude: number;
        latitude: number;
        locationName: string;
        projectName: string;
      }
    | undefined;
  // 기본값 설정
  const longitude = state?.longitude || 126.6997459;
  // 기본값 설정 (서울 위도)
  const latitude = state?.latitude || 36.96895395;
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);

  const [view, setView] = useState<View | null>(null);

  //지도 표출
  useEffect(() => {
    if (!mapRef.current) return;

    const initialCoordinates = fromLonLat(
      [longitude, latitude],
      getProjection("EPSG:3857") as ProjectionLike
    );
    const initialView = new View({
      center: initialCoordinates,
      zoom: 12, // 초기 줌 레벨
      minZoom: 10, // 최소 줌 레벨
      maxZoom: 20, // 최대 줌 레벨
      projection: "EPSG:3857",
    });

    const projection = getProjection("EPSG:3857");
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

    const initialMap = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new WMTS({
            url: "http://34.155.198.90:8080/geoserver/gwc/service/wmts",
            layer: "viewer_test:Beta_with_3857_corrected",
            matrixSet: "EPSG:900913",
            format: "image/jpeg",
            projection: projection,
            tileGrid: new WMTSTileGrid({
              origin: [-20037508.34, 20037508.34],
              resolutions: resolutions,
              matrixIds: matrixIds,
            }),
            style: "",
            wrapX: true,
            crossOrigin: "anonymous",
          }),
        }),
      ],
      view: initialView,
      controls: defaultControls({
        zoom: false, // 기본 줌 컨트롤 비활성화
      }),
    });

    map.current = initialMap;
    setView(initialView);

    //cleanup함수 - 언마운트될 때 실행
    return () => {
      if (map.current) {
        map.current.setTarget(undefined);
      }
    };
  }, []);

  // //Detection API 호출
  // const handleApiCall = () => {
  //   const requestData = {
  //     dataframe_split: {
  //       columns: ["image_url", "candidate_labels"],
  //       data: [
  //         [
  //           "https://cdn.klnews.co.kr/news/photo/202207/305254_45608_2249.png",
  //           "boat",
  //         ],
  //       ],
  //     },
  //   };

  //   mutation.mutate(requestData, {
  //     onSuccess: (response) => {
  //       console.log("API call success:", response);
  //       const apiResponse = response.data.predictions[0] as ApiResponse;
  //       const parsedPredictions = JSON.parse(apiResponse.predictions); //JSON.parse(): JSON 문자열을 JavaScript 객체로 변환
  //       setPredictions(parsedPredictions);
  //     },
  //     onError: (error) => {
  //       console.error("API call error:", error);
  //     },
  //   });
  // };

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

  return (
    <>
      <ProjectMap ref={mapRef}>
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
            {/* {selection && (
              <SelectedBox
                style={{
                  left: selection.x,
                  top: selection.y,
                  width: selection.width,
                  height: selection.height,
                }}
              />
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
            </a> */}
          </>
        )}
      </ProjectMap>
    </>
  );
};

export default SuperResolution;
