import React, { useState, useEffect } from "react";
import { useFood } from "../contexts/FoodContext";
import { useNavigate } from "react-router-dom";
import styles from "./css/Home.module.css";

// 컴포넌트들 불러오기
import CategoryTabs from "../components/CategoryTabs"; // 카테고리 탭
import Pagination from "../components/Pagination"; //  페이지  넘버링
import RestaurantList from "../components/RestaurantList"; // 식당 리스트

const Home = () => {
  const { restaurants, searchPlaces, myLoc, locationStatus } = useFood();
  const navigate = useNavigate();

  // --- 상태 관리 ---
  const [category, setCategory] = useState("한식");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // --- 1. 데이터 로드 ---
  useEffect(() => {
    if (myLoc) {
      searchPlaces(`${category} 맛집`);
      setCurrentPage(1);
    }
  }, [category, myLoc]);

  // --- 2. 현재 페이지 데이터 자르기 ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = restaurants.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className={styles.container}>
      {/* 1. 카테고리 탭 */}
      <CategoryTabs
        categories={["한식", "중식", "일식", "양식"]}
        currentCategory={category}
        onSelect={setCategory}
      />

      {/* 2. 리스트 출력 */}
      <RestaurantList restaurants={currentItems} />

      {/* 3. 페이지네이션 */}
      <Pagination
        totalItems={restaurants.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Home;
