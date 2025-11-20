import { memo, useCallback, useState } from "react";
import { Modal } from "./components/Modal";
import FavoriteButton from "./FavoriteButton";
import { Link } from "react-router-dom";

function MovieCard({ image, rating, trailerVideo }) {
  return (
    <div className=" relative w-[200px] rounded-2xl overflow-hidden bg-neutral-900 shadow-lg hover:scale-105 transition-transform will-change-transform duration-300">
      <img
        src={image}
        alt="Movie Card"
        className=" w-full h-auto object-cover"
      />
      <div className="absolute top-2 right-2 z-10"></div>

      <div className="absolute bottom-0 left-0 w-full bg-linear-to-t from-black/80 to-transparent p-2 text-sm text-white font-semibold"></div>
    </div>
  );
}

export default memo(MovieCard);
