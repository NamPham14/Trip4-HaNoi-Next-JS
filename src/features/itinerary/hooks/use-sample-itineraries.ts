import { useQuery } from "@tanstack/react-query";
import { itineraryService } from "../services/itinerary-api";

export const useSampleItineraries = () => {
  return useQuery({
    queryKey: ["itineraries", "samples"],
    queryFn: () => itineraryService.getSampleItineraries(),
  });
};
