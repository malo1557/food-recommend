import React, { createContext, useState, useEffect, useContext } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const FoodContext = createContext();

export function FoodProvider({ children }) {
  // --- 상태(State) 관리 ---
  const [homeRestaurants, setHomeRestaurants] = useState([]);
  const [recommendRestaurants, setRecommendRestaurants] = useState([]);

  const [myLoc, setMyLoc] = useState(null);
  const [locationStatus, setLocationStatus] = useState("위치 파악 중...");

  const [aiResult, setAiResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dislikes, setDislikes] = useState([]);

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  //좌표를 주소로 변환하는 함수 (Reverse Geocoding)
  const getAddress = (lat, lng) => {
    // 카카오 스크립트가 로딩 안 됐으면 중단
    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services)
      return;

    const geocoder = new window.kakao.maps.services.Geocoder();
    const callback = (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        // 주소 가져오기
        const address = result[0].address.address_name;
        setLocationStatus(`현재 위치: ${address}`);
      } else {
        setLocationStatus("주소를 불러올 수 없어요");
      }
    };

    // 카카오는 경도 위도 순서
    geocoder.coord2Address(lng, lat, callback);
  };

  // 1. 내 위치 잡기 (수정됨!)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          console.log("GPS 수신 성공:", lat, lng);

          setMyLoc({ lat, lng });
          getAddress(lat, lng);
        },
        (err) => {
          console.error("GPS 실패:", err);
          // 실패 시 기본 위치(진주) 설정
          const defaultLat = 35.1585;
          const defaultLng = 128.1054;

          setMyLoc({ lat: defaultLat, lng: defaultLng });
          // 기본 위치의 주소도 가져오기
          getAddress(defaultLat, defaultLng);
        }
      );
    } else {
      const defaultLat = 35.1585;
      const defaultLng = 128.1054;
      setMyLoc({ lat: defaultLat, lng: defaultLng });
      getAddress(defaultLat, defaultLng);
    }
  }, []);

  const resetAiResult = () => {
    setAiResult("");
  };

  const searchPlaces = (keyword, type = "home") => {
    if (!myLoc || !window.kakao || !window.kakao.maps) return;

    const ps = new window.kakao.maps.services.Places();
    const options = {
      location: new window.kakao.maps.LatLng(myLoc.lat, myLoc.lng),
      radius: 3000,
      sort: window.kakao.maps.services.SortBy.DISTANCE,
    };

    ps.keywordSearch(
      keyword,
      (data, status) => {
        const result =
          status === window.kakao.maps.services.Status.OK ? data : [];
        if (type === "home") setHomeRestaurants(result);
        else setRecommendRestaurants(result);
      },
      options
    );
  };

  const recommendMenu = async () => {
    if (!myLoc) return alert("위치 정보를 기다리고 있어요!");
    setIsLoading(true);
    setAiResult("Gemini가 고민 중... 🤔");
    setRecommendRestaurants([]);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const dislikeString =
        dislikes.length > 0 ? `제외할 음식: ${dislikes.join(", ")}.` : "";
      const prompt = `점심 메뉴 한 가지만 추천해줘. ${dislikeString}. 답변은 항상 마크다운. 음식에 대한 설명도 꼭 넣어줘 마지막 줄에 검색 키워드는 반드시 "@@@키워드@@@" 형식으로 작성.`;

      const res = await model.generateContent(prompt);
      const text = res.response.text();

      setAiResult(text.split("@@@")[0]);
      const match = text.match(/@@@(.*?)@@@/);

      if (match && match[1]) searchPlaces(match[1], "recommend");
      else searchPlaces(text.slice(0, 5), "recommend");
    } catch (e) {
      console.error(e);
      setAiResult("에러가 발생했어요 ㅠㅠ");
    } finally {
      setIsLoading(false);
    }
  };

  const addDislike = (food) => {
    if (food && !dislikes.includes(food)) setDislikes([...dislikes, food]);
  };
  const removeDislike = (food) => {
    setDislikes(dislikes.filter((item) => item !== food));
  };

  const value = {
    homeRestaurants,
    recommendRestaurants,
    myLoc,
    locationStatus,
    aiResult,
    isLoading,
    dislikes,
    searchPlaces,
    recommendMenu,
    addDislike,
    removeDislike,
    resetAiResult,
  };

  return <FoodContext.Provider value={value}>{children}</FoodContext.Provider>;
}

export const useFood = () => useContext(FoodContext);
