/* global kakao */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isMockMode, url } from "../store/ref";
import { getMockUser } from "../mock/jobs";
import { getProfileImageSrc } from "../utils/imageSrc";
import styles from "../css/Map.module.css";

const DEFAULT_LOCATION = { lat: 37.529325, lon: 126.965706 };

const loadKakaoMapScript = (callback, onError) => {
  if (window.kakao?.maps) {
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
      if (window.kakao?.maps) {
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
    if (window.kakao?.maps) {
      window.kakao.maps.load(callback);
    } else {
      onError?.("Kakao Maps SDK loaded, but window.kakao.maps is unavailable.");
    }
  };
  script.onerror = () => onError?.("Failed to load Kakao Maps SDK script. Check the JavaScript key and Web platform domain.");
  document.head.appendChild(script);
};

const formatDate = (dateString) => {
  if (!dateString) return "-";

  return new Date(dateString).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const clampMapLevel = (level) => Math.max(1, Math.min(14, level));

const getCoordinateKey = (job) => {
  const lat = Number(job?.location?.mapY);
  const lon = Number(job?.location?.mapX);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return null;
  }

  return `${lat.toFixed(6)},${lon.toFixed(6)}`;
};

const Map = ({ jobList = [], location = DEFAULT_LOCATION }) => {
  const navigate = useNavigate();
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRefs = useRef([]);
  const overlayRefs = useRef([]);
  const clustererRef = useRef(null);
  const lastCenteredLocationRef = useRef(null);

  const [map, setMap] = useState(null);
  const [mapFailed, setMapFailed] = useState(false);
  const [mapErrorMessage, setMapErrorMessage] = useState("");

  const hasMapKey = Boolean(process.env.REACT_APP_MAP_JAVASCRIPT_APPKEY);

  const jobGroups = useMemo(() => {
    const groups = new window.Map();

    jobList.forEach((job) => {
      const key = getCoordinateKey(job);
      if (!key) return;

      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key).push(job);
    });

    return Array.from(groups.values());
  }, [jobList]);

  const centerLocation = useMemo(() => {
    const propLat = Number(location?.lat);
    const propLon = Number(location?.lon);

    if (Number.isFinite(propLat) && Number.isFinite(propLon)) {
      return { lat: propLat, lon: propLon };
    }

    const firstJob = jobList.find((job) => getCoordinateKey(job));
    if (firstJob) {
      return {
        lat: Number(firstJob.location.mapY),
        lon: Number(firstJob.location.mapX),
      };
    }

    return DEFAULT_LOCATION;
  }, [jobList, location?.lat, location?.lon]);

  const fetchUser = useCallback(async (emailID) => {
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
  }, []);

  const clearMapObjects = useCallback(() => {
    overlayRefs.current.forEach((overlay) => overlay.setMap(null));
    markerRefs.current.forEach((marker) => marker.setMap(null));
    clustererRef.current?.clear?.();

    overlayRefs.current = [];
    markerRefs.current = [];
    clustererRef.current = null;
  }, []);

  const closeAllOverlays = useCallback(() => {
    overlayRefs.current.forEach((overlay) => overlay.setMap(null));
  }, []);

  const goDetail = useCallback(
    (jobId) => {
      navigate("/job-detail", { state: { _id: jobId } });
    },
    [navigate]
  );

  const stopOverlayWheel = useCallback((root) => {
    root.addEventListener(
      "wheel",
      (event) => {
        event.stopPropagation();
      },
      { passive: true }
    );
  }, []);

  const createSingleJobContent = useCallback(
    (job, userData) => {
      const root = document.createElement("div");
      root.className = styles.wrap;

      root.innerHTML = `
        <div class="${styles.info}">
          <div class="${styles.title}">
            <span>${job.title}</span>
            <button type="button" class="${styles.close}" aria-label="닫기">×</button>
          </div>
          <div class="${styles.body}">
            <div class="${styles.img}">
              <img src="${getProfileImageSrc(userData?.image)}" alt="">
            </div>
            <div class="${styles.desc}">
              <div class="${styles.ellipsis}">${job.location?.address || "주소 정보 없음"}</div>
              <div class="${styles.jibun}">${formatDate(job.workStartDate)} ~ ${formatDate(job.workEndDate)}</div>
              <button type="button" class="${styles.link}" data-id="${job._id}">일자리 보기 &gt;</button>
            </div>
          </div>
        </div>
      `;

      root.querySelector(`.${styles.close}`)?.addEventListener("click", () => closeAllOverlays());
      root.querySelector(`.${styles.link}`)?.addEventListener("click", (event) => {
        event.preventDefault();
        goDetail(event.currentTarget.dataset.id);
      });
      stopOverlayWheel(root);

      return root;
    },
    [closeAllOverlays, goDetail, stopOverlayWheel]
  );

  const createJobGroupContent = useCallback(
    (jobs) => {
      const root = document.createElement("div");
      root.className = styles.wrap;

      root.innerHTML = `
        <div class="${styles.info}">
          <div class="${styles.title}">
            <span>총 ${jobs.length}건의 일자리</span>
            <button type="button" class="${styles.close}" aria-label="닫기">×</button>
          </div>
          <div class="${styles.body} ${styles.positionJob}">
            ${jobs
              .map(
                (job) => `
                  <div class="${styles.jobItem}">
                    <div class="${styles.sametitle}">${job.title}</div>
                    <div class="${styles.samejibun}">${formatDate(job.workStartDate)} ~ ${formatDate(job.workEndDate)}</div>
                    <button type="button" class="${styles.link}" data-id="${job._id}">일자리 보기 &gt;</button>
                  </div>
                `
              )
              .join("")}
          </div>
        </div>
      `;

      root.querySelector(`.${styles.close}`)?.addEventListener("click", () => closeAllOverlays());
      root.querySelectorAll(`.${styles.link}`).forEach((link) => {
        link.addEventListener("click", (event) => {
          event.preventDefault();
          goDetail(event.currentTarget.dataset.id);
        });
      });
      stopOverlayWheel(root);

      return root;
    },
    [closeAllOverlays, goDetail, stopOverlayWheel]
  );

  const changeMapLevel = (direction) => {
    if (!map) return;
    map.setLevel(clampMapLevel(map.getLevel() + direction));
  };

  const handleZoomButtonClick = (event, direction) => {
    event.preventDefault();
    event.stopPropagation();
    changeMapLevel(direction);
  };

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

        const kakaoMap = new kakao.maps.Map(mapContainer, {
          center: new kakao.maps.LatLng(centerLocation.lat, centerLocation.lon),
          level: 3,
          draggable: true,
          scrollwheel: false,
        });

        kakaoMap.setDraggable(true);
        kakaoMap.setZoomable(false);
        kakaoMap.setKeyboardShortcuts(true);
        mapRef.current = kakaoMap;
        lastCenteredLocationRef.current = `${centerLocation.lat},${centerLocation.lon}`;
        setMap(kakaoMap);

        window.requestAnimationFrame(() => {
          kakaoMap.relayout();
          kakaoMap.setCenter(new kakao.maps.LatLng(centerLocation.lat, centerLocation.lon));
        });
      },
      (message) => {
        setMapErrorMessage(message);
        setMapFailed(true);
      }
    );
  }, [centerLocation.lat, centerLocation.lon, hasMapKey, mapFailed]);

  useEffect(() => {
    if (!map) return;

    const nextLocationKey = `${centerLocation.lat},${centerLocation.lon}`;
    if (lastCenteredLocationRef.current !== nextLocationKey) {
      map.setCenter(new kakao.maps.LatLng(centerLocation.lat, centerLocation.lon));
      lastCenteredLocationRef.current = nextLocationKey;
    }
  }, [centerLocation.lat, centerLocation.lon, map]);

  useEffect(() => {
    if (!map) return undefined;

    let canceled = false;
    clearMapObjects();

    const createMarkers = async () => {
      if (jobGroups.length === 0) return;

      const bounds = new kakao.maps.LatLngBounds();
      const markers = [];
      const overlays = [];

      for (const jobs of jobGroups) {
        const representativeJob = jobs[0];
        const position = new kakao.maps.LatLng(Number(representativeJob.location.mapY), Number(representativeJob.location.mapX));
        const marker = new kakao.maps.Marker({ position });
        const content =
          jobs.length > 1
            ? createJobGroupContent(jobs)
            : createSingleJobContent(representativeJob, await fetchUser(representativeJob.emailID));

        const overlay = new kakao.maps.CustomOverlay({
          content,
          position,
          yAnchor: 1.15,
          zIndex: 20,
        });

        kakao.maps.event.addListener(marker, "click", () => {
          closeAllOverlays();
          overlay.setMap(map);
        });

        markers.push(marker);
        overlays.push(overlay);
        bounds.extend(position);
      }

      if (canceled) {
        overlays.forEach((overlay) => overlay.setMap(null));
        markers.forEach((marker) => marker.setMap(null));
        return;
      }

      markerRefs.current = markers;
      overlayRefs.current = overlays;

      if (kakao.maps.MarkerClusterer) {
        clustererRef.current = new kakao.maps.MarkerClusterer({
          map,
          averageCenter: true,
          minLevel: 6,
        });
        clustererRef.current.addMarkers(markers);
      } else {
        markers.forEach((marker) => marker.setMap(map));
      }

      if (markers.length === 1) {
        map.setCenter(markers[0].getPosition());
      } else {
        map.setBounds(bounds);
      }
    };

    createMarkers();

    return () => {
      canceled = true;
      clearMapObjects();
    };
  }, [clearMapObjects, closeAllOverlays, createJobGroupContent, createSingleJobContent, fetchUser, jobGroups, map]);

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
