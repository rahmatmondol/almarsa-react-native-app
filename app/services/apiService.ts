import api from '../utils/api';
import * as SecureStore from 'expo-secure-store';
// is authenticated
export const authToken = async () => {
    const token = await SecureStore.getItemAsync('authToken');
    return !!token;
};

export const apiService = {

    // home page
    getHome: () => api.get('/home'),

    // get shop
    getShop: () => api.get(`/shop`),

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

    // Auth
    login: (data: any) => api.post('/login', data),
    register: (data: any) => api.post('/register', data),

    // add to cart
    addToCart: (data: any) => api.post('/auth/cart', data),

    // get cart
    getCart: () => api.get('/auth/carts'),

    // remove from cart
    removeFromCart: (id: number) => api.delete(`/auth/cart/${id}`),

    // update cart
    updateCart: (data: any) => api.post(`/auth/cart-update`, data),

    //cartitem delete
    deleteCartItem: (id: number) => api.delete(`/auth/cart/${id}`),

    // add to wishlist
    addToWishlist: (data: any) => api.post('/auth/wishlist', data),

    // get wishlist
    getWishlist: () => api.get('/auth/wishlists'),

    // remove from wishlist
    removeFromWishlist: (id: number) => api.delete(`/auth/wishlist/${id}`),

    // update wishlist
    updateWishlist: (data: any) => api.post(`/auth/wishlist-update`, data),

    //placeOrder
    placeOrder: (data: any) => api.post('/auth/order', data),

    //get order
    getOrders: () => api.get('/auth/orders'),

    //get order details
    getOrderDetails: (id: number) => api.get(`/auth/order/${id}`),
};