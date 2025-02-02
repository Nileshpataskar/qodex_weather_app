import { useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import { RootState } from "@/lib/store";
import { motion } from "framer-motion";
import { Sun, CloudRain, CloudSnow, Cloudy, Thermometer } from "lucide-react";
import { useState } from "react";

export function WeatherDisplay() {
  const { data, loading, error } = useSelector(
    (state: RootState) => state.weather
  );

  const [isCelsius, setIsCelsius] = useState(true);

  const toggleTemperature = () => setIsCelsius((prev) => !prev);

  const convertToFahrenheit = (celsius: number) => (celsius * 9) / 5 + 32;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-400 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive text-center p-4">
        <p>{error}</p>
      </div>
    );
  }

  if (!data) return null;

  // Determine Icon Based on Condition
  const getWeatherIcon = (condition: string) => {
    if (condition.includes("rain"))
      return <CloudRain className="w-12 h-12 text-blue-500" />;
    if (condition.includes("snow"))
      return <CloudSnow className="w-12 h-12 text-gray-300" />;
    if (condition.includes("cloud"))
      return <Cloudy className="w-12 h-12 text-gray-500" />;
    return <Sun className="w-12 h-12 text-yellow-500" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full h-full space-y-6 px-4"
    >
      <Card className="p-6 backdrop-blur-xl flex flex-col items-center rounded-3xl w-full h-fit">
        {/* Weather Main Info */}
        <div className="flex flex-col items-center space-y-4 md:space-y-6 relative w-full">
          <img src="/cloudy.png" alt="Weather Icon" className="w-24 md:w-32" />
          <h2 className="text-4xl md:text-5xl font-semibold text-white">
            {isCelsius ? data.temp_c : convertToFahrenheit(data.temp_c)}°
            {isCelsius ? "C" : "F"}
          </h2>
          <h2 className="text-xl md:text-2xl text-white">{data.city}</h2>
          <div className="absolute top-0 right-5 bg-gray-600 p-2 rounded-xl  ">
            <button
              onClick={toggleTemperature}
              className="mt-2 text-sm text-white animate-pulse"
            >
              Switch to {isCelsius ? "Fahrenheit" : "Celsius"}
            </button>
          </div>
        </div>

        <div className="flex justify-between w-full">
          <div className="flex flex-col md:flex-row items-center justify-center w-full mt-10 gap-6 md:gap-36">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <h2 className="text-5xl font-semibold text-white">
                  {isCelsius ? data.temp_c : convertToFahrenheit(data.temp_c)}°
                  {isCelsius ? "C" : "F"}
                </h2>
                <p className="text-white">{data.condition}</p>
                <p className="text-sm text-white">{data.time.split(" ")[0]}</p>
              </div>
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col items-center"
              >
                <img src="/sun.png" alt="sun" className="w-14 md:w-16" />
                <span className="text-white">{data.windSpeed} km/hr</span>
              </motion.div>
            </div>
          </div>

          {/* Forecast Section */}
          <div className="flex flex-nowrap justify-center gap-4 w-full mt-8">
            {data.forecast.map((day, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex flex-col items-center p-4 min-w-[80px] md:min-w-[100px] border-x-2 border-gray-300/30 rounded-lg"
              >
                <span className="text-xs sm:text-sm text-white">
                  {day.date}
                </span>
                {getWeatherIcon(day.condition)}
                <span className="text-xs sm:text-sm capitalize text-gray-200">
                  {day.condition}
                </span>
                <div className="flex gap-1 items-center">
                  <Thermometer className="w-4 h-4 text-red-400" />
                  <span className="font-semibold text-white">
                    {isCelsius
                      ? day.maxTemp.toFixed(2) // Corrected: `toFixed` with capital F
                      : convertToFahrenheit(day.maxTemp).toFixed(2)}
                    °{isCelsius ? "C" : "F"}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
