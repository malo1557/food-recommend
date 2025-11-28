import React, { createContext, useState, useEffect, useContext } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. 컨텍스트 생성 (데이터를 담을 통)
const FoodContext = createContext();

export function FoodProvider({ children }) {
  // --- 상태(State) 관리 ---
  const [result, setResult] = useState("메뉴를 추천받아보세요! 😋");
  const [restaurants, setRestaurants] = useState([]);
  const [myLoc, setMyLoc] = useState(null);
  const [locationStatus, setLocationStatus] = useState("위치 파악 중...");
  const [dislikes, setDislikes] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  // --- 위치 가져오기 (useEffect) ---
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMyLoc({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationStatus("내 위치를 찾았어요! 📍");
          console.log(myLoc);
          if (myLoc === null) {
            setLocationStatus("gps 탐지 실패 기본위치 사용");
            setMyLoc({ lat: 35.164821, lng: 128.098462 });
          }
        },
        () => {
          setLocationStatus("위치 파악 실패 (기본 위치 사용)");
          setMyLoc({ lat: 35.164821, lng: 128.098462 });
          //35.164821, 128.098462
        }
      );
    }
  }, []);

  // --- 기능 함수들 ---
  const addDislike = (food) => {
    if (food && !dislikes.includes(food)) setDislikes([...dislikes, food]);
  };

  const removeDislike = (food) => {
    setDislikes(dislikes.filter((item) => item !== food));
  };

  const searchPlaces = (keyword) => {
    if (!window.kakao || !window.kakao.maps || !myLoc) return;
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

  const recommendMenu = async () => {
    if (!myLoc) return alert("위치 정보를 기다리고 있어요!");

    setIsLoading(true);
    setResult("Gemini가 고민 중... 🤔");
    setRestaurants([]);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const dislikeString =
        dislikes.length > 0 ? `제외할 음식: ${dislikes.join(", ")}.` : "";
      const prompt = `점심 메뉴 한가지만 추천해줘. ${dislikeString}. 답변은 마크다운. 마지막 줄에 검색 키워드만 "@@@키워드@@@" 형식으로 작성.`;

      const res = await model.generateContent(prompt);
      const text = res.response.text();

      setResult(text.split("@@@")[0]);
      const match = text.match(/@@@(.*?)@@@/);
      if (match && match[1]) searchPlaces(match[1]);
      else searchPlaces(text.slice(0, 5)); // 키워드 없으면 앞부분으로 검색
    } catch (e) {
      console.error(e);
      setResult("에러가 발생했어요 ㅠㅠ");
    } finally {
      setIsLoading(false);
    }
  };

  // --- 🎁 선물 포장 (Value 객체) ---
  const value = {
    result,
    restaurants,
    locationStatus,
    dislikes,
    isLoading, // 데이터
    addDislike,
    removeDislike,
    recommendMenu, // 함수
  };

  return <FoodContext.Provider value={value}>{children}</FoodContext.Provider>;
}

// 커스텀 훅 (사용하기 편하게)
export const useFood = () => useContext(FoodContext);
