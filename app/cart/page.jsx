'use client'
import React from "react";
import { assets } from "@/assets/assets";
import OrderSummary from "@/components/OrderSummary";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";
// import { useUser, SignInButton } from "@clerk/nextjs";
import OrangeButton from '@/components/OrangeButton';

const Cart = () => {

  const { products, router, cartItems, addToCart, updateCartQuantity, getCartCount } = useAppContext();
  // const { isSignedIn } = useUser();
  const isSignedIn = true; // Temporarily set to true for demo

  return (
    <>
      <Navbar />
      {!isSignedIn ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32">
          <div className="text-center max-w-sm sm:max-w-md lg:max-w-lg">
            <div className="mb-6 sm:mb-8">
              <svg className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Sign In to View Cart
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 sm:mb-8 px-4">
              You need to be signed in to view your cart and place orders. Please sign in to continue.
            </p>
            <div className="space-y-3 sm:space-y-4 max-w-xs sm:max-w-sm mx-auto">
              <SignInButton mode="modal">
                <OrangeButton className="w-full py-3 sm:py-4 px-6 text-sm sm:text-base">
                  Sign In
                </OrangeButton>
              </SignInButton>
              <OrangeButton 
                onClick={() => router.push('/')} 
                className="w-full text-gray-600 bg-gray-100 hover:bg-gray-200 py-2 sm:py-3 px-6 text-sm sm:text-base"
              >
                Continue Shopping
              </OrangeButton>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-10 xl:gap-12 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 pt-8 sm:pt-12 lg:pt-14 mb-16 sm:mb-20">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 border-b border-gray-500/30 pb-4 sm:pb-6 gap-2 sm:gap-0">
            <p className="text-xl sm:text-2xl lg:text-3xl text-gray-500">
              Your <span className="font-medium text-orange-600">Cart</span>
            </p>
            <p className="text-base sm:text-lg lg:text-xl text-gray-500/80">{getCartCount()} Items</p>
          </div>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="min-w-full table-auto">
              <thead className="text-left">
                <tr>
                  <th className="text-nowrap pb-4 sm:pb-6 px-2 sm:px-4 text-gray-600 font-medium text-sm sm:text-base">
                    Product Details
                  </th>
                  <th className="pb-4 sm:pb-6 px-2 sm:px-4 text-gray-600 font-medium text-sm sm:text-base hidden sm:table-cell">
                    Price
                  </th>
                  <th className="pb-4 sm:pb-6 px-2 sm:px-4 text-gray-600 font-medium text-sm sm:text-base">
                    Quantity
                  </th>
                  <th className="pb-4 sm:pb-6 px-2 sm:px-4 text-gray-600 font-medium text-sm sm:text-base">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(cartItems).map((itemId) => {
                  const product = products.find(product => product._id === itemId);

                  if (!product || cartItems[itemId] <= 0) return null;

                  return (
                    <tr key={itemId} className="border-b border-gray-200">
                      <td className="py-4 px-2 sm:px-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="flex-shrink-0">
                            <div className="rounded-lg overflow-hidden bg-gray-500/10 p-1 sm:p-2">
                              <Image
                                src={product.image[0]}
                                alt={product.name}
                                className="w-12 h-12 sm:w-16 sm:h-16 object-cover mix-blend-multiply"
                                width={1280}
                                height={720}
                              />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm sm:text-base text-gray-800 font-medium truncate">{product.name}</p>
                            <div className="flex items-center justify-between mt-1 sm:mt-2">
                              <span className="text-sm text-gray-600 sm:hidden">${product.offerPrice}</span>
                              <button
                                className="text-xs text-orange-600 hover:text-orange-700 transition"
                                onClick={() => updateCartQuantity(product._id, 0)}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2 sm:px-4 text-gray-600 text-sm sm:text-base hidden sm:table-cell">
                        ${product.offerPrice}
                      </td>
                      <td className="py-4 px-2 sm:px-4">
                        <div className="flex items-center justify-center sm:justify-start gap-2">
                          <button 
                            onClick={() => updateCartQuantity(product._id, cartItems[itemId] - 1)}
                            className="p-1 hover:bg-gray-100 rounded transition"
                          >
                            <Image
                              src={assets.decrease_arrow}
                              alt="decrease_arrow"
                              className="w-4 h-4"
                            />
                          </button>
                          <input 
                            onChange={e => updateCartQuantity(product._id, Number(e.target.value))} 
                            type="number" 
                            value={cartItems[itemId]} 
                            className="w-12 sm:w-16 border text-center appearance-none rounded text-sm"
                            min="1"
                          />
                          <button 
                            onClick={() => addToCart(product._id)}
                            className="p-1 hover:bg-gray-100 rounded transition"
                          >
                            <Image
                              src={assets.increase_arrow}
                              alt="increase_arrow"
                              className="w-4 h-4"
                            />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-2 sm:px-4 text-gray-600 text-sm sm:text-base font-medium">
                        ${(product.offerPrice * cartItems[itemId]).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <button onClick={()=> router.push('/all-products')} className="group flex items-center justify-center sm:justify-start mt-6 gap-2 text-orange-600 hover:text-orange-700 transition text-sm sm:text-base">
            <Image
              className="group-hover:-translate-x-1 transition w-4 h-4 sm:w-5 sm:h-5"
              src={assets.arrow_right_icon_colored}
              alt="arrow_right_icon_colored"
            />
            Continue Shopping
          </button>
        </div>
        <OrderSummary />
        </div>
      )}
    </>
  );
};

export default Cart;
