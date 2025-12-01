import React, { createContext, useState, useEffect, useContext } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const FoodContext = createContext();

export function FoodProvider({ children }) {
  // --- 상태(State) 관리 ---
  const [restaurants, setRestaurants] = useState([]); // 가게 리스트
  const [myLoc, setMyLoc] = useState(null); // 내 위치
  const [locationStatus, setLocationStatus] = useState("위치 파악 중...");

  // AI 관련 상태
  const [aiResult, setAiResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dislikes, setDislikes] = useState([]);

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  // 1. 내 위치 잡기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          console.log("📍 GPS 수신 성공:", lat, lng); // 로그 확인
          setMyLoc({ lat, lng });
          setLocationStatus("내 위치를 찾았어요! 📍");
        },
        (err) => {
          console.error("GPS 실패:", err);
          setLocationStatus("위치 파악 실패 (기본 위치: 서울 시청)");
          setMyLoc({ lat: 37.566826, lng: 126.9786567 });
        }
      );
    } else {
      setLocationStatus("GPS 미지원 브라우저");
      setMyLoc({ lat: 37.566826, lng: 126.9786567 });
    }
  }, []);

  // 2. 카카오 검색 함수 (안전장치 추가됨)
  const searchPlaces = (keyword) => {
    // 🚨 중요: 여기서 왜 멈추는지 확인하는 로그
    if (!myLoc) {
      console.log("🚫 검색 중단: 아직 위치(myLoc)가 없습니다.");
      return;
    }
    if (!window.kakao || !window.kakao.maps) {
      console.log("🚫 검색 중단: 카카오 스크립트가 아직 로딩 안 됐습니다.");
      return;
    }

    console.log(`🔎 검색 시작: "${keyword}" (내 위치 기준)`);

    const ps = new window.kakao.maps.services.Places();
    const options = {
      location: new window.kakao.maps.LatLng(myLoc.lat, myLoc.lng),
      radius: 2000, // 반경 2km
      sort: window.kakao.maps.services.SortBy.DISTANCE,
    };

    ps.keywordSearch(
      keyword,
      (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          console.log(`✅ 검색 완료! ${data.length}개 발견`);
          setRestaurants(data);
        } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
          console.log("⚠️ 검색 결과가 0개입니다.");
          setRestaurants([]);
        } else {
          console.error("❌ 검색 에러:", status);
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

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const dislikeString =
        dislikes.length > 0 ? `제외할 음식: ${dislikes.join(", ")}.` : "";
      const prompt = `점심 메뉴 한 가지만 추천해줘. ${dislikeString}. 답변은 마크다운. 마지막 줄에 검색 키워드만 "@@@키워드@@@" 형식으로 작성.`;

      const res = await model.generateContent(prompt);
      const text = res.response.text();

      setAiResult(text.split("@@@")[0]);
      const match = text.match(/@@@(.*?)@@@/);

      // 검색어 추출되면 검색 실행
      if (match && match[1]) {
        searchPlaces(match[1]);
      } else {
        searchPlaces(text.slice(0, 5));
      }
    } catch (e) {
      console.error(e);
      setAiResult("에러가 발생했어요 ㅠㅠ");
    } finally {
      setIsLoading(false);
    }
  };

  // 싫어하는 음식 로직
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
  };

  return <FoodContext.Provider value={value}>{children}</FoodContext.Provider>;
}

export const useFood = () => useContext(FoodContext);
