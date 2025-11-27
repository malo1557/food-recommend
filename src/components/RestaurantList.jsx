import React, { memo } from "react";
import { useFood } from "../contexts/FoodContext";
import styles from "./RestaurantList.module.css"; // CSS 불러오기

const RestaurantItem = memo(({ place }) => (
  <li className={styles.card}>
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
      카카오맵 상세보기 👉
    </a>
  </li>
));

const RestaurantList = memo(() => {
  const { restaurants } = useFood();

  if (restaurants.length === 0) return null;

  return (
    <div className={styles.listContainer}>
      <h3 className={styles.title}>🏪 추천 식당 리스트</h3>
      <ul className={styles.list}>
        {restaurants.map((place) => (
          <RestaurantItem key={place.id} place={place} />
        ))}
      </ul>
    </div>
  );
});

export default RestaurantList;
