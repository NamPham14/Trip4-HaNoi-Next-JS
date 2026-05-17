import { useQuery } from "@tanstack/react-query";
import { weatherService, WeatherResponse } from "../services/weather-api";

export const useWeather = () => {
  return useQuery<WeatherResponse>({
    queryKey: ["weather", "hanoi"],
    queryFn: () => weatherService.getCurrentWeather(),
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });
};
