import React, { createContext, useState, useEffect, useContext } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const FoodContext = createContext();

export function FoodProvider({ children }) {
  // --- 상태(State) 분리! ---
  const [homeRestaurants, setHomeRestaurants] = useState([]); //  홈 화면용 데이터
  const [recommendRestaurants, setRecommendRestaurants] = useState([]); //  AI 추천용 데이터

  const [myLoc, setMyLoc] = useState(null);
  const [locationStatus, setLocationStatus] = useState("위치 파악 중...");

  const [aiResult, setAiResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dislikes, setDislikes] = useState([]);

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  // 1. 내 위치 잡기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMyLoc({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationStatus("내 위치를 찾았어요! ");
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

  // 2. 카카오 검색 함수 (type 파라미터 추가!)
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

        // 🚩 type에 따라 다른 변수에 저장
        if (type === "home") {
          setHomeRestaurants(result);
        } else {
          setRecommendRestaurants(result);
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
    setRecommendRestaurants([]); // AI 리스트만 비우기

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const dislikeString =
        dislikes.length > 0 ? `제외할 음식: ${dislikes.join(", ")}.` : "";
      const prompt = `점심 메뉴 한 가지만 추천해줘. ${dislikeString}. 답변은 마크다운. 마지막 줄에 검색 키워드만 "@@@키워드@@@" 형식으로 작성.`;

      const res = await model.generateContent(prompt);
      const text = res.response.text();

      setAiResult(text.split("@@@")[0]);
      const match = text.match(/@@@(.*?)@@@/);

      // 🚩 검색할 때 'recommend' 타입으로 요청!
      if (match && match[1]) searchPlaces(match[1], "recommend");
      else searchPlaces(text.slice(0, 5), "recommend");
    } catch (e) {
      console.error(e);
      setAiResult("에러가 발생했어요 ㅠㅠ");
    } finally {
      setIsLoading(false);
    }
  };

  // 4. 데이터 초기화 (AI 쪽 텍스트만 지움, 데이터는 유지 가능)
  const resetAiResult = () => {
    setAiResult("");
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
