import React, { MouseEvent, useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import "ol/ol.css";
import { fromLonLat, get as getProjection, ProjectionLike } from "ol/proj";
import styled, { css } from "styled-components";
import { TileArcGISRest, XYZ } from "ol/source";

import { transformExtent } from "ol/proj";
import { defaults as defaultControls, Control } from "ol/control";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMinus,
  faPlus,
  faVectorSquare,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import html2canvas from "html2canvas";
import { createXYZ } from "ol/tilegrid";

interface Selection {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ProjectMapProps {
  dragOn: boolean;
}

const ProjectMap = styled.div<ProjectMapProps>`
  width: 77vw;
  height: 100vh;
  position: relative;
  canvas {
    position: absolute;
    top: 0;
    left: 0;
  }
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

const SelectedBox = styled.div`
  position: absolute;
  border: 2px dashed #000;
  background-color: rgba(0, 0, 0, 0.2);
  pointer-events: none;
  z-index: 1000;
`;

const CustomDetection: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [dragOn, setDragOn] = useState<boolean>(false);
  const location = useLocation();
  const state = location.state as
    | {
        longitude: number;
        latitude: number;
        locationName: string;
        projectName: string;
      }
    | undefined;
  // 기본값 설정
  const longitude = state?.longitude || 126.495;
  // 기본값 설정 (서울 위도)
  const latitude = state?.latitude || 37.27;
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);

  const [view, setView] = useState<View | null>(null);

  //선택된 영역
  const [selection, setSelection] = useState<Selection | null>(null);
  //마우스 클릭 지점(스크린샷 시작 지점)
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  //스크린샷 url
  const [screenshotUrl, setScreenshotUrl] = useState<string>("");

  //지도 표출
  useEffect(() => {
    if (!mapRef.current) return;

    const initialCoordinates = fromLonLat(
      [longitude, latitude],
      getProjection("EPSG:3857") as ProjectionLike
    );

    const initialView = new View({
      center: initialCoordinates,
      zoom: 16, // 초기 줌 레벨
      minZoom: 0, // 최소 줌 레벨
      maxZoom: 20, // 최대 줌 레벨
      projection: "EPSG:3857",
    });
    const tileGrid = createXYZ({
      extent: [-180, -90, 180, 90],
      tileSize: 256,
      maxZoom: 20,
    });

    const imageExtentTransformed = [
      ...fromLonLat([126.3, 37.2]),
      ...fromLonLat([126.8, 37.5]),
    ];

    const initialMap = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          // source: new TileArcGISRest({
          //   url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
          //   //외부에서 제공된 이미지 사용을 위한 cross origin 처리
          //   crossOrigin: "anonymous",
          // }),
          source: new XYZ({
            url: "http://34.155.198.90:8080/geoserver/gwc/service/tms/1.0.0/viewer_test:viewer_test_layer@EPSG:4326@png/{z}/{x}/{y}.png",
            projection: "EPSG:3857", // 사용할 좌표계
            tileGrid: tileGrid,
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

  //영역 선택 및 스크린샷 (마우스 클릭 시)
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!dragOn) return;
    //엘리먼트의 크기와 뷰포트에 상대적인 위치 정보를 제공하는 DOMRect 객체를 반환
    const rect = mapRef?.current?.getBoundingClientRect();
    if (!rect) return;
    //영역 시작점 지정
    setStartPoint({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    //영역 지정 시작
    setSelection({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      width: 0,
      height: 0,
    });
    // 지도 이동 방지(영역 지정할 때)
    if (map.current) {
      map.current.getInteractions().forEach((interaction) => {
        interaction.setActive(false);
      });
    }
  };

  //마우스 클릭된 상태로 이동 시
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!dragOn) return;
    if (!startPoint) return;
    const rect = mapRef?.current?.getBoundingClientRect();
    if (!rect) return;
    const width = Math.max(
      Math.abs(e.clientX - rect.left - startPoint.x),
      Math.abs(e.clientY - rect.top - startPoint.y)
    );
    const height = Math.max(
      Math.abs(e.clientX - rect.left - startPoint.x),
      Math.abs(e.clientY - rect.top - startPoint.y)
    );
    //width와 height 동일하게 해서 정사각형으로!
    const newSelection = {
      x: Math.min(startPoint.x, startPoint.x + width),
      y: Math.min(startPoint.y, startPoint.y + height),
      width: width,
      height: height,
    };
    //실제 영역 설정
    setSelection(newSelection);
  };

  //마우스 클릭을 뗐을 때
  const handleMouseUp = async () => {
    if (!dragOn) return;
    setStartPoint(null);
    if (!selection) return;
    // const canvas = await html2canvas(mapRef?.current, {
    //   x: selection.x,
    //   y: selection.y,
    //   width: selection.width,
    //   height: selection.height,
    // });

    // 지도 캔버스 추출 (캔버스는 html요소. 그래픽 렌더링을 위한 도화지)
    const mapCanvas = mapRef.current?.querySelector("canvas");
    console.log(mapCanvas);
    if (!mapCanvas) return;

    const rect = mapRef?.current?.getBoundingClientRect();
    if (!rect) return;
    const scaleX = mapCanvas.width / rect.width;
    const scaleY = mapCanvas.height / rect.height;

    // 크롭된 캔버스 설정(캔버스 중에 사용하고 싶은 일부분)
    const croppedCanvas = document.createElement("canvas");

    //캔버스에 그림을 그리기 위한 캔버스의 렌더링 컨텍스트
    const context = croppedCanvas.getContext("2d");
    if (!context) return;

    croppedCanvas.width = selection.width * scaleX;
    croppedCanvas.height = selection.height * scaleY;
    context.drawImage(
      mapCanvas,
      selection.x * scaleX,
      selection.y * scaleY,
      croppedCanvas.width,
      croppedCanvas.height,
      0,
      0,
      selection.width,
      selection.height
    );

    const dataUrl = croppedCanvas?.toDataURL("image/png");

    setScreenshotUrl(dataUrl);
    setDragOn(false);

    //지도 이동 가능
    if (map.current) {
      map.current.getInteractions().forEach((interaction) => {
        interaction.setActive(true);
      });
    }
  };

  useEffect(() => {
    //마우스를 뗐을 때 바로 이미지 다운로드
    if (screenshotUrl && downloadLinkRef.current) {
      downloadLinkRef.current?.click();
      //다운로드 후에 영역 해제
      setSelection(null);
    }
  }, [screenshotUrl]);
  return (
    <div>
      {/* <h4>Project View for Tab {id}</h4> */}
      <ProjectMap
        ref={mapRef}
        dragOn={dragOn}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {view && (
          <>
            <ToolBar>
              <ToolButton
                onClick={() => {
                  setDragOn(!dragOn);
                }}
              >
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
            {selection && (
              <SelectedBox
                style={{
                  left: selection.x,
                  top: selection.y,
                  width: selection.width,
                  height: selection.height,
                }}
              />
            )}
            <a
              ref={downloadLinkRef}
              style={{ display: "none" }}
              href={screenshotUrl}
              download="screenshot.png"
            >
              Download Screenshot
            </a>
          </>
        )}
      </ProjectMap>
    </div>
  );
};

export default CustomDetection;
