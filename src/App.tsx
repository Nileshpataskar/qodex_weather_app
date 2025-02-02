import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { SearchBar } from "@/components/SearchBar";
import { WeatherDisplay } from "@/components/WeatherDisplay";
import { fetchWeather } from "./features/weather/weatherSlice";

function WeatherDashboard() {
  useEffect(() => {
    const lastCity = localStorage.getItem("lastCity");
    if (lastCity) {
      store.dispatch(fetchWeather(lastCity));
    }

    const interval = setInterval(() => {
      const state = store.getState();
      if (state.weather.data?.city) {
        store.dispatch(fetchWeather(state.weather.data.city));
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-screen p-8 bg-gradient-to-t from-purple-500 to-black">
      <div className="max-w-5xl mx-auto space-y-8">
        <SearchBar />
        <div className="h-[60vh]">
          <WeatherDisplay />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <WeatherDashboard />
    </Provider>
  );
}

export default App;
