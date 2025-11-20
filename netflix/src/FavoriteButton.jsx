import { useState } from "react";
import { IoMdHeartEmpty, IoMdHeart, IoMdHeartHalf } from "react-icons/io";
export function FavoriteButton() {
  const [isFavorite, setIsFavorite] = useState(false);
  return (
    <button onClick={() => setIsFavorite((prev) => !prev)}>
      {!isFavorite ? (
        <IoMdHeartEmpty size="1.3em" />
      ) : (
        <IoMdHeart color="pink" size="1.3em" />
      )}
    </button>
  );
}
