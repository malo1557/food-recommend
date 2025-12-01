import React, { memo } from "react";
// CSS 파일 경로가 components/css 안에 있다면 경로를 맞춰주세요!
import styles from "./css/RestaurantList.module.css";

// props로 'restaurants' 데이터를 받아옵니다.
const RestaurantList = memo(({ restaurants }) => {
  // 데이터가 없거나 비어있을 때 처리
  if (!restaurants || restaurants.length === 0) {
    return <p className={styles.loading}>가게를 불러오는 중... 📡</p>;
  }

  return (
    <ul className={styles.list}>
      {restaurants.map((place) => (
        <li key={place.id} className={styles.card}>
          <div className={styles.header}>
            <span className={styles.placeName}>{place.place_name}</span>
            <span className={styles.distance}>{place.distance}m</span>
          </div>
          <div className={styles.address}>{place.road_address_name}</div>
          <a
            href={place.place_url}
            target="_blank"
            rel="noreferrer"
            className={styles.linkButton}
          >
            상세보기
          </a>
        </li>
      ))}
    </ul>
  );
});

export default RestaurantList;
