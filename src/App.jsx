import React from "react";
import styles from "./App.module.css";
import { FoodProvider, useFood } from "./contexts/FoodContext";
import Header from "./components/Header";
import DislikeInput from "./components/DislikeInput";
import RestaurantList from "./components/RestaurantList";
import ReactMarkdown from "react-markdown";

// ResultArea와 Button은 간단하니까 여기서 바로 만들거나 분리해도 됨
const MainContent = () => {
  const { result, recommendMenu, isLoading } = useFood();

  return (
    <div className={styles.container}>
      {" "}
      <Header />
      <DislikeInput />
      <button
        onClick={recommendMenu}
        disabled={isLoading}
        className={styles.recommendButton} // 스타일 적용
      >
        {isLoading ? "AI가 생각 중... 🧠" : "메뉴 추천받기 🚀"}
      </button>
      {/* 마크다운*/}
      <div className="markdown-body" style={{ marginTop: "20px" }}>
        <ReactMarkdown>{result}</ReactMarkdown>
      </div>
      <RestaurantList />
    </div>
  );
};

function App() {
  return (
    // FoodProvider가 모든 컴포넌트를 감싸고 있어서 데이터를 공급해줌
    <FoodProvider>
      <MainContent />
    </FoodProvider>
  );
}

export default App;
