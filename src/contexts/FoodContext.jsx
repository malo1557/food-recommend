import React, { createContext, useState, useEffect, useContext } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const FoodContext = createContext();

export function FoodProvider({ children }) {
  // --- 상태(State) 관리 ---
  const [restaurants, setRestaurants] = useState([]); // 가게 리스트
  const [myLoc, setMyLoc] = useState(null); // 내 위치
  const [locationStatus, setLocationStatus] = useState("위치 파악 중...");

  // AI 및 기타 상태
  const [aiResult, setAiResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dislikes, setDislikes] = useState([]);

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  // 1. 내 위치 잡기 (진주 기본값 설정 포함)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          // console.log("📍 GPS 수신 성공:", lat, lng);
          setMyLoc({ lat, lng });
          setLocationStatus("내 위치를 찾았어요! 📍");
        },
        (err) => {
          console.error("GPS 실패:", err);
          setLocationStatus("위치 파악 실패 (기본 위치: 진주)");
          setMyLoc({ lat: 35.1585, lng: 128.1054 });
        }
      );
    } else {
      setLocationStatus("GPS 미지원 브라우저");
      setMyLoc({ lat: 35.1585, lng: 128.1054 });
    }
  }, []);

  // 🆕 ✨ 데이터 초기화 함수 (청소기)
  const resetData = () => {
    setRestaurants([]);
    setAiResult("");
  };

  // 2. 카카오 검색 함수
  const searchPlaces = (keyword) => {
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
        if (status === window.kakao.maps.services.Status.OK) {
          setRestaurants(data);
        } else {
          setRestaurants([]);
        }
      },
      options
    );
  };

  // 3. AI 추천 함수
  const recommendMenu = async () => {
    if (!myLoc) return alert("위치 정보를 기다리고 있어요!");
    setIsLoading(true);
    setAiResult("Gemini가 고민 중... 🤔");
    setRestaurants([]); // 검색 전 기존 리스트 비우기

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const dislikeString =
        dislikes.length > 0 ? `제외할 음식: ${dislikes.join(", ")}.` : "";
      const prompt = `점심 메뉴 한 가지만 추천해줘. ${dislikeString}. 답변은 마크다운. 마지막 줄에 검색 키워드만 "@@@키워드@@@" 형식으로 작성.`;

      const res = await model.generateContent(prompt);
      const text = res.response.text();

      setAiResult(text.split("@@@")[0]);
      const match = text.match(/@@@(.*?)@@@/);

      if (match && match[1]) searchPlaces(match[1]);
      else searchPlaces(text.slice(0, 5));
    } catch (e) {
      console.error(e);
      setAiResult("에러가 발생했어요 ㅠㅠ");
    } finally {
      setIsLoading(false);
    }
  };

  // 싫어하는 음식 관리
  const addDislike = (food) => {
    if (food && !dislikes.includes(food)) setDislikes([...dislikes, food]);
  };
  const removeDislike = (food) => {
    setDislikes(dislikes.filter((item) => item !== food));
  };

  const value = {
    restaurants,
    myLoc,
    locationStatus,
    aiResult,
    isLoading,
    dislikes,
    searchPlaces,
    recommendMenu,
    addDislike,
    removeDislike,
    resetData, // 👈 Export 필수!
  };

  return <FoodContext.Provider value={value}>{children}</FoodContext.Provider>;
}

export const useFood = () => useContext(FoodContext);
