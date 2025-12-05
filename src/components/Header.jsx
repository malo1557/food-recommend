import React, { memo } from "react";
import { NavLink } from "react-router-dom"; // 👈 NavLink 임포트 필수!
import { useFood } from "../contexts/FoodContext";
import styles from "./css/Header.module.css";

const Header = memo(() => {
  const { locationStatus } = useFood();

  return (
    <header className={styles.header}>
      {/* 1. 제목과 상태 */}
      <h1 className={styles.title}>🍴 점심 메뉴 추천</h1>

      <br />

      {/* 2. 네비게이션 메뉴 (탭) */}
      <nav className={styles.nav}>
        {/* 주변 식당 (홈) 버튼 */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.active : ""}`
          }
        >
          🏠 주변 식당
        </NavLink>

        {/* AI 추천 버튼 */}
        <NavLink
          to="/recommend"
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.active : ""}`
          }
        >
          🤖 AI 추천
        </NavLink>
      </nav>
    </header>
  );
});

export default Header;
