import React, { useState, useEffect } from "react";
import { useFood } from "../contexts/FoodContext";
import { useNavigate } from "react-router-dom"; // 페이지 이동 훅
import styles from "../components/RestaurantList.module.css"; // 기존 스타일 재활용

const Home = () => {
  const { restaurants, searchPlaces, myLoc, locationStatus } = useFood();
  const navigate = useNavigate();

  // --- 상태 관리 ---
  const [category, setCategory] = useState("한식"); // 현재 카테고리
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const itemsPerPage = 4; // 페이지당 4개씩

  // --- 1. 카테고리가 바뀌거나 위치가 잡히면 검색 실행 ---
  useEffect(() => {
    if (myLoc) {
      searchPlaces(`${category} 맛집`); // 예: "한식 맛집", "일식 맛집"
      setCurrentPage(1); // 카테고리 바꾸면 1페이지로 초기화
    }
  }, [category, myLoc]); // category나 myLoc이 변할 때마다 실행

  // --- 2. 페이지네이션 계산 로직 (알고리즘) ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = restaurants.slice(indexOfFirstItem, indexOfLastItem);

  // 페이지 번호들 만들기 (예: 데이터가 10개면 [1, 2, 3])
  const totalPages = Math.ceil(restaurants.length / itemsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // --- 스타일 ---
  const tabStyle = (isActive) => ({
    flex: 1,
    padding: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    borderBottom: isActive ? "3px solid #FEE500" : "1px solid #ddd",
    color: isActive ? "#333" : "#aaa",
    textAlign: "center",
    backgroundColor: "#fff",
  });

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <header style={{ textAlign: "center", marginBottom: "20px" }}>
        <h1>🏠 우리 동네 맛집</h1>
        <p style={{ fontSize: "12px", color: "#666" }}>{locationStatus}</p>
      </header>

      {/* 메뉴 추천 페이지로 가는 버튼 */}
      <button
        onClick={() => navigate("/recommend")}
        style={{
          width: "100%",
          padding: "15px",
          marginBottom: "20px",
          background: "linear-gradient(135deg, #6B8DD6 0%, #8E37D7 100%)",
          color: "white",
          border: "none",
          borderRadius: "12px",
          fontWeight: "bold",
          fontSize: "16px",
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        🤖 AI에게 메뉴 추천 받으러 가기 👉
      </button>

      {/* 카테고리 탭 (일식, 중식, 한식, 양식) */}
      <div style={{ display: "flex", marginBottom: "20px" }}>
        {["한식", "중식", "일식", "양식"].map((cat) => (
          <div
            key={cat}
            onClick={() => setCategory(cat)}
            style={tabStyle(category === cat)}
          >
            {cat}
          </div>
        ))}
      </div>

      {/* 리스트 출력 */}
      <ul className={styles.list}>
        {currentItems.length > 0 ? (
          currentItems.map((place) => (
            <li key={place.id} className={styles.card}>
              <div className={styles.header}>
                <span className={styles.placeName}>{place.place_name}</span>
                <span className={styles.distance}>{place.distance}m</span>
              </div>
              <div className={styles.address}>{place.road_address_name}</div>
              <a
                href={place.place_url}
                target="_blank"
                rel="noreferrer"
                className={styles.linkButton}
              >
                상세보기
              </a>
            </li>
          ))
        ) : (
          <p style={{ textAlign: "center", padding: "20px" }}>
            가게를 불러오는 중... 📡
          </p>
        )}
      </ul>

      {/* 페이지네이션 버튼 (넘버링) */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              border: "none",
              backgroundColor: currentPage === number ? "#333" : "#eee",
              color: currentPage === number ? "#fff" : "#333",
              cursor: "pointer",
            }}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;
