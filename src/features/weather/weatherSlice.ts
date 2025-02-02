import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// Define interfaces for the API response and forecast day data
interface ForecastDay {
  date: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
  icon: string;
}

export interface WeatherData {
  city: string;
  temp_c: number;
  temp_f: number;
  condition: string;
  icon: string;
  windSpeed: number;
  time: string;
  humidity: number;
  forecast: ForecastDay[]; // Correctly typed forecast array
  units: "celsius" | "fahrenheit"; // Type units correctly
}

interface WeatherState {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
  defaultCity: string;
}

const initialState: WeatherState = {
  data: null,
  loading: false,
  error: null,
  lastUpdated: null,
  defaultCity: "Gujrat", // Set Gujrat as default city
};

// Define the API response type to avoid using 'any'
interface ApiResponse {
  location: {
    name: string;
    localtime: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
    };
    wind_kph: number;
    humidity: number;
  };
  forecast: {
    forecastday: {
      date: string;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        condition: {
          text: string;
          icon: string;
        };
      };
    }[];
  };
}

export const fetchWeather = createAsyncThunk(
  "weather/fetchWeather",
  async (city: string | undefined, { getState }) => {
    const state = getState() as { weather: WeatherState };
    const apiKey = "3f076f3e2dd3400ea40123203232401";
    const queryCity = city || state.weather.defaultCity;

    const response = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${queryCity}&days=6&aqi=no&alerts=no`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }

    const data: ApiResponse = await response.json(); // Use the ApiResponse type

    console.log("Weather Data ", data);

    return {
      city: data.location.name,
      temp_c: data.current.temp_c,
      temp_f: data.current.temp_f,
      condition: data.current.condition.text,
      icon: data.current.condition.icon,
      windSpeed: data.current.wind_kph,
      time: data.location.localtime,
      humidity: data.current.humidity,
      forecast: data.forecast.forecastday.map((day) => ({
        date: day.date,
        maxTemp: day.day.maxtemp_c,
        minTemp: day.day.mintemp_c,
        condition: day.day.condition.text,
        icon: day.day.condition.icon,
      })),
      units: "celsius" as "celsius" | "fahrenheit", // Make sure this is typed correctly
    };
  }
);

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    toggleUnits: (state) => {
      if (state.data) {
        state.data.units =
          state.data.units === "celsius" ? "fahrenheit" : "celsius";
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchWeather.fulfilled,
        (state, action: PayloadAction<WeatherData>) => {
          state.loading = false;
          state.data = action.payload;
          state.lastUpdated = Date.now();
        }
      )
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch weather data";
      });
  },
});

export const { toggleUnits } = weatherSlice.actions;
export default weatherSlice.reducer;
