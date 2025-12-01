import React from "react";
import styles from "./css/CategoryTabs.module.css";

const CategoryTabs = ({ categories, currentCategory, onSelect }) => {
  return (
    <div className={styles.container}>
      {categories.map((cat) => (
        <div
          key={cat}
          onClick={() => onSelect(cat)}
          className={`${styles.tab} ${
            currentCategory === cat ? styles.active : ""
          }`}
        >
          {cat}
        </div>
      ))}
    </div>
  );
};

export default CategoryTabs;
