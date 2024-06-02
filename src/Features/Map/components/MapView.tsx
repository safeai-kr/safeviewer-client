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
} from "ol/proj";
import styled from "styled-components";
import { Point } from "ol/geom";
import useMarker from "../Hooks/useMarker";
import DetailModal from "../Modal/DetailModal";

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
  const [selectedMarker, setSelectedMarker] = useState<MarkerProps | null>(
    null
  );

  const markerPosition = [
    {
      longitude: 126.6175,
      latitude: 36.9783,
      projectName: ["Ship detection", "Custom detection"],
      locationName: "Pyeongtaek port",
      country: "korea",
      idNum: [1, 2],
    },
    {
      longitude: 10.451526,
      latitude: 51.165691,
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

          setMarkerClicked(true);
          if (mapRef.current) {
            const { clientWidth, clientHeight } = mapRef.current;
            console.log(clientWidth);
            console.log(clientHeight);
            setModalPosition({ x: clientWidth / 2.5, y: clientHeight / 3.5 });
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

  return (
    <>
      <MapContainer ref={mapRef} />
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
