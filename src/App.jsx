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
          <Header />
          <main style={{ flex: 1 }}>
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
