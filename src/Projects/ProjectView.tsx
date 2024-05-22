import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import "ol/ol.css";
import { fromLonLat, get as getProjection, ProjectionLike } from "ol/proj";
import styled from "styled-components";
import { TileArcGISRest } from "ol/source";

import { defaults as defaultControls, Control } from "ol/control";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMinus,
  faPlus,
  faVectorSquare,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";

const ProjectMap = styled.div`
  width: 77vw;
  height: 100vh;
  position: relative;
`;

const ToolBar = styled.div`
  width: 56px;
  height: 116px;
  padding: 8px;
  flex-wrap: wrap;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #272727;
  position: absolute;
  top: 0;
  background: #272727;
  z-index: 1000;
  gap: 8px;
`;
const ToolButton = styled.div`
  margin: 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 32px;
  margin: 0;
  padding: 20px;
  color: white;
  cursor: pointer;
  border-radius: 4px;
  &:hover {
    background-color: #3d3c3c;
  }
`;

const ToolIcon = styled(FontAwesomeIcon)`
  color: white;
  font-size: 20px;
`;
const ZoomBar = styled.div`
  position: absolute;
  top: 282px;
  background: #272727;
  z-index: 1000;
  display: flex;
  padding: 3px;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 44px;
  height: 88px;
  flex-wrap: wrap;
  border: none;
`;

const ZoomButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 32px;
  margin: 3px 0;
  color: white;
  cursor: pointer;
`;

const ZoomIcon = styled(FontAwesomeIcon)`
  color: white;
  font-size: 20px;
`;

const Separator = styled.div`
  width: 100%;
  height: 1px;
  background: #ccc;
`;

const ProjectView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const state = location.state as
    | { longitude: number; latitude: number }
    | undefined;

  // 기본값 설정
  const longitude = state?.longitude || 126.495;
  // 기본값 설정 (서울 위도)
  const latitude = state?.latitude || 37.27;

  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);

  const [view, setView] = useState<View | null>(null);
  useEffect(() => {
    if (!mapRef.current) return;

    const initialCoordinates = fromLonLat(
      [longitude, latitude],
      getProjection("EPSG:3857") as ProjectionLike
    );

    const initialView = new View({
      center: initialCoordinates,
      zoom: 17, // 초기 줌 레벨
      minZoom: 14, // 최소 줌 레벨
      maxZoom: 20, // 최대 줌 레벨
    });

    const initialMap = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new TileArcGISRest({
            url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
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
    <div>
      {/* <h4>Project View for Tab {id}</h4> */}
      <ProjectMap ref={mapRef}>
        {view && (
          <>
            <ToolBar>
              <ToolButton>
                <ToolIcon icon={faVectorSquare} />
              </ToolButton>
              <ToolButton>
                <ToolIcon icon={faWandMagicSparkles} />
              </ToolButton>
            </ToolBar>
            <ZoomBar>
              <ZoomButton onClick={handleZoomIn}>
                <ZoomIcon icon={faPlus} />
              </ZoomButton>
              <Separator />
              <ZoomButton onClick={handleZoomOut}>
                <ZoomIcon icon={faMinus} />
              </ZoomButton>
            </ZoomBar>
          </>
        )}
      </ProjectMap>
    </div>
  );
};

export default ProjectView;
