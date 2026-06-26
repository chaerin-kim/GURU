/* global kakao */
import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { isMockMode, url } from "../store/ref";
import { getMockUser } from "../mock/jobs";
import { getProfileImageSrc } from "../utils/imageSrc";
import styles from "../css/Map.module.css";

const loadKakaoMapScript = (callback, onError) => {
  if (window.kakao && window.kakao.maps) {
    window.kakao.maps.load(callback);
    return;
  }

  const appKey = process.env.REACT_APP_MAP_JAVASCRIPT_APPKEY?.trim();
  if (!appKey) {
    onError?.("Missing Netlify environment variable: REACT_APP_MAP_JAVASCRIPT_APPKEY");
    return;
  }

  const existingScript = document.querySelector('script[data-kakao-map="true"]');
  if (existingScript) {
    existingScript.addEventListener("load", () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(callback);
      } else {
        onError?.("Kakao Maps SDK loaded, but window.kakao.maps is unavailable.");
      }
    });
    existingScript.addEventListener("error", () => onError?.("Failed to load Kakao Maps SDK script."));
    return;
  }

  const script = document.createElement("script");
  const mapUrl = process.env.REACT_APP_MAP_URL || "https://dapi.kakao.com/v2/maps/sdk.js?";
  script.src = `${mapUrl}appkey=${appKey}&libraries=services,clusterer&autoload=false`;
  script.async = true;
  script.dataset.kakaoMap = "true";
  script.onload = () => {
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(callback);
    } else {
      onError?.("Kakao Maps SDK loaded, but window.kakao.maps is unavailable.");
    }
  };
  script.onerror = () => onError?.("Failed to load Kakao Maps SDK script. Check the JavaScript key and Web platform domain.");
  document.head.appendChild(script);
};

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(dateString).toLocaleDateString("ko-KR", options);
};

const clampMapLevel = (level) => Math.max(1, Math.min(14, level));

