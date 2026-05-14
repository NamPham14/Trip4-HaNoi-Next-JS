import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../services/category-api";

/**
 * Hook to fetch and cache categories
 */
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAllCategories,
    staleTime: Infinity, // Categories rarely change, keep them fresh indefinitely
  });
};
