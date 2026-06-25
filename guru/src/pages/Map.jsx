/* global kakao */
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { isMockMode, url } from "../store/ref";
import { getMockUser } from "../mock/jobs";
import styles from "../css/Map.module.css";

// Kakao Maps API 스크립트를 동적으로 추가하는 함수
const loadKakaoMapScript = (callback) => {
  if (window.kakao && window.kakao.maps) {
    window.kakao.maps.load(callback);
    return;
  }

  const appKey = process.env.REACT_APP_MAP_JAVASCRIPT_APPKEY;
  if (!appKey) {
    console.error("Missing REACT_APP_MAP_JAVASCRIPT_APPKEY. Kakao map will not be loaded.");
    return;
  }

  const existingScript = document.querySelector('script[data-kakao-map="true"]');
  if (existingScript) {
    existingScript.addEventListener("load", () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(callback);
      }
    });
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
      console.error("Failed to load Kakao Maps API.");
    }
  };
  script.onerror = () => {
    console.error("Error loading Kakao Maps API script.");
  };
  document.head.appendChild(script);
};

// 날짜 포맷 함수
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(dateString).toLocaleDateString("ko-KR", options);
};

const Map = ({ jobList, location }) => {
  const navigate = useNavigate();
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [samePositionJobs, setSamePositionJobs] = useState([]);
  const hasMapKey = Boolean(process.env.REACT_APP_MAP_JAVASCRIPT_APPKEY);

  const findSamePositionJobs = useCallback((jobs) => {
    const samePositions = [];
    const checkedPositions = new Set();

    jobs.forEach((job, index) => {
      const jobPos = `${job.location.mapX},${job.location.mapY}`;
      if (checkedPositions.has(jobPos)) return;

      const sameJobs = jobs.filter((otherJob, otherIndex) => {
        return index !== otherIndex && job.location.mapX === otherJob.location.mapX && job.location.mapY === otherJob.location.mapY;
      });

      if (sameJobs.length > 0) {
        samePositions.push([job, ...sameJobs]);
        checkedPositions.add(jobPos);
      }
    });

    return samePositions;
  }, []);

  useEffect(() => {
    setSamePositionJobs(findSamePositionJobs(jobList));
    //console.log(samePositionJobs);
  }, [jobList, findSamePositionJobs]);

  useEffect(() => {
    if (!hasMapKey) return;

    loadKakaoMapScript(() => {
      const mapContainer = document.getElementById("map");
      if (!mapContainer) {
        console.error("Map container not found");
        return;
      }
      const mapOption = {
        center: new kakao.maps.LatLng(location.lat, location.lon),
        level: 3,
      };

      const mapInstance = new kakao.maps.Map(mapContainer, mapOption);
      setMap(mapInstance);
    });
  }, [hasMapKey, location.lat, location.lon]);

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

  const createOverlayContent = (job, imgSrc, workStartDate, workEndDate, isSamePositionJob, groupContent, groupIndex) => {
    return `
      <div class="${styles.wrap}">
        <div class="${styles.info}">
          <div class="${styles.title}">
            ${isSamePositionJob ? `총 ${samePositionJobs[groupIndex].length} 건의 일자리` : job.title}
            <i class="fa-solid fa-xmark ${styles.close}" title="닫기"></i>
          </div>
          <div class="${styles.body} ${isSamePositionJob ? styles.positionJob : ""}">
            ${
              isSamePositionJob
                ? groupContent
                : `
              <div class="${styles.img}">
                <img src="${imgSrc}">
              </div>
              <div class="${styles.desc}">
                <div class="${styles.ellipsis}">${job.location.address}</div>
                <div class="${styles.jibun}">${workStartDate} ~ ${workEndDate}</div>
                <div><a href="#" class="${styles.link}" data-id="${job._id}">리스트로 이동 ></a></div>
              </div>
            `
            }
          </div>
        </div>
      </div>
    `;
  };

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
                (grouplist, index) => `
              <div class="${styles.jobItem}" key="${index}">
                <div class="${styles.sametitle}">${grouplist.title}</div>
                <div class="${styles.samejibun}">${formatDate(grouplist.workStartDate)} ~ ${formatDate(grouplist.workEndDate)}</div>
                <div><a href="#" class="${styles.link}" data-id="${grouplist._id}">리스트로 이동 ></a></div>
              </div>
            `
              )
              .join("")
          : "";

      const overlay = new kakao.maps.CustomOverlay({
        content: createOverlayContent(job, imgSrc, workStartDate, workEndDate, isSamePositionJob, groupContent, groupIndex),
        position: marker.getPosition(),
      });

      kakao.maps.event.addListener(marker, "click", function () {
        overlay.setMap(map);
      });

      const content = overlay.a.querySelector(`.${styles.wrap}`);
      content.querySelectorAll(`.${styles.close}`).forEach((closeBtn) => closeBtn.addEventListener("click", () => overlay.setMap(null)));
      content.querySelectorAll(`.${styles.link}`).forEach((link) =>
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const jobId = e.target.getAttribute("data-id");
          navigate(`/job-detail`, { state: { _id: jobId } });
        })
      );

      return marker;
    },
    [navigate, samePositionJobs, map]
  );

  useEffect(() => {
    if (map && jobList.length > 0) {
      const clusterer = new kakao.maps.MarkerClusterer({
        map: map,
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

  return (
    <div>
      {hasMapKey ? (
        <div id="map" className={styles.map}></div>
      ) : (
        <div className={styles.mapFallback}>
          <strong>지도를 표시할 수 없습니다.</strong>
          <span>카카오 지도 앱키가 설정되면 이 영역에 지도가 표시됩니다.</span>
        </div>
      )}
    </div>
  );
};

export default Map;
