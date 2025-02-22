import api from '../utils/api';

export const apiService = {

    // home page
    getHome: () => api.get('/home'),

    // get category archive
    getCategoryArchive: (id: any, limit: number, offset: number) => api.get(`/category/${id}?limit=${limit}&offset=${offset}`),

    // Products
    getProducts: () => api.get('/products'),
    getProduct: (id: string) => api.get(`/product/${id}`),

    // Categories
    getCategories: () => api.get('/categories'),
    getCategory: (id: string) => api.get(`/categories/${id}`),

    // Orders
    getOrders: () => api.get('/orders'),
    createOrder: (data: any) => api.post('/orders', data),


};