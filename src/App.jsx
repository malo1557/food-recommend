// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FoodProvider } from "./contexts/FoodContext";
import Home from "./pages/Home";
import Recommend from "./pages/Recommend";
import "./index.css"; // 전역 스타일

function App() {
  return (
    <FoodProvider>
      <BrowserRouter>
        <Routes>
          {/* 기본 주소(/)로 오면 Home 보여주기 */}
          <Route path="/" element={<Home />} />
          {/* /recommend로 오면 AI 추천 페이지 보여주기 */}
          <Route path="/recommend" element={<Recommend />} />
        </Routes>
      </BrowserRouter>
    </FoodProvider>
  );
}

export default App;
