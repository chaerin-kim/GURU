/* global kakao */
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { isMockMode, url } from "../store/ref";
import { getMockUser } from "../mock/jobs";
import styles from "../css/Map.module.css";

const loadKakaoMapScript = (callback, onError) => {
  if (window.kakao && window.kakao.maps) {
    window.kakao.maps.load(callback);
    return;
  }

  const appKey = process.env.REACT_APP_MAP_JAVASCRIPT_APPKEY;
  if (!appKey) {
    onError?.();
    return;
  }

  const existingScript = document.querySelector('script[data-kakao-map="true"]');
  if (existingScript) {
    existingScript.addEventListener("load", () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(callback);
      } else {
        onError?.();
      }
    });
    existingScript.addEventListener("error", () => onError?.());
    return;
  }

  const script = document.createElement("script");
  const mapUrl = process.env.REACT_APP_MAP_URL || "//dapi.kakao.com/v2/maps/sdk.js?";
  script.src = `${mapUrl}appkey=${appKey}&libraries=services,clusterer&autoload=false`;
  script.async = true;
  script.dataset.kakaoMap = "true";
  script.onload = () => {
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(callback);
    } else {
      onError?.();
    }
  };
  script.onerror = () => onError?.();
  document.head.appendChild(script);
};

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(dateString).toLocaleDateString("ko-KR", options);
};

const Map = ({ jobList = [], location = {} }) => {
  const navigate = useNavigate();
  const [map, setMap] = useState(null);
  const [mapFailed, setMapFailed] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [samePositionJobs, setSamePositionJobs] = useState([]);
  const hasMapKey = Boolean(process.env.REACT_APP_MAP_JAVASCRIPT_APPKEY);
  const shouldShowMockMap = isMockMode || !hasMapKey || mapFailed;

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
    if (shouldShowMockMap) return;

    loadKakaoMapScript(
      () => {
        const mapContainer = document.getElementById("map");
        if (!mapContainer) {
          setMapFailed(true);
          return;
        }

        const mapOption = {
          center: new kakao.maps.LatLng(location.lat, location.lon),
          level: 3,
        };

        setMap(new kakao.maps.Map(mapContainer, mapOption));
      },
      () => setMapFailed(true)
    );
  }, [shouldShowMockMap, location.lat, location.lon]);

  useEffect(() => {
    if (map) {
      const moveLatLon = new kakao.maps.LatLng(location.lat, location.lon);
      map.setCenter(moveLatLon);
    }
  }, [location, map]);

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

      const imgSrc = userData.image ? `${url}/${userData.image}` : `${process.env.PUBLIC_URL}/img/common/no_img.jpg`;
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

  if (shouldShowMockMap) {
    const displayJobs = jobList.filter(Boolean);
    const validJobs = displayJobs.filter((job) => job.location?.mapX && job.location?.mapY);
    const firstJob = validJobs[0];
    const centerLat = Number(firstJob?.location?.mapY || location.lat || 37.529325);
    const centerLon = Number(firstJob?.location?.mapX || location.lon || 126.965706);
    const lonValues = validJobs.map((job) => Number(job.location.mapX));
    const latValues = validJobs.map((job) => Number(job.location.mapY));
    const minLon = Math.min(...lonValues, centerLon) - 0.02;
    const maxLon = Math.max(...lonValues, centerLon) + 0.02;
    const minLat = Math.min(...latValues, centerLat) - 0.015;
    const maxLat = Math.max(...latValues, centerLat) + 0.015;
    const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${minLon}%2C${minLat}%2C${maxLon}%2C${maxLat}&layer=mapnik&marker=${centerLat}%2C${centerLon}`;

    return (
      <div className={styles.mockMap} aria-label="Job location map">
        <iframe className={styles.osmFrame} title="Job location map" src={mapSrc} loading="lazy"></iframe>
        <div className={styles.mapSummary}>
          <strong>{displayJobs.length}</strong>
          <span>offline jobs</span>
        </div>
      </div>
    );
  }

  return <div id="map" className={styles.map}></div>;
};

export default Map;
