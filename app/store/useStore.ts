import { create } from 'zustand';
import { ref, onValue, off } from 'firebase/database';
import { database } from '@/firebaseConfig';


interface User {
    token: string;
    data: Record<string, unknown>;
}

interface Wishlist {
    count: number;
}

interface Basket {
    count: number;
}

interface Notifications {
    count: number;
}

interface Store {
    // User state
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    logout: () => void;
    // Wishlist state
    wishlist: Wishlist;
    setWishlist: (wishlist: Wishlist) => void;
    // Basket state
    basket: Basket;
    setBasket: (basket: Basket) => void;
    // Notifications state
    notifications: Notifications;
    setNotifications: (notifications: Notifications) => void;
}

const useStore = create<Store>((set, get) => ({
    // User
    user: null,
    isAuthenticated: false,
    setUser: (user) => set({ user, isAuthenticated: !!user }),
    logout: () => set({ user: null, isAuthenticated: false, wishlist: { count: 0 }, basket: { count: 0 }, notifications: { count: 0 } }),
    // Wishlist
    wishlist: { count: 0 },
    setWishlist: (wishlist) => set({ wishlist }),
    // Basket
    basket: { count: 0 },
    setBasket: (basket) => set({ basket }),
    // Notifications
    notifications: { count: 0 },
    setNotifications: (notifications) => set({ notifications }),
}));

export default useStore;

