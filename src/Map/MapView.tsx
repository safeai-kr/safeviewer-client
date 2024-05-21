import React, { useState, useEffect, useRef } from "react";
import { Feature, Map, MapBrowserEvent, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import "ol/ol.css";
import { ProjectionLike, fromLonLat, get as getProjection } from "ol/proj";
import useMarker from "./Hooks/useMarker";
import Detailmodal from "./Modal/DetailModal";
import ImageLayer from "ol/layer/Image";
import { ImageStatic, XYZ } from "ol/source";
import { createXYZ } from "ol/tilegrid";
import { transformExtent } from "ol/proj";
import MapHeader from "../Header/MapHeader";

const MapView: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map>();
  const [markerClicked, setMarkerClicked] = useState<boolean>(false);
  const [imgLayerOn, setImgLayerOn] = useState<boolean>(false);
  const [imgLayer, setImgLayer] = useState<TileLayer<XYZ>>();
  // 마커 레이어 생성
  const markerLayer = useMarker({ longitude: 126.62, latitude: 37.296 });
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
        zoom: 9,
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
    // console.log(markerLayer);
    const handleMarkerClick = (event: MapBrowserEvent<PointerEvent>) => {
      // 마커 클릭 이벤트 핸들링 로직
      map.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
        if (layer === markerLayer) {
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

  // //View Details 클릭 시
  // useEffect(() => {
  //   if (!map) return;

  //   // 이미지 레이어가 이미 추가된 경우, 제거
  //   if (imgLayer) {
  //     map.removeLayer(imgLayer);
  //     setImgLayer(undefined);
  //   }

  //   if (imgLayerOn) {
  //     console.log(markerLayer);

  //     const imageExtentTransformed = [
  //       ...fromLonLat([126.3, 37.2]),
  //       ...fromLonLat([126.8, 37.5]),
  //     ];

  //     const newTileLayer = new TileLayer({
  //       source: new XYZ({
  //         url: "https://tile-server-domain/{z}/{x}/{y}.png",
  //         projection: "EPSG:3857", // 사용할 좌표계
  //         tileGrid: createXYZ({
  //           extent: transformExtent(
  //             imageExtentTransformed,
  //             "EPSG:4326",
  //             "EPSG:3857"
  //           ),
  //           maxZoom: 19,
  //           tileSize: 512, // 타일 크기 설정 (옵션)
  //         }),
  //       }),
  //     });

  //     // newTileLayer.setZIndex(1);
  //     console.log(newTileLayer);
  //     map.addLayer(newTileLayer);
  //     setImgLayer(newTileLayer);
  //     // XYZ 소스를 변수에 할당
  //     const xyzSource = newTileLayer.getSource();

  //     // 'tileloadstart' 이벤트를 사용하여 타일 로드 시작시 콘솔에 로그 출력
  //     xyzSource?.on("tileloadstart", function (event) {
  //       const tileCoord = event.tile.getTileCoord(); // 타일 좌표 가져오기
  //       console.log(
  //         `Loading tile at z: ${tileCoord[0]}, x: ${tileCoord[1]}, y: ${tileCoord[2]}`
  //       );
  //     });
  //   }
  // }, [map, imgLayerOn]);

  return (
    <>
      <div
        style={{ height: "100vh", width: "100%" }}
        ref={mapRef}
        className="map-container"
      />
      {markerClicked && modalPosition ? (
        <Detailmodal
          setMarkerClicked={setMarkerClicked}
          modalPosition={modalPosition}
          // setImgLayerOn={setImgLayerOn}
          longitude={126.62}
          latitude={37.296}
        />
      ) : null}
    </>
  );
};

export default MapView;
