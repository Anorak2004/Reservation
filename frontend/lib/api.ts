import axios from 'axios';

// API基础URL
// 在开发环境中，将使用Next.js代理转发请求
// 在生产环境中，可以配置为实际的API URL
const API_BASE_URL = '/api/v1';

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 账号相关API
export const accountsApi = {
  // 获取所有账号
  getAccounts: async () => {
    const response = await apiClient.get('/accounts');
    return response.data;
  },

  // 获取单个账号
  getAccount: async (id: string | number) => {
    const response = await apiClient.get(`/accounts/${id}`);
    return response.data;
  },

  // 创建账号
  createAccount: async (accountData: {
    username: string;
    password: string;
    remark?: string;
    isDefault?: boolean;
  }) => {
    const response = await apiClient.post('/accounts', accountData);
    return response.data;
  },

  // 更新账号
  updateAccount: async (
    id: string | number,
    accountData: {
      password?: string;
      remark?: string;
      isDefault?: boolean;
    }
  ) => {
    const response = await apiClient.put(`/accounts/${id}`, accountData);
    return response.data;
  },

  // 删除账号
  deleteAccount: async (id: string | number) => {
    await apiClient.delete(`/accounts/${id}`);
    return true;
  },
};

// 场馆相关API
export const venuesApi = {
  // 获取可用场馆
  getVenues: async (params: {
    serviceid: string | number;
    date: string;
  }) => {
    try {
      console.log("API请求参数:", params);
      const response = await apiClient.get('/venues', { params });
      console.log("API原始响应:", response);
      // 后端API可能返回数组或者包含data字段的对象
      return Array.isArray(response.data) ? response.data : 
             response.data.data ? response.data.data : 
             [];
    } catch (error) {
      console.error("Venues API错误:", error);
      if (axios.isAxiosError(error)) {
        console.error("错误详情:", {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
          url: error.config?.url,
          params: error.config?.params
        });
      }
      throw error;
    }
  },
};

// 自动预约相关API
export const autoBookingsApi = {
  // 获取自动预约任务列表
  getAutoBookings: async (status?: string) => {
    const params = status ? { status } : {};
    const response = await apiClient.get('/auto-bookings', { params });
    return response.data;
  },

  // 获取单个自动预约任务
  getAutoBooking: async (id: string | number) => {
    const response = await apiClient.get(`/auto-bookings/${id}`);
    return response.data;
  },

  // 创建自动预约任务
  createAutoBooking: async (bookingData: {
    venue_id: string | number;
    account_id: string | number;
    booking_date: string;
    time_no: string;
    users?: string;
  }) => {
    const response = await apiClient.post('/auto-bookings', bookingData);
    return response.data;
  },

  // 取消自动预约任务
  cancelAutoBooking: async (id: string | number) => {
    await apiClient.delete(`/auto-bookings/${id}`);
    return true;
  },
};

// 手动预约相关API
export const preBookApi = {
  // 使用已保存账号进行预约
  preBookWithAccount: async (bookingData: {
    stockid: string;
    serviceid: string;
    venue_id: string;
    users: string;
    account_id: string | number;
  }) => {
    const response = await apiClient.post('/prebook-with-account', bookingData);
    return response.data;
  },

  // 使用临时账号进行预约
  preBook: async (bookingData: {
    stockid: string;
    serviceid: string;
    venue_id: string;
    users: string;
    username: string;
    password: string;
  }) => {
    const response = await apiClient.post('/prebook', bookingData);
    return response.data;
  },
};

// 数据管理相关API
export const dataManagementApi = {
  // 导入场馆数据
  importData: async (params: { date: string; serviceid: string | number }) => {
    const response = await apiClient.post('/import-data', null, { params });
    return response.data;
  },
};

export default {
  accountsApi,
  venuesApi,
  autoBookingsApi,
  preBookApi,
  dataManagementApi,
}; 