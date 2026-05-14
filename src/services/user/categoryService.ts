import axiosClient from "@/api/axios"


export const getCategories = async () => {
    const {data} = await axiosClient.get('/categories')
    return data
}