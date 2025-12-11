// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FoodProvider } from "./contexts/FoodContext";

// 👇 컴포넌트 불러오기
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Recommend from "./pages/Recommend";

// 👇 CSS 모듈 불러오기 (이거 필수!)
import styles from "./App.module.css";
import "./index.css"; // 전역 스타일(배경색 등)

function App() {
  return (
    <FoodProvider>
      <BrowserRouter>
        <div className={styles.container}>
          <Header />
          <main className={styles.main}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/recommend" element={<Recommend />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </FoodProvider>
  );
}

export default App;
