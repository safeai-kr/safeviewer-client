import React, { useState, useEffect, useRef } from "react";
import { Map, MapBrowserEvent, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import "ol/ol.css";
import {
  ProjectionLike,
  fromLonLat,
  get as getProjection,
  toLonLat,
  transform,
} from "ol/proj";
import styled from "styled-components";
import { Point } from "ol/geom";
import useMarker from "../Hooks/useMarker";
import DetailModal from "../Modal/DetailModal";
import { defaults as defaultControls } from "ol/control";
import ZoomBar from "../Bar/ZoomBar";

interface MarkerProps {
  longitude: number;
  latitude: number;
  projectName: string[];
  locationName: string;
  country: string;
  idNum: number[];
}

const MapContainer = styled.div`
  height: 100vh;
  width: 100%;
`;

const MapView: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map | null>(null);
  const [markerClicked, setMarkerClicked] = useState<boolean>(false);
  const [view, setView] = useState<View | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<MarkerProps | null>(
    null
  );

  const markerPosition = [
    {
      longitude: 126.837598615,
      latitude: 36.96242917,
      projectName: ["Ship detection", "Custom detection"],
      locationName: "Pyeongtaek port",
      country: "korea",
      idNum: [1, 2],
    },
    {
      longitude: 6.230747225,
      latitude: 49.63796111,
      projectName: ["Super resolution", "Compression"],
      locationName: "Luxembourg Airport",
      country: "luxembourg",
      idNum: [3, 4],
    },
  ];

  const markerLayer = useMarker(markerPosition);
  const [modalPosition, setModalPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    const osmLayer = new TileLayer({
      preload: Infinity,
      source: new OSM(),
    });

    const initialView = new View({
      center: fromLonLat(
        [127.0016985, 37.0642135],
        getProjection("EPSG:3857") as ProjectionLike
      ),
      zoom: 2,
    });
    const initialMap = new Map({
      target: mapRef.current,
      layers: [osmLayer],
      view: initialView,
      controls: defaultControls({
        zoom: false, // 기본 줌 컨트롤 비활성화
      }),
    });

    setMap(initialMap);
    setView(initialView);
    return () => {
      initialMap.setTarget(undefined);
    };
  }, []);

  // Add marker layer and click handling
  useEffect(() => {
    if (!map || !markerLayer) return;

    map.addLayer(markerLayer);

    const handleMarkerClick = (event: MapBrowserEvent<PointerEvent>) => {
      map.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
        if (layer === markerLayer) {
          const properties = feature.getProperties();
          const { projectName, locationName, country, idNum } = properties;
          const geometry = feature.getGeometry() as Point;
          if (!geometry) return;
          const coordinates = geometry.getCoordinates();
          const [lon, lat] = toLonLat(coordinates);

          // console.log("Marker clicked:", properties);

          setSelectedMarker({
            longitude: lon,
            latitude: lat,
            projectName,
            locationName,
            country,
            idNum,
          });

          //마커 클릭 시에 줌 아웃/인 후, 모달이 화면 중앙에 뜨도록 하기
          if (mapRef.current && map) {
            const view = map.getView();
            if (!view) return;

            //center를 마커 위치로
            const targetCenter = fromLonLat(
              [lon, lat],
              getProjection("EPSG:3857") as ProjectionLike
            );
            const currentZoom = view.getZoom() || 2;
            view.animate({ zoom: currentZoom - 1, duration: 500 }, () => {
              view.animate(
                {
                  center: targetCenter,
                  zoom: currentZoom + 7,
                  duration: 1000,
                },
                () => {
                  //animate이후에 setMarkerClicked true로 지정해서 모달이 더 늦게 뜨도록하기
                  if (mapRef.current) {
                    const { clientWidth, clientHeight } = mapRef.current;
                    //modal 위치를 화면 정중앙으로
                    setModalPosition({
                      x: clientWidth / 2.1,
                      y: clientHeight / 3,
                    });
                    setMarkerClicked(true);
                  }
                }
              );
            });
          }

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
      <MapContainer ref={mapRef}>
        <ZoomBar handleZoomIn={handleZoomIn} handleZoomOut={handleZoomOut} />
      </MapContainer>
      {markerClicked && modalPosition && selectedMarker ? (
        <DetailModal
          setMarkerClicked={setMarkerClicked}
          modalPosition={modalPosition}
          projectName1={selectedMarker.projectName[0]}
          projectName2={selectedMarker.projectName[1]}
          locationName={selectedMarker.locationName}
          longitude={selectedMarker.longitude}
          latitude={selectedMarker.latitude}
          country={selectedMarker.country}
          idNum={selectedMarker.idNum}
        />
      ) : null}
    </>
  );
};

export default MapView;
