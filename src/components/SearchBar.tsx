import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { fetchWeather } from "@/features/weather/weatherSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { Button } from "./ui/button";

export function SearchBar() {
  const [city, setCity] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const { data } = useSelector((state: RootState) => state.weather);

  useEffect(() => {
    dispatch(fetchWeather("Pune"));
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      dispatch(fetchWeather(city.trim()));
      localStorage.setItem("lastCity", city.trim());
    }
  };

  return (
    <div className="flex w-full justify-between items-center p-5 ">
      <div className="flex flex-col  item-center  ">
        <p className="font-thin animate-bounce">
          Enter City <ArrowDown />
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex gap-3 w-full max-w-lg items-center bg-white/10 backdrop-blur-md p-4 rounded-full shadow-lg border border-white/20"
        >
          {/* Input Field */}
          <Input
            type="text"
            placeholder="Search city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1 text-white placeholder:text-white/60 bg-transparent border-none outline-none px-4 py-2 focus:ring-2 focus:ring-blue-400 rounded-full transition-all duration-300 text-lg"
          />

          {/* Search Button */}
          <Button
            type="submit"
            className="p-3  hover:bg-blue-600 text-white rounded-full transition-all duration-300 shadow-md flex items-center justify-center"
          >
            <Search className="h-5 w-5" />
          </Button>
        </form>
      </div>
      <div className="">
        <div className="flex flex-col gap-3 items-center text-white">
          <p className="text-3xl">{data?.city}</p>

          <p className="text-xl">{data?.time.split(" ")[1]}</p>
        </div>
      </div>
    </div>
  );
}
