import { useEffect, useState } from "react";
import { fetchWeatherApi } from "openmeteo";

const url = "https://api.open-meteo.com/v1/forecast";

function getTheme(temp, rain) {
  console.log("temp", temp);
  if (rain > 0.3) return "from-gray-700 to-blue-900"; // дождь
  if (temp > 25) return "from-yellow-300 to-orange-500"; // жара
  if (temp < 5) return "from-cyan-200 to-blue-500"; // холод
  return "from-indigo-400 to-sky-500"; // норм
}

export default function App() {
  const [city, setCity] = useState("Berlin");
  const [coords, setCoords] = useState({ latitude: 52.52, longitude: 13.41 });
  const [currentTemp, setCurrentTemp] = useState(null);
  const [rain, setRain] = useState(null);
  const [hourlyTemps, setHourlyTemps] = useState([]);
  const [times, setTimes] = useState([]);

  const searchCity = async () => {
    if (!city) return;

    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
    );

    const data = await res.json();

    if (data.results && data.results.length > 0) {
      const { latitude, longitude, name, country } = data.results[0];

      setCoords({ latitude, longitude });
      setCity(`${name}, ${country}`);
    } else {
      alert("Город не найден");
    }
  };

  const params = {
    latitude: coords.latitude,
    longitude: coords.longitude,
    hourly: ["temperature_2m", "rain"],
    current: ["temperature_2m", "rain"],
  };

  useEffect(() => {
    const call_weather = async () => {
      const responses = await fetchWeatherApi(url, params);
      const response = responses[0];

      const current = response.current();
      const hourly = response.hourly();
      const utcOffset = response.utcOffsetSeconds();

      const temp = current.variables(0).value();
      const rainValue = current.variables(1).value();

      const timeArr = Array.from({ length: 12 }, (_, i) => {
        const time = new Date(
          (Number(hourly.time()) + i * hourly.interval() + utcOffset) * 1000
        );
        return time.getHours() + ":00";
      });

      const temps = hourly.variables(0).valuesArray().slice(0, 12);
      console.log("temps", temps);
      setCurrentTemp(temp);
      setRain(rainValue);
      setHourlyTemps(Array.from(temps));
      // console.log("isarray: ", Array.isArray(temps));
      setTimes(timeArr);
    };

    call_weather();
  }, [coords]);

  const bg = getTheme(currentTemp, rain);

  return (
    <div
      className={`min-h-screen bg-linear-to-br ${bg} text-white p-6 transition-all duration-1000`}
    >
      <div className="max-w-md mx-auto mb-8 flex gap-2">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Введите город..."
          className="w-full p-3 rounded-xl bg-white/70 text-black focus:outline-none"
        />

        <button
          onClick={searchCity}
          className="bg-black/30 px-5 rounded-xl hover:bg-black/50 transition"
        >
          🔍
        </button>
      </div>

      <h1 className="text-4xl font-bold text-center mb-8">🌍 Weather App</h1>

      <div className="max-w-md mx-auto bg-white/20 backdrop-blur-xl p-6 rounded-2xl shadow-2xl">
        <div className="text-center mb-6">
          <p className="text-xl mb-2">Сейчас</p>

          <p className="text-5xl font-bold">
            {currentTemp !== null
              ? `${Math.round(currentTemp * 10) / 10}°C`
              : "..."}
          </p>

          <p className="mt-2">Осадки: {rain !== null ? `${rain} мм` : "..."}</p>
        </div>

        <h2 className="text-xl mb-3">Прогноз на 12 часов</h2>

        <div className="grid grid-cols-4 gap-4">
          {hourlyTemps.map((t, i) => (
            <div
              key={i}
              className="bg-white/30 rounded-xl p-3 text-center shadow-md hover:scale-105 transition"
            >
              <p className="text-sm">{times[i]}</p>
              <p className="text-lg font-bold">{Math.round(t)}°</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
