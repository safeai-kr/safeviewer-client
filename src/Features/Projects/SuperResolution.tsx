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
import useCustomApi from "./API/useDetectionApi";

interface Selection {
  x: number;
  y: number;
  width: number;
  height: number;
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

const CustomDetection: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const mutation = useCustomApi();

  // 기본값 설정
  const longitude = parseFloat(
    sessionStorage.getItem("longitude") || "6.230747225"
  );
  const latitude = parseFloat(
    sessionStorage.getItem("latitude") || "49.63796111"
  );

  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);

  const [view, setView] = useState<View | null>(null);

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
      zoom: 16, // 초기 줌 레벨
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
  // const handleApiCall = () => {
  //   const requestData = {
  //     image_url: "http://images.cocodataset.org/val2017/000000039769.jpg",
  //     candidate_labels: "cat",
  //   };

  //   mutation.mutate(requestData, {
  //     onSuccess: (response) => {
  //       console.log("API call success:", response);
  //       // const apiResponse = response.data.predictions[0] as ApiResponse;
  //       // const parsedPredictions = JSON.parse(apiResponse.predictions); //JSON.parse(): JSON 문자열을 JavaScript 객체로 변환
  //       // setPredictions(parsedPredictions);
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

  //api 호출 정상적으로 작동하는지 테스트용 코드
  useEffect(() => {
    // handleApiCall();
  }, []);

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
          </>
        )}
      </ProjectMap>
    </>
  );
};

export default CustomDetection;
