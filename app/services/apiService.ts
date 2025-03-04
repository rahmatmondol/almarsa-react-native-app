import ChangeEmail from '../(tabs)/change-email';
import ChangePassword from '../(tabs)/change-password';
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

    //saerch
    searchProducts: (query: string) => api.get(`/product-search?search=${query}`),

    // get category archive
    getCategoryArchive: (id: any, limit: number, offset: number) => api.get(`/category/${id}?limit=${limit}&offset=${offset}`),

    // Products
    getProducts: () => api.get('/products'),
    getProduct: (id: string) => api.get(`/product/${id}`),

    // Categories
    getCategories: () => api.get('/categories'),
    getCategory: (id: string) => api.get(`/categories/${id}`),

    // Auth
    login: (data: any) => api.post('/login', data),
    register: (data: any) => api.post('/register', data),
    updateProfile: (data: any) => api.post('/auth/update-profile', data),
    ChangePassword: (data: any) => api.post('/auth/change-password', data),
    forgotPassword: (data: any) => api.post('/forget-password', data),
    resetPassword: (data: any) => api.post('/reset-password', data),
    logout: () => api.post('/auth/logout'),
    ChangeEmail: (data: any) => api.post('/auth/change-email', data),

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
    orderAgain: (data: any) => api.post('/auth/order-again', data),

    //get order
    getOrders: () => api.get('/auth/orders'),

    //get order details
    getOrderDetails: (id: number) => api.get(`/auth/order/${id}`),
    // address
    getAddresses: () => api.get('/auth/get-addresses'),
    getAddress: (id: number) => api.get(`/auth/get-address/${id}`),
    addAddress: (data: any) => api.post('/auth/add-address', data),
    updateAddress: (id: number, data: any) => api.post(`/auth/update-address/${id}`, data),
    deleteAddress: (id: number) => api.delete(`/auth/delete-address/${id}`),

    updatePushToken: (data: any) => api.post('/auth/update-push-token', data),


    //get about us
    getAbout: () => api.get('/about'),

    //get contact
    getContact: () => api.get('/contact'),
};