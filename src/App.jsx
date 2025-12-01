// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FoodProvider } from "./contexts/FoodContext";

// 👇 컴포넌트 불러오기
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Recommend from "./pages/Recommend";

import "./index.css";

function App() {
  return (
    <FoodProvider>
      <BrowserRouter>
        {/* 1. 레이아웃 컨테이너 (스타일로 중앙 정렬 등 잡아주면 좋음) */}
        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            padding: "20px",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* 2. 헤더: 무조건 보임 */}
          <Header />

          {/* 3. 메인 콘텐츠: 주소에 따라 바뀜 (flex: 1로 남은 공간 다 차지하게) */}
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/recommend" element={<Recommend />} />
            </Routes>
          </main>

          {/* 4. 푸터: 무조건 보임 */}
          <Footer />
        </div>
      </BrowserRouter>
    </FoodProvider>
  );
}

export default App;
