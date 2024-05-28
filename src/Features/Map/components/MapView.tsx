import React, { useState, useEffect, useRef } from "react";
import { Map, MapBrowserEvent, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import "ol/ol.css";
import { ProjectionLike, fromLonLat, get as getProjection } from "ol/proj";
import styled from "styled-components";
import { Point } from "ol/geom";
import useMarker from "../Hooks/useMarker";
import DetailModal from "../Modal/DetailModal";

interface MarkerProps {
  longitude: number;
  latitude: number;
  projectName: string;
  locationName: string;
}
const MapContainer = styled.div`
  height: 100vh;
  width: 100%;
`;

const MapView: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map>();
  const [markerClicked, setMarkerClicked] = useState<boolean>(false);

  const [selectedMarker, setSelectedMarker] = useState<MarkerProps | null>(
    null
  );

  const markerPosition = [
    {
      longitude: 126.836794,
      latitude: 36.961944,
      projectName: "Custom Detection",
      locationName: "Pyeongtaek",
    },
    {
      longitude: 10.451526,
      latitude: 51.165691,
      projectName: "Ship Detection",
      locationName: "Germany",
    },
  ];
  // 마커 레이어 생성
  const markerLayer = useMarker(markerPosition);
  const [modalPosition, setModalPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  //초기 지도 화면에 띄우기
  useEffect(() => {
    if (!mapRef.current) return;

    const osmLayer = new TileLayer({
      preload: Infinity,
      source: new OSM(),
    });
    const initialMap = new Map({
      target: mapRef.current,
      layers: [osmLayer],
      view: new View({
        center: fromLonLat(
          [126.752, 37.4713],
          getProjection("EPSG:3857") as ProjectionLike
        ),
        zoom: 2,
      }),
    });
    setMap(initialMap);
    return () => {
      initialMap.setTarget(undefined);
    };
  }, []);

  //지도에 마커 추가 및 마커 클릭 이벤트 핸들링
  useEffect(() => {
    if (!map || !markerLayer) return;
    map.addLayer(markerLayer);
    const handleMarkerClick = (event: MapBrowserEvent<PointerEvent>) => {
      // 마커 클릭 이벤트 핸들링 로직
      map.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
        if (layer === markerLayer) {
          //선택된 마커 지정
          const properties = feature.getProperties();
          const { projectName, locationName } = properties;
          const geometry = feature.getGeometry() as Point;
          if (!geometry) return;
          const coordinates = geometry.getCoordinates();
          setSelectedMarker({
            longitude: coordinates[0],
            latitude: coordinates[1],
            projectName,
            locationName,
          });

          setMarkerClicked(true);
          setModalPosition({ x: event.pixel[0], y: event.pixel[1] });
          return true;
        }
        return false;
      });
    };

    map.on("click", handleMarkerClick);
    return () => {
      map.un("click", handleMarkerClick);
    };
  }, [map, markerLayer]);

  return (
    <>
      <MapContainer ref={mapRef} />
      {markerClicked && modalPosition ? (
        <DetailModal
          setMarkerClicked={setMarkerClicked}
          modalPosition={modalPosition}
          // setImgLayerOn={setImgLayerOn}
          projectName={selectedMarker?.projectName}
          locationName={selectedMarker?.locationName}
          longitude={selectedMarker?.longitude}
          latitude={selectedMarker?.latitude}
        />
      ) : null}
    </>
  );
};

export default MapView;
