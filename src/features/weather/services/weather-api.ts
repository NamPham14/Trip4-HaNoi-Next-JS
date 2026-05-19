import axiosInstance from '@/shared/api/axios-instance'

export interface WeatherResponse {
  temp: number
  feelsLike: number
  condition: string
  description: string
  iconCode: string
}

export const weatherService = {
  getCurrentWeather: async (): Promise<WeatherResponse> => {
    try {
      const response = await axiosInstance.get('/weather')
      return response.data
    } catch (error) {
      console.error('Error fetching weather:', error)
      // Fallback data if API fails to prevent UI breaking
      return {
        temp: 25,
        feelsLike: 27,
        condition: 'Clear',
        description: 'Có nắng',
        iconCode: '01d',
      }
    }
  },
}
