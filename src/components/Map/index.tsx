import { useEffect, useState } from "react";
import { MapContainer, ScaleControl, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import "leaflet-fullscreen";
import "leaflet.heat";
import "./MapStyles.scss";
import styles from "./styles.module.scss";

import MapControls from "./MapControls";
import MapMenu from "./MapMenu";
import Legend from "./Legend";
import GradientBar from "./GradientBar";
import { Layers } from "./Layers";
import Shapefile from "./Shapefile";

import "leaflet-draw/dist/leaflet.draw.css";

import Geoman from "./DrawTools/Geoman";
import { ShapefileDownload } from "./DrawTools/ShapefileDownload";
import MenuSidebar from "./MenuSidebar";
import ChartsContainer from "./ChartsContainer";
import ToolBar from "./ToolBar";
import UploadData from "./UploadData";
import { useMapEvents } from "react-leaflet";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUploadStore } from "../../store/useUploadStore";
import { useUIStore } from "../../store/useUIStore";
import BottomNavMenu from "./BottomNavMenu";

const position: [number, number] = [-8.072111864818805, -38.38523229242289];
const bounds: [[number, number], [number, number]] = [
  [-10.579621910034739, -42.41821289062501], // sudoeste
  [-6.260697372951359, -33.97521972656251], // nordeste
];

// function PanMapOnSidebarToggle({
//   isSidebarVisible,
//   isTableVisible,
// }: {
//   isSidebarVisible: boolean;
//   isTableVisible: boolean;
// }) {
//   const map = useMap();

//   useEffect(() => {
//     const width = 540 / 2;
//     if (innerWidth > 1130) {
//       if (isSidebarVisible) {
//         map.panBy([-width, 0], { animate: true });
//       } else {
//         map.panBy([width, 0], { animate: true });
//       }
//     }
//   }, [isSidebarVisible, map]);

//   useEffect(() => {
//     const height = 290 / 2;
//     if (isTableVisible) {
//       map.panBy([0, height], { animate: true });
//     } else {
//       map.panBy([0, -height], { animate: true });
//     }
//   }, [isTableVisible, map]);

//   return null;
// }

function LocationShare() {
  const navigate = useNavigate();
  const map = useMap();

  useMapEvents({
    moveend: () => {
      const { lat, lng } = map.getCenter();
      const zoom = map.getZoom();
      navigate(`?lat=${lat}&lng=${lng}&z=${zoom}`, { replace: true });
    },
  });

  return null;
}

export default function Map() {
  const [loading, setLoading] = useState(true);

  const { isDrawToolsVisible } = useUIStore();

  const { upload } = useUploadStore();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const lat = parseFloat(searchParams.get("lat") || String(position[0]));
  const lng = parseFloat(searchParams.get("lng") || String(position[1]));
  const zoom = Math.max(8, parseInt(searchParams.get("z") || "10"));

  useEffect(() => {
    if (
      !searchParams.get("lat") ||
      !searchParams.get("lng") ||
      !searchParams.get("z")
    ) {
      navigate(`?lat=${lat}&lng=${lng}&z=${zoom}`, { replace: true });
    }
  }, [lat, lng, zoom, searchParams, navigate]);

  return (
    <>
      <div className={styles.mapContainer}>
        {true && loading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.loaderCircle}></div>
          </div>
        )}
        <MapContainer
          center={[lat, lng]}
          zoom={zoom}
          minZoom={8}
          maxBounds={bounds}
          maxBoundsViscosity={1.0}
          style={{ width: "100%", height: "100%" }}
          zoomControl={false}
        >
          <LocationShare />
          {/* 
          <PanMapOnSidebarToggle
            isSidebarVisible={isSidebarVisible}
            isTableVisible={isTableVisible}
          /> */}
          <MapMenu />
          <Legend />

          {upload.length > 0 &&
            upload.map((file, i) => {
              return <Shapefile key={i} data={file.feature as any} />;
            })}
          <ToolBar />
          <Layers setLoading={setLoading} />
          <ScaleControl position="bottomright" metric={true} imperial={false} />
          {<GradientBar />}
          <MenuSidebar />
          <BottomNavMenu />
          <ChartsContainer />
          <Geoman />
          {isDrawToolsVisible && (
            <>
              <ShapefileDownload />
            </>
          )}
          <UploadData />
          <MapControls />
        </MapContainer>
      </div>
    </>
  );
}
