import React, { useState } from "react";
import { useFood } from "../contexts/FoodContext";
import styles from "./DislikeInput.module.css";

const DislikeInput = () => {
  const { dislikes, addDislike, removeDislike } = useFood();
  const [input, setInput] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && input.trim() !== "") {
      addDislike(input.trim());
      setInput("");
    }
  };

  return (
    <div className={styles.wrapper}>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="싫어하는 음식 입력 후 엔터 (예: 오이)"
        className={styles.input}
      />
      <div className={styles.tagContainer}>
        {dislikes.map((item, idx) => (
          <span
            key={idx}
            onClick={() => removeDislike(item)}
            className={styles.tag}
          >
            🚫 {item} <span className={styles.closeIcon}>✕</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default DislikeInput;
