import { memo, useCallback, useState } from "react";
import { Modal } from "./components/Modal";
import FavoriteButton from "./FavoriteButton";
import { Link } from "react-router-dom";

function MovieCard({ image, rating, trailerVideo }) {
  const [isOpenTrailer, setIsOpenTrailer] = useState(false);
  const OpenTrailer = useCallback(() => {
    setIsOpenTrailer(true);
  }, []);
  return (
    <div className=" relative w-[200px] rounded-2xl overflow-hidden bg-neutral-900 shadow-lg hover:scale-105 transition-transform will-change-transform duration-300">
      {isOpenTrailer && (
        <Modal onClose={() => setIsOpenTrailer(false)}>
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${trailerVideo}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </Modal>
      )}

      <img
        src={image}
        alt="Movie Card"
        className=" w-full h-auto object-cover"
      />
      <div className="absolute top-2 right-2 z-10">
        <FavoriteButton />
        <button className="btn" onClick={OpenTrailer}>
          Трейлер
        </button>
        <Link className="btn" to={`/movie/${trailerVideo}`}>
          Link
        </Link>
      </div>

      <div className="absolute bottom-0 left-0 w-full bg-linear-to-t from-black/80 to-transparent p-2 text-sm text-white font-semibold">
        IMBd: {rating}
      </div>
    </div>
  );
}

export default memo(MovieCard);
