import { useQuery } from "@tanstack/react-query";
import { itineraryService } from "../services/itinerary-api";

export const useFeaturedItineraries = () => {
  return useQuery({
    queryKey: ["itineraries", "featured"],
    queryFn: () => itineraryService.getFeaturedItineraries(),
  });
};
