import React from "react";
import { useFood } from "../contexts/FoodContext";
import { useNavigate } from "react-router-dom";
import DislikeInput from "../components/DislikeInput"; // 기존 컴포넌트 활용
import ReactMarkdown from "react-markdown";
import styles from "../App.module.css"; // 기존 버튼 스타일 등 활용

const Recommend = () => {
  const { aiResult, recommendMenu, isLoading, restaurants } = useFood();
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <button
        onClick={() => navigate("/")}
        style={{
          background: "none",
          border: "none",
          fontSize: "24px",
          cursor: "pointer",
          marginBottom: "10px",
        }}
      >
        🔙
      </button>
      <h1 style={{ textAlign: "center" }}>🤖 AI 메뉴 추천</h1>

      <DislikeInput />

      <button
        onClick={recommendMenu}
        disabled={isLoading}
        className={styles.recommendButton}
      >
        {isLoading ? "AI가 생각 중... 🧠" : "메뉴 추천받기 🚀"}
      </button>

      <div
        className="markdown-body"
        style={{
          marginTop: "20px",
          padding: "15px",
          background: "#f9f9f9",
          borderRadius: "10px",
        }}
      >
        <ReactMarkdown>{aiResult}</ReactMarkdown>
      </div>

      {/* 추천된 메뉴의 검색 결과(가게)가 있다면 여기도 보여줌 */}
      {restaurants.length > 0 && (
        <div style={{ marginTop: "20px", textAlign: "center", color: "#666" }}>
          👇 추천 메뉴 파는 곳을 찾았어요! (홈에서 자세히 확인 가능)
        </div>
      )}
    </div>
  );
};

export default Recommend;
