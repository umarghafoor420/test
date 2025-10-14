'use client'
import { productsDummyData, userDummyData } from "@/assets/assets";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = (props) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY
    const router = useRouter()

    const [products, setProducts] = useState([])
    const [userData, setUserData] = useState(false)
    const [isSeller, setIsSeller] = useState(true)
    const [cartItems, setCartItems] = useState({})
    const [orders, setOrders] = useState([])
    const [notifications, setNotifications] = useState([])
    const [unreadCount, setUnreadCount] = useState(0)

    const fetchProductData = async () => {
        const savedProducts = localStorage.getItem('quickcart_products');
        if (savedProducts) {
            setProducts(JSON.parse(savedProducts));
        } else {
            setProducts(productsDummyData);
            localStorage.setItem('quickcart_products', JSON.stringify(productsDummyData));
        }
    }

    const addProduct = (product) => {
        setProducts(prevProducts => {
            const updatedProducts = [product, ...prevProducts];
            localStorage.setItem('quickcart_products', JSON.stringify(updatedProducts));
            return updatedProducts;
        });
    }

    const deleteProduct = (productId) => {
        setProducts(prevProducts => {
            const updatedProducts = prevProducts.filter(p => p._id !== productId);
            localStorage.setItem('quickcart_products', JSON.stringify(updatedProducts));
            return updatedProducts;
        });
    }

    const fetchUserData = async () => {
        setUserData(userDummyData)
    }

    const fetchOrders = async () => {
        // In a real app, this would fetch from your backend
        // For now, we'll use localStorage to persist orders
        const savedOrders = localStorage.getItem('quickcart_orders');
        if (savedOrders) {
            setOrders(JSON.parse(savedOrders));
        }
    }

    const addOrder = useCallback((orderData) => {
        const newOrder = {
            _id: `order_${Date.now()}`,
            ...orderData,
            status: 'Order Placed',
            date: Date.now(),
            createdAt: new Date().toISOString()
        };
        
        setOrders(prevOrders => {
            const updatedOrders = [newOrder, ...prevOrders];
            localStorage.setItem('quickcart_orders', JSON.stringify(updatedOrders));
            return updatedOrders;
        });
        
        return newOrder;
    }, []);

    const updateOrderStatus = useCallback((orderId, newStatus) => {
        setOrders(prevOrders => {
            const updatedOrders = prevOrders.map(order => 
                order._id === orderId 
                    ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
                    : order
            );
            localStorage.setItem('quickcart_orders', JSON.stringify(updatedOrders));
            return updatedOrders;
        });
    }, []);

    const addNotification = useCallback((notification) => {
        const newNotification = {
            _id: `notif_${Date.now()}`,
            ...notification,
            read: false,
            createdAt: new Date().toISOString()
        };
        
        setNotifications(prev => {
            const updated = [newNotification, ...prev];
            localStorage.setItem('quickcart_notifications', JSON.stringify(updated));
            return updated;
        });
        
        setUnreadCount(prev => prev + 1);
    }, []);

    const markNotificationAsRead = useCallback((notificationId) => {
        setNotifications(prev => {
            const updated = prev.map(notif => 
                notif._id === notificationId 
                    ? { ...notif, read: true }
                    : notif
            );
            localStorage.setItem('quickcart_notifications', JSON.stringify(updated));
            return updated;
        });
        
        setUnreadCount(prev => Math.max(0, prev - 1));
    }, []);

    const fetchNotifications = useCallback(() => {
        const savedNotifications = localStorage.getItem('quickcart_notifications');
        if (savedNotifications) {
            const notifs = JSON.parse(savedNotifications);
            setNotifications(notifs);
            setUnreadCount(notifs.filter(n => !n.read).length);
        }
    }, []);

    const addToCart = useCallback((itemId) => {
        setCartItems(prevCartItems => {
            const cartData = { ...prevCartItems };
            if (cartData[itemId]) {
                cartData[itemId] += 1;
            } else {
                cartData[itemId] = 1;
            }
            return cartData;
        });
    }, []);

    const updateCartQuantity = useCallback((itemId, quantity) => {
        setCartItems(prevCartItems => {
            const cartData = { ...prevCartItems };
            if (quantity === 0) {
                delete cartData[itemId];
            } else {
                cartData[itemId] = quantity;
            }
            return cartData;
        });
    }, []);

    const getCartCount = useCallback(() => {
        return Object.values(cartItems).reduce((total, count) => total + (count > 0 ? count : 0), 0);
    }, [cartItems]);

    const getCartAmount = useMemo(() => {
        let totalAmount = 0;
        for (const itemId in cartItems) {
            const itemInfo = products.find((product) => product._id === itemId);
            if (cartItems[itemId] > 0 && itemInfo) {
                totalAmount += itemInfo.offerPrice * cartItems[itemId];
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    }, [cartItems, products]);

    useEffect(() => {
        fetchProductData()
    }, [])

    useEffect(() => {
        fetchUserData()
    }, [])

    useEffect(() => {
        fetchOrders()
    }, [])

    useEffect(() => {
        fetchNotifications()
    }, [])

    const value = useMemo(() => ({
        currency, router,
        isSeller, setIsSeller,
        userData, fetchUserData,
        products, fetchProductData, addProduct, deleteProduct,
        cartItems, setCartItems,
        addToCart, updateCartQuantity,
        getCartCount, getCartAmount,
        orders, addOrder, updateOrderStatus, fetchOrders,
        notifications, addNotification, markNotificationAsRead, unreadCount
    }), [currency, router, isSeller, userData, products, cartItems, addToCart, updateCartQuantity, getCartCount, getCartAmount, orders, addOrder, updateOrderStatus, addProduct, deleteProduct])

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}