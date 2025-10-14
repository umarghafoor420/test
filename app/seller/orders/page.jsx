'use client';
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";

const Orders = () => {

    const { currency, orders, updateOrderStatus } = useAppContext();

    const [loading, setLoading] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('all');

    const statusOptions = [
        { value: 'all', label: 'All Orders', count: orders.length },
        { value: 'Order Placed', label: 'New Orders', count: orders.filter(o => o.status === 'Order Placed').length },
        { value: 'Confirmed', label: 'Confirmed', count: orders.filter(o => o.status === 'Confirmed').length },
        { value: 'Shipped', label: 'Shipped', count: orders.filter(o => o.status === 'Shipped').length },
        { value: 'Delivered', label: 'Delivered', count: orders.filter(o => o.status === 'Delivered').length },
        { value: 'Cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'Cancelled').length }
    ];

    const filteredOrders = selectedStatus === 'all' 
        ? orders 
        : orders.filter(order => order.status === selectedStatus);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Order Placed': return 'bg-blue-100 text-blue-800';
            case 'Confirmed': return 'bg-yellow-100 text-yellow-800';
            case 'Shipped': return 'bg-purple-100 text-purple-800';
            case 'Delivered': return 'bg-green-100 text-green-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleStatusUpdate = (orderId, newStatus) => {
        updateOrderStatus(orderId, newStatus);
    };

    return (
        <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
            {loading ? <Loading /> : <div className="md:p-10 p-4 space-y-5">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">Orders Management</h2>
                    <div className="text-sm text-gray-600">
                        Total Orders: {orders.length}
                    </div>
                </div>

                {/* Status Filter Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {statusOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setSelectedStatus(option.value)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                selectedStatus === option.value
                                    ? 'bg-orange-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {option.label} ({option.count})
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-12">
                                <Image
                                    src={assets.box_icon}
                                alt="No orders"
                                className="w-16 h-16 mx-auto mb-4 opacity-50"
                            />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Found</h3>
                            <p className="text-gray-600">
                                {selectedStatus === 'all' 
                                    ? "No orders have been placed yet." 
                                    : `No orders with status "${selectedStatus}"`}
                            </p>
                        </div>
                    ) : (
                        filteredOrders.map((order, index) => (
                            <div key={order._id || index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                <div className="flex flex-col lg:flex-row gap-6">
                                    {/* Order Items */}
                                    <div className="flex-1">
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <Image
                                                    src={order.items[0]?.product?.image[0] || assets.box_icon}
                                                    alt="Product"
                                                    className="w-12 h-12 object-cover rounded"
                                                    width={48}
                                                    height={48}
                                                />
                            </div>
                            <div>
                                                <h3 className="font-semibold text-gray-900 mb-1">
                                                    Order #{order._id?.slice(-8) || 'N/A'}
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    {order.items.map((item) => 
                                                        `${item.product.name} x ${item.quantity}`
                                                    ).join(", ")}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {order.items.length} item{order.items.length > 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>
                                    </div>

                                    {/* Customer Info */}
                                    <div className="lg:w-64">
                                        <h4 className="font-medium text-gray-900 mb-2">Customer Details</h4>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            <p><strong>{order.address?.fullName || 'N/A'}</strong></p>
                                            <p>{order.address?.area || 'N/A'}</p>
                                            <p>{order.address?.city}, {order.address?.state}</p>
                                            <p>{order.address?.phoneNumber || 'N/A'}</p>
                                        </div>
                                    </div>

                                    {/* Order Info */}
                                    <div className="lg:w-48">
                                        <h4 className="font-medium text-gray-900 mb-2">Order Information</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Total:</span>
                                                <span className="font-semibold">{currency}{order.amount}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Payment:</span>
                                                <span className="text-sm">{order.paymentMethod || 'N/A'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Date:</span>
                                                <span className="text-sm">{new Date(order.date || order.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status Management */}
                                    <div className="lg:w-48">
                                        <h4 className="font-medium text-gray-900 mb-2">Status</h4>
                                        <div className="space-y-3">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                            
                                            <div className="space-y-2">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                    className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                                                >
                                                    <option value="Order Placed">Order Placed</option>
                                                    <option value="Confirmed">Confirmed</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>}
            <Footer />
        </div>
    );
};

export default Orders;