import React, { memo } from "react";
import { useFood } from "../contexts/FoodContext";

const Header = memo(() => {
  const { locationStatus } = useFood(); // 필요한 것만 꺼내 씀

  console.log("Header 렌더링됨!"); // 최적화 확인용 로그

  return (
    <header style={{ textAlign: "center", marginBottom: "30px" }}>
      <h1>📍 점심 메뉴 추천</h1>
      <p style={{ color: "#666", fontSize: "14px" }}>{locationStatus}</p>
    </header>
  );
});

export default Header;
