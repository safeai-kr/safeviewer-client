import { Feature } from "ol";
import "ol/ol.css";
import { Icon, Style } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";

interface MarkerProps {
  longitude: number;
  latitude: number;
  projectName: string;
  locationName: string;
}
const useMarker = (markerPosition: MarkerProps[]) => {
  // 마커 feature 설정
  const features = markerPosition.map((position) => {
    const feature = new Feature({
      geometry: new Point(fromLonLat([position.longitude, position.latitude])), // 경도 위도에 포인트 설정
      name: "marker",
      projectName: position.projectName,
      locationName: position.locationName,
    });

    return feature;
  });

  const markerStyle = new Style({
    image: new Icon({
      opacity: 1, // 투명도 1=100%
      scale: 1.4, // 크기 1=100%
      src: "http://map.vworld.kr/images/ol3/marker_blue.png",
    }),
  });

  // 마커 레이어에 들어갈 소스 생성
  const markerSource = new VectorSource({
    features: features, // feature의 집합
  });

  // 마커 레이어 생성
  const markerLayer = new VectorLayer({
    source: markerSource, // 마커 feature들
    style: markerStyle, // 마커 스타일
  });

  return markerLayer;
};

export default useMarker;
