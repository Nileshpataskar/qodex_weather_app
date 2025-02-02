import React from "react";

interface ForecastProps {
  date: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
  icon: string;
}

const ForecastCard: React.FC<ForecastProps> = ({
  date,
  maxTemp,
  minTemp,
  condition,
  icon,
}) => {
  return (
    <div className="bg-white bg-opacity-20 p-4 rounded-lg text-center shadow-md">
      <p className="font-semibold">{date}</p>
      <img src={icon} alt={condition} className="w-12 h-12 mx-auto" />
      <p>{condition}</p>
      <p className="font-bold">
        {maxTemp}°C / {minTemp}°C
      </p>
    </div>
  );
};

export default ForecastCard;
