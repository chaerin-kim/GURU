const DEFAULT_COORDS = { mapX: 126.978, mapY: 37.5665 };

export const loadKakaoMaps = () =>
  new Promise((resolve, reject) => {
    if (window.kakao?.maps?.services) {
      window.kakao.maps.load(() => resolve(window.kakao));
      return;
    }

    const appKey = process.env.REACT_APP_MAP_JAVASCRIPT_APPKEY?.trim();
    if (!appKey) {
      reject(new Error("Missing Kakao JavaScript key"));
      return;
    }

    const existingScript = document.querySelector('script[data-kakao-map="true"]');
    if (existingScript) {
      existingScript.addEventListener("load", () => {
        if (window.kakao?.maps?.services) {
          window.kakao.maps.load(() => resolve(window.kakao));
        } else {
          reject(new Error("Kakao Maps SDK did not expose services"));
        }
      });
      existingScript.addEventListener("error", () => reject(new Error("Failed to load Kakao Maps SDK")));
      return;
    }

    const script = document.createElement("script");
    const mapUrl = process.env.REACT_APP_MAP_URL || "https://dapi.kakao.com/v2/maps/sdk.js?";
    script.src = `${mapUrl}appkey=${appKey}&libraries=services,clusterer&autoload=false`;
    script.async = true;
    script.dataset.kakaoMap = "true";
    script.onload = () => {
      if (window.kakao?.maps?.services) {
        window.kakao.maps.load(() => resolve(window.kakao));
      } else {
        reject(new Error("Kakao Maps SDK did not expose services"));
      }
    };
    script.onerror = () => reject(new Error("Failed to load Kakao Maps SDK"));
    document.head.appendChild(script);
  });

export const geocodeAddress = async (address) => {
  if (!address) return DEFAULT_COORDS;

  const kakao = await loadKakaoMaps();
  const geocoder = new kakao.maps.services.Geocoder();

  return new Promise((resolve) => {
    geocoder.addressSearch(address, (result, status) => {
      if (status === kakao.maps.services.Status.OK && result?.[0]) {
        resolve({ mapX: result[0].x, mapY: result[0].y });
        return;
      }

      resolve(DEFAULT_COORDS);
    });
  });
};

export const getDefaultCoords = () => DEFAULT_COORDS;
