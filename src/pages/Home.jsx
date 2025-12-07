import React, { useState, useEffect } from "react";
import { useFood } from "../contexts/FoodContext";
import styles from "./css/Home.module.css";
import CategoryTabs from "../components/CategoryTabs";
import Pagination from "../components/Pagination";
import RestaurantList from "../components/RestaurantList";

const Home = () => {
  const { homeRestaurants, searchPlaces, myLoc, locationStatus } = useFood();

  const [category, setCategory] = useState("한식"); //카테고리
  const [currentPage, setCurrentPage] = useState(1); // 페이지 넘버링
  const itemsPerPage = 4; // 한 페이지에 보여줄 식당 개수

  //카테고리 변경시 페이지 1로 변경
  useEffect(() => {
    if (myLoc) {
      //  'home' 타입 지정
      searchPlaces(`${category} 맛집`, "home");
      setCurrentPage(1);
    }
  }, [category, myLoc]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = homeRestaurants.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>🏠 우리 동네 맛집</h1>
        <p className={styles.statusText}>{locationStatus}</p>
      </header>

      <CategoryTabs
        categories={["한식", "중식", "일식", "양식"]}
        currentCategory={category}
        onSelect={setCategory}
      />

      <ul className={styles.list}></ul>

      <RestaurantList restaurants={currentItems} />

      <Pagination
        totalItems={homeRestaurants.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Home;
