import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { MOVIES } from "./movies.data";

export function MovieDetails() {
  return (
    <div className=" min-h-screen px-6 py-10 bg-black text-white">
      <div className="flex flex-col md:flex-row gap-10 items-start">
        <img className="w-2/3 md:w-1/3 rounded-xl shadow-lg object-cover" />
        <div className="flex-1 space-y-4">
          <h1 className="text-4xl font-bold"> </h1>
          <p className=" text-sm text-gray-400"></p>

          <p className="text-gray-300 text-sm">
            Сюда добавить описание из movies.data
          </p>
        </div>
      </div>
    </div>
  );
}
