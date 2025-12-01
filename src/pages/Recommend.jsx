import React, { useState, useEffect } from "react";
import { useFood } from "../contexts/FoodContext";
import DislikeInput from "../components/DislikeInput";
import RestaurantList from "../components/RestaurantList";
import ReactMarkdown from "react-markdown";
import styles from "./css/Recommend.module.css";
import Pagination from "../components/Pagination";

const Recommend = () => {
  //컨텍스트에서 변수 가져옴
  const { aiResult, recommendMenu, isLoading, recommendRestaurants } =
    useFood();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  //추천 받으면 페이지 1로 변경
  useEffect(() => {
    setCurrentPage(1);
  }, [recommendRestaurants]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = recommendRestaurants.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🤖 AI 메뉴 추천</h1>

      <DislikeInput />

      <button
        onClick={recommendMenu}
        disabled={isLoading}
        className={styles.recommendButton}
      >
        {isLoading ? "AI가 맛집을 찾는 중... 🧠" : "오늘의 메뉴 추천받기 🚀"}
      </button>

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

      {recommendRestaurants.length > 0 && (
        <>
          <h3 className={styles.listTitle}>👇 추천 메뉴 판매 식당</h3>
          <RestaurantList restaurants={currentItems} />

          <Pagination
            totalItems={recommendRestaurants.length}
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
