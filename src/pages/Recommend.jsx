import React, { useState, useEffect } from "react";
import { useFood } from "../contexts/FoodContext";
import DislikeInput from "../components/DislikeInput";
import RestaurantList from "../components/RestaurantList";
import ReactMarkdown from "react-markdown";
import styles from "./css/Recommend.module.css";
import Pagination from "../components/Pagination";

const Recommend = () => {
  // resetData 함수 가져오기
  const { aiResult, recommendMenu, isLoading, restaurants, resetData } =
    useFood();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // 🆕 ✨ 1. 페이지 처음 들어오면 데이터 싹 비우기 (청소)
  useEffect(() => {
    resetData();
  }, []);

  // ✨ 2. 새로운 추천 결과가 나오면 1페이지로 이동
  useEffect(() => {
    setCurrentPage(1);
  }, [restaurants]);

  // --- 데이터 자르기 로직 ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = restaurants.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🤖 AI 메뉴 추천</h1>

      {/* 1. 싫어하는 음식 입력 */}
      <DislikeInput />

      {/* 2. 추천 요청 버튼 */}
      <button
        onClick={recommendMenu}
        disabled={isLoading}
        className={styles.recommendButton}
      >
        {isLoading ? "AI가 맛집을 찾는 중... 🧠" : "오늘의 메뉴 추천받기 🚀"}
      </button>

      {/* 3. AI 응답 결과 */}
      <div className={styles.resultBox}>
        {aiResult ? (
          <div className="markdown-body">
            <ReactMarkdown>{aiResult}</ReactMarkdown>
          </div>
        ) : (
          <p style={{ textAlign: "center", color: "#aaa" }}>
            버튼을 눌러 AI에게 추천을 받아보세요!
          </p>
        )}
      </div>

      {/* 4. 추천된 메뉴의 가게 리스트 & 페이징 */}
      {restaurants.length > 0 && (
        <>
          <h3 className={styles.listTitle}>👇 추천 메뉴 판매 식당</h3>

          <RestaurantList restaurants={currentItems} />

          <Pagination
            totalItems={restaurants.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default Recommend;
