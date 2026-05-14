import { getCategories } from "@/services/user/categoryService"
import { useQuery } from "@tanstack/react-query"

export const useCategories = () =>{
    return useQuery({
        queryKey:['categories'],
        queryFn: getCategories,
    })
}