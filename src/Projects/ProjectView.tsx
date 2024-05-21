import React, { useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import "ol/ol.css";
import { fromLonLat, get as getProjection, ProjectionLike } from "ol/proj";
import styled from "styled-components";

const ProjectMap = styled.div`
  width: 77vw;
  height: 100vh;
`;

const ProjectView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const state = location.state as
    | { longitude: number; latitude: number }
    | undefined;

  // 기본값 설정 (서울 경도)
  const longitude = state?.longitude || 126.978;
  // 기본값 설정 (서울 위도)
  const latitude = state?.latitude || 37.5665;

  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const initialCoordinates = fromLonLat(
      [longitude, latitude],
      getProjection("EPSG:3857") as ProjectionLike
    );

    const initialMap = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: initialCoordinates,
        zoom: 15, // 초기 줌 레벨
        minZoom: 12, // 최소 줌 레벨
        maxZoom: 17, // 최대 줌 레벨
      }),
    });

    map.current = initialMap;

    //cleanup함수 - 언마운트될 때 실행
    return () => {
      if (map.current) {
        map.current.setTarget(undefined);
      }
    };
  }, []);

  return (
    <div>
      <h4>Project View for Tab {id}</h4>
      <ProjectMap ref={mapRef} />
    </div>
  );
};

export default ProjectView;
