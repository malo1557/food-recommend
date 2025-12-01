import React from "react";
import styles from "./css/Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>© 2025 AI 맛집 추천 . All rights reserved.</p>
      <p>Data provided by Kakao Map & Google Gemini</p>
    </footer>
  );
};

export default Footer;