const Map = ({ jobList = [], location = {} }) => {
  const navigate = useNavigate();
  const [map, setMap] = useState(null);
  const [mapFailed, setMapFailed] = useState(false);
  const [mapErrorMessage, setMapErrorMessage] = useState("");
  const [markers, setMarkers] = useState([]);
  const [samePositionJobs, setSamePositionJobs] = useState([]);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const lastCenteredLocationRef = useRef(null);
  const hasMapKey = Boolean(process.env.REACT_APP_MAP_JAVASCRIPT_APPKEY);

  const findSamePositionJobs = useCallback((jobs) => {
    const samePositions = [];
    const checkedPositions = new Set();

    jobs.forEach((job, index) => {
      const jobPos = `${job.location.mapX},${job.location.mapY}`;
      if (checkedPositions.has(jobPos)) return;

      const sameJobs = jobs.filter((otherJob, otherIndex) => index !== otherIndex && job.location.mapX === otherJob.location.mapX && job.location.mapY === otherJob.location.mapY);

      if (sameJobs.length > 0) {
        samePositions.push([job, ...sameJobs]);
        checkedPositions.add(jobPos);
      }
    });

    return samePositions;
  }, []);

  useEffect(() => {
    setSamePositionJobs(findSamePositionJobs(jobList));
  }, [jobList, findSamePositionJobs]);

  useEffect(() => {
    if (!hasMapKey || mapFailed || mapRef.current) return;

    loadKakaoMapScript(
      () => {
        const mapContainer = mapContainerRef.current;
        if (!mapContainer) {
          setMapErrorMessage("Map container was not found.");
          setMapFailed(true);
          return;
        }

        const mapOption = {
          center: new kakao.maps.LatLng(location.lat, location.lon),
          level: 3,
          draggable: true,
          scrollwheel: true,
        };

        const kakaoMap = new kakao.maps.Map(mapContainer, mapOption);
        kakaoMap.setDraggable(true);
        kakaoMap.setZoomable(true);
        kakaoMap.setKeyboardShortcuts(true);
        mapRef.current = kakaoMap;
        lastCenteredLocationRef.current = `${location.lat},${location.lon}`;
        setMap(kakaoMap);

        window.requestAnimationFrame(() => {
          kakaoMap.relayout();
          kakaoMap.setCenter(new kakao.maps.LatLng(location.lat, location.lon));
        });
      },
      (message) => {
        setMapErrorMessage(message);
        setMapFailed(true);
      }
    );
  }, [hasMapKey, mapFailed, location.lat, location.lon]);

  useEffect(() => {
    const nextLocationKey = `${location.lat},${location.lon}`;
    if (map && lastCenteredLocationRef.current !== nextLocationKey) {
      const moveLatLon = new kakao.maps.LatLng(location.lat, location.lon);
      map.setCenter(moveLatLon);
      lastCenteredLocationRef.current = nextLocationKey;
    }
  }, [location.lat, location.lon, map]);

  const fetchUser = async (emailID) => {
    if (isMockMode) {
      return getMockUser(emailID);
    }

    try {
      const response = await fetch(`${url}/findUserData/${emailID}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch data", error);
      return null;
    }
  };

  const changeMapLevel = (direction) => {
    if (!map) return;
    map.setLevel(clampMapLevel(map.getLevel() + direction));
  };

  const handleZoomButtonClick = (event, direction) => {
    event.preventDefault();
    event.stopPropagation();
    changeMapLevel(direction);
  };

  const createOverlayContent = (job, imgSrc, workStartDate, workEndDate, isSamePositionJob, groupContent, groupIndex) => `
    <div class="${styles.wrap}">
      <div class="${styles.info}">
        <div class="${styles.title}">
          ${isSamePositionJob ? `${samePositionJobs[groupIndex].length} jobs` : job.title}
          <i class="fa-solid fa-xmark ${styles.close}" title="Close"></i>
        </div>
        <div class="${styles.body} ${isSamePositionJob ? styles.positionJob : ""}">
          ${
            isSamePositionJob
              ? groupContent
              : `
                <div class="${styles.img}">
                  <img src="${imgSrc}" alt="">
                </div>
                <div class="${styles.desc}">
                  <div class="${styles.ellipsis}">${job.location.address}</div>
                  <div class="${styles.jibun}">${workStartDate} ~ ${workEndDate}</div>
                  <div><a href="#" class="${styles.link}" data-id="${job._id}">Go to listing ></a></div>
                </div>
              `
          }
        </div>
      </div>
    </div>
  `;

  const createMarker = useCallback(
    async (job) => {
      const userData = await fetchUser(job.emailID);
      if (!userData) return null;

      const imgSrc = getProfileImageSrc(userData.image);
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(job.location.mapY, job.location.mapX),
      });

      const workStartDate = formatDate(job.workStartDate);
      const workEndDate = formatDate(job.workEndDate);
      const isSamePositionJob = samePositionJobs.some((group) => group.some((grouplist) => grouplist._id === job._id));
      const groupIndex = samePositionJobs.findIndex((group) => group.some((grouplist) => grouplist._id === job._id));
      const groupContent =
        groupIndex >= 0
          ? samePositionJobs[groupIndex]
              .map(
                (grouplist) => `
                  <div class="${styles.jobItem}">
                    <div class="${styles.sametitle}">${grouplist.title}</div>
                    <div class="${styles.samejibun}">${formatDate(grouplist.workStartDate)} ~ ${formatDate(grouplist.workEndDate)}</div>
                    <div><a href="#" class="${styles.link}" data-id="${grouplist._id}">Go to listing ></a></div>
                  </div>
                `
              )
              .join("")
          : "";

      const overlay = new kakao.maps.CustomOverlay({
        content: createOverlayContent(job, imgSrc, workStartDate, workEndDate, isSamePositionJob, groupContent, groupIndex),
        position: marker.getPosition(),
      });

      kakao.maps.event.addListener(marker, "click", () => {
        overlay.setMap(map);
      });

      const content = overlay.a.querySelector(`.${styles.wrap}`);
      content.querySelectorAll(`.${styles.close}`).forEach((closeBtn) => closeBtn.addEventListener("click", () => overlay.setMap(null)));
      content.querySelectorAll(`.${styles.link}`).forEach((link) =>
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const jobId = e.target.getAttribute("data-id");
          navigate("/job-detail", { state: { _id: jobId } });
        })
      );

      return marker;
    },
    [navigate, samePositionJobs, map]
  );

  useEffect(() => {
    if (map && jobList.length > 0) {
      const clusterer = new kakao.maps.MarkerClusterer({
        map,
        averageCenter: true,
        minLevel: 2.6,
      });

      const createMarkers = async () => {
        const newMarkers = await Promise.all(jobList.map(createMarker));
        const filteredMarkers = newMarkers.filter((marker) => marker !== null);
        setMarkers(filteredMarkers);
        clusterer.addMarkers(filteredMarkers);
      };

      createMarkers();
    }
  }, [map, jobList, createMarker, markers.length]);

  if (!hasMapKey || mapFailed) {
    return (
      <div className={styles.mapFallback}>
        <strong>Map is unavailable.</strong>
        <span>{mapErrorMessage || "Please check the Kakao JavaScript key and allowed site domain."}</span>
      </div>
    );
  }

  return (
    <div className={styles.mapShell}>
      <div ref={mapContainerRef} className={styles.map}></div>
      {map && (
        <div className={styles.zoomControls} aria-label="Map zoom controls">
          <button type="button" aria-label="Zoom in" title="Zoom in" onClick={(event) => handleZoomButtonClick(event, -1)}>
            +
          </button>
          <button type="button" aria-label="Zoom out" title="Zoom out" onClick={(event) => handleZoomButtonClick(event, 1)}>
            -
          </button>
        </div>
      )}
    </div>
  );
};

export default Map;
