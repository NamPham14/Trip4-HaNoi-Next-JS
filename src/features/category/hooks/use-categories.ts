import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../services/category-api";

/**
 * Hook to fetch and cache categories
 */
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await categoryService.getAllCategories({ size: 100 });
      return response.data; // This is the Category[] array
    },
    staleTime: Infinity, // Categories rarely change, keep them fresh indefinitely
  });
};
