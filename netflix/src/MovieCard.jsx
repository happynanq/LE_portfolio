import { useState } from "react";
import { Modal } from "./components/Modal";
import { FavoriteButton } from "./FavoriteButton";

export function MovieCard({ image, rating, trailerVideo }) {
  const [isOpenTrailer, setIsOpenTrailer] = useState(false);

  return (
    <div className=" relative w-[200px] rounded-2xl overflow-hidden bg-neutral-900 shadow-lg hover:scale-105 transition-transform will-change-transform duration-300">
      {isOpenTrailer && (
        <Modal onClose={() => setIsOpenTrailer(false)}>
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${trailerVideo}?si=u3YlXfDdzFoMyw4Q`}
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
        </Modal>
      )}

      <img
        src={image}
        alt="Movie Card"
        className=" w-full h-auto object-cover"
      />
      <div className="absolute top-2 right-2 z-10">
        <FavoriteButton />
        <button
          className="btn"
          onClick={() => {
            setIsOpenTrailer(true);
          }}
        >
          Трейлер
        </button>
      </div>

      <div className="absolute bottom-0 left-0 w-full bg-linear-to-t from-black/80 to-transparent p-2 text-sm text-white font-semibold">
        IMBd: {rating}
      </div>
    </div>
  );
}
