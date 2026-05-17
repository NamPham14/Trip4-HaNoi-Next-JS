// Mock data service for Dashboard
// Bám sát định dạng DTO từ Backend DashboardController

export const mockDashboardData = {
  summary: {
    totalUsers: 1250,
    activeUsers: 840,
    totalPlaces: 450,
    totalEvents: 85,
    userGrowth: 15.5,
    placeGrowth: 8.2,
    eventGrowth: -2.1,
  },
  placeAnalytics: {
    mostVisited: [
      { name: 'Hồ Hoàn Kiếm', visits: 5400 },
      { name: 'Văn Miếu Quố Tử Giám', visits: 3200 },
      { name: 'Lăng Bác', visits: 2800 },
      { name: 'Nhà Thờ Lớn', visits: 2100 },
      { name: 'Chùa Một Cột', visits: 1800 },
    ],
    categoryDistribution: [
      { name: 'Ẩm thực', value: 45 },
      { name: 'Di tích', value: 25 },
      { name: 'Giải trí', value: 20 },
      { name: 'Văn hóa', value: 10 },
    ]
  },
  monthlyGrowth: [
    { month: 'Jan', users: 400, places: 240 },
    { month: 'Feb', users: 520, places: 260 },
    { month: 'Mar', users: 600, places: 300 },
    { month: 'Apr', users: 800, places: 350 },
    { month: 'May', users: 1100, places: 420 },
    { month: 'Jun', users: 1250, places: 450 },
  ]
};

export const dashboardService = {
  getSummary: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockDashboardData.summary), 500);
    });
  },
  getAnalytics: async () => {
     return new Promise((resolve) => {
      setTimeout(() => resolve(mockDashboardData), 800);
    });
  }
};
