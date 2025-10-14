"use client"
import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";

const AddressManager = ({ onAddressSelect, selectedAddress }) => {
  const { router } = useAppContext();
  const [addresses, setAddresses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    pincode: '',
    area: '',
    city: '',
    state: ''
  });

  // Load addresses from localStorage
  useEffect(() => {
    const savedAddresses = localStorage.getItem('quickcart_addresses');
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses));
    }
  }, []);

  // Save addresses to localStorage
  const saveAddresses = (newAddresses) => {
    setAddresses(newAddresses);
    localStorage.setItem('quickcart_addresses', JSON.stringify(newAddresses));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingAddress) {
      // Update existing address
      const updatedAddresses = addresses.map(addr => 
        addr._id === editingAddress._id 
          ? { ...addr, ...formData }
          : addr
      );
      saveAddresses(updatedAddresses);
      setEditingAddress(null);
    } else {
      // Add new address
      const newAddress = {
        _id: `addr_${Date.now()}`,
        ...formData,
        createdAt: new Date().toISOString()
      };
      saveAddresses([...addresses, newAddress]);
    }
    
    setFormData({
      fullName: '',
      phoneNumber: '',
      pincode: '',
      area: '',
      city: '',
      state: ''
    });
    setShowAddForm(false);
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      fullName: address.fullName,
      phoneNumber: address.phoneNumber,
      pincode: address.pincode,
      area: address.area,
      city: address.city,
      state: address.state
    });
    setShowAddForm(true);
  };

  const handleDelete = (addressId) => {
    if (confirm('Are you sure you want to delete this address?')) {
      const updatedAddresses = addresses.filter(addr => addr._id !== addressId);
      saveAddresses(updatedAddresses);
      
      // If deleted address was selected, clear selection
      if (selectedAddress && selectedAddress._id === addressId) {
        onAddressSelect(null);
      }
    }
  };

  const handleSelect = (address) => {
    onAddressSelect(address);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Manage Addresses</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-sm"
        >
          + Add New Address
        </button>
      </div>

      {/* Address List */}
      <div className="space-y-3">
        {addresses.map((address) => (
          <div
            key={address._id}
            className={`p-4 border-2 rounded-lg cursor-pointer transition ${
              selectedAddress && selectedAddress._id === address._id
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleSelect(address)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium text-gray-900">{address.fullName}</h4>
                  {selectedAddress && selectedAddress._id === address._id && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                      Selected
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-1">{address.phoneNumber}</p>
                <p className="text-sm text-gray-600">
                  {address.area}, {address.city}, {address.state} - {address.pincode}
                </p>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(address);
                  }}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(address._id);
                  }}
                  className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {addresses.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No addresses saved yet.</p>
            <p className="text-sm">Add your first address to get started.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {editingAddress ? 'Edit Address' : 'Add New Address'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingAddress(null);
                    setFormData({
                      fullName: '',
                      phoneNumber: '',
                      pincode: '',
                      area: '',
                      city: '',
                      state: ''
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="12345"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter state"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter city"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area/Street Address *
                  </label>
                  <textarea
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter your area, street, house number, etc."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition"
                  >
                    {editingAddress ? 'Update Address' : 'Add Address'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingAddress(null);
                      setFormData({
                        fullName: '',
                        phoneNumber: '',
                        pincode: '',
                        area: '',
                        city: '',
                        state: ''
                      });
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressManager;
