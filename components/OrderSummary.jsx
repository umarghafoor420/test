import { addressDummyData } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import React, { useEffect, useState } from "react";
// import { useUser, SignInButton } from "@clerk/nextjs";
import AuthGuard from "./AuthGuard";
import PaymentMethods from "./PaymentMethods";
import StripePayment from "./StripePayment";
import AddressManager from "./AddressManager";
import OrangeButton from '@/components/OrangeButton';

const OrderSummary = () => {

  const { currency, router, getCartCount, getCartAmount, addOrder, products, cartItems, addNotification } = useAppContext()
  // const { isSignedIn } = useUser();
  const isSignedIn = true; // Temporarily set to true for demo
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showAddressManager, setShowAddressManager] = useState(false);

  const [userAddresses, setUserAddresses] = useState([]);

  const fetchUserAddresses = async () => {
    setUserAddresses(addressDummyData);
  }

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  const createOrder = async () => {
    if (!selectedAddress) {
      alert('Please select a delivery address');
      return;
    }
    if (!selectedPayment) {
      alert('Please select a payment method');
      return;
    }

    if (selectedPayment === 'stripe') {
      setShowPaymentForm(true);
      return;
    }

    // For other payment methods, proceed with order
    await processOrder();
  }

  const processOrder = async () => {
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create order items from cart
      const orderItems = Object.keys(cartItems).map(itemId => {
        const product = products.find(p => p._id === itemId);
        return {
          product: {
            _id: product._id,
            name: product.name,
            price: product.price,
            offerPrice: product.offerPrice,
            image: product.image,
            category: product.category,
            userId: product.userId // Include userId for notification
          },
          quantity: cartItems[itemId]
        };
      });

      // Create order data
      const orderData = {
        items: orderItems,
        amount: getCartAmount + Math.floor(getCartAmount * 0.02), // Including tax
        address: selectedAddress,
        paymentMethod: selectedPayment,
        status: 'Order Placed',
        customerInfo: {
          name: selectedAddress.fullName,
          phone: selectedAddress.phoneNumber,
          email: 'customer@example.com' // In real app, get from user profile
        }
      };

      // Add order to system
      const newOrder = addOrder(orderData);
      
      // Add notification for each seller whose product is in the order
      orderItems.forEach(item => {
        addNotification({
          type: 'new_order',
          title: 'New Order Received!',
          message: `Order #${newOrder._id.slice(-8)} from ${orderData.customerInfo.name} - ${currency}${orderData.amount}`,
          orderId: newOrder._id,
          customerName: orderData.customerInfo.name,
          amount: orderData.amount,
          sellerId: item.product.userId // Only this seller should see this notification
        });
      });
      
      setOrderPlaced(true);
      
      console.log('Order placed successfully!', newOrder);
      
    } catch (error) {
      console.error('Order failed:', error);
      alert('Order failed. Please try again.');
    }
  }

  const handlePaymentSuccess = (paymentData) => {
    console.log('Payment successful:', paymentData);
    setShowPaymentForm(false);
    processOrder();
  }

  const handlePaymentError = (error) => {
    console.error('Payment failed:', error);
    alert('Payment failed. Please try again.');
  }

  useEffect(() => {
    fetchUserAddresses();
  }, [])

  return (
    <div className="w-full lg:w-96 xl:w-[28rem] bg-gray-500/5 p-4 sm:p-5 lg:p-6 rounded-lg">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-700">
        Order Summary
      </h2>
      <hr className="border-gray-500/30 my-4 sm:my-5" />
      
      {!isSignedIn ? (
        <div className="text-center py-6 sm:py-8">
          <div className="mb-4 sm:mb-6">
            <svg className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Sign In Required</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">You need to be signed in to place an order.</p>
          <SignInButton mode="modal">
            <OrangeButton className="w-full py-2.5 sm:py-3 px-4 sm:px-6 text-sm sm:text-base">
              Sign In to Continue
            </OrangeButton>
          </SignInButton>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm sm:text-base font-medium uppercase text-gray-600">
                Delivery Address
              </label>
              <button
                onClick={() => setShowAddressManager(true)}
                className="text-xs sm:text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                Manage Addresses
              </button>
            </div>
            
            {selectedAddress ? (
              <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{selectedAddress.fullName}</p>
                    <p className="text-sm text-gray-600">{selectedAddress.phoneNumber}</p>
                    <p className="text-sm text-gray-600">
                      {selectedAddress.area}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedAddress(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <p className="text-sm text-gray-600 mb-2">No address selected</p>
                <button
                  onClick={() => setShowAddressManager(true)}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  Select or Add Address
                </button>
              </div>
            )}
          </div>

        <div>
            <label className="text-sm sm:text-base font-medium uppercase text-gray-600 block mb-2">
            Promo Code
          </label>
            <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-3">
            <input
              type="text"
              placeholder="Enter promo code"
                className="flex-grow w-full outline-none p-2.5 sm:p-3 text-gray-600 border rounded-lg text-sm"
            />
              <button className="w-full sm:w-auto bg-orange-600 text-white px-6 sm:px-9 py-2.5 sm:py-2 hover:bg-orange-700 rounded-lg text-sm font-medium">
              Apply
            </button>
          </div>
        </div>

          <hr className="border-gray-500/30 my-4 sm:my-5" />

          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-between text-sm sm:text-base font-medium">
            <p className="uppercase text-gray-600">Items {getCartCount()}</p>
              <p className="text-gray-800">{currency}{getCartAmount}</p>
          </div>
            <div className="flex justify-between text-sm sm:text-base">
            <p className="text-gray-600">Shipping Fee</p>
            <p className="font-medium text-gray-800">Free</p>
          </div>
            <div className="flex justify-between text-sm sm:text-base">
            <p className="text-gray-600">Tax (2%)</p>
              <p className="font-medium text-gray-800">{currency}{Math.floor(getCartAmount * 0.02)}</p>
          </div>
            <div className="flex justify-between text-base sm:text-lg lg:text-xl font-medium border-t pt-3">
            <p>Total</p>
              <p>{currency}{getCartAmount + Math.floor(getCartAmount * 0.02)}</p>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mt-6">
            <PaymentMethods
              selectedPayment={selectedPayment}
              onPaymentSelect={setSelectedPayment}
              totalAmount={getCartAmount}
            />
          </div>

          <button 
            onClick={createOrder} 
            className="w-full bg-orange-600 text-white py-3 sm:py-4 mt-4 sm:mt-5 hover:bg-orange-700 rounded-lg font-medium text-sm sm:text-base disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!selectedAddress || !selectedPayment}
          >
            {!selectedAddress ? 'Select Address First' : 
             !selectedPayment ? 'Select Payment Method' : 
             'Place Order'}
          </button>
        </div>
      )}

      {/* Stripe Payment Form Modal */}
      {showPaymentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Complete Payment</h3>
                <button
                  onClick={() => setShowPaymentForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <StripePayment
                totalAmount={getCartAmount}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
              />
          </div>
        </div>
      </div>
      )}

      {/* Order Success Modal */}
      {orderPlaced && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Order Placed Successfully!</h3>
            <p className="text-gray-600 mb-4">
              Your order has been confirmed. You will receive a confirmation email shortly.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setOrderPlaced(false);
                  router.push('/my-orders');
                }}
                className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700"
              >
                View My Orders
              </button>
              <button
                onClick={() => {
                  setOrderPlaced(false);
                  router.push('/');
                }}
                className="w-full text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-100"
              >
                Continue Shopping
      </button>
            </div>
          </div>
        </div>
      )}

      {/* Address Manager Modal */}
      {showAddressManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Manage Addresses</h3>
                <button
                  onClick={() => setShowAddressManager(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <AddressManager
                onAddressSelect={(address) => {
                  setSelectedAddress(address);
                  setShowAddressManager(false);
                }}
                selectedAddress={selectedAddress}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;