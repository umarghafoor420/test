"use client"
import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";

const PaymentMethods = ({ selectedPayment, onPaymentSelect, totalAmount }) => {
  const { currency } = useAppContext();

  const paymentMethods = [
    {
      id: 'jazzcash',
      name: 'JazzCash',
      description: 'Pay with JazzCash mobile wallet',
      icon: '📱',
      popular: true,
      fee: 0,
      processingTime: 'Instant'
    },
    {
      id: 'easypaisa',
      name: 'EasyPaisa',
      description: 'Pay with EasyPaisa mobile wallet',
      icon: '💳',
      popular: true,
      fee: 0,
      processingTime: 'Instant'
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      description: 'Direct bank transfer (IBAN)',
      icon: '🏦',
      popular: false,
      fee: 0,
      processingTime: '1-2 hours'
    },
    {
      id: 'stripe',
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, American Express',
      icon: '💳',
      popular: false,
      fee: 2.5,
      processingTime: 'Instant'
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when your order arrives',
      icon: '💰',
      popular: true,
      fee: 50,
      processingTime: 'On delivery'
    }
  ];

  const calculateTotal = (method) => {
    const baseAmount = totalAmount;
    const fee = method.fee;
    return baseAmount + fee;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Payment Method</h3>
      
      <div className="space-y-3">
        {paymentMethods.map((method) => {
          const isSelected = selectedPayment === method.id;
          const totalWithFee = calculateTotal(method);
          
          return (
            <div
              key={method.id}
              onClick={() => onPaymentSelect(method.id)}
              className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                isSelected
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{method.icon}</div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{method.name}</h4>
                      {method.popular && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{method.description}</p>
                    <p className="text-xs text-gray-500">
                      Processing: {method.processingTime}
                      {method.fee > 0 && ` • Fee: ${currency}${method.fee}`}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">
                    {currency}{totalWithFee.toFixed(2)}
                  </div>
                  {method.fee > 0 && (
                    <div className="text-xs text-gray-500">
                      +{currency}{method.fee} fee
                    </div>
                  )}
                </div>
              </div>
              
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Payment Instructions */}
      {selectedPayment && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Payment Instructions</h4>
          {selectedPayment === 'jazzcash' && (
            <div className="text-sm text-blue-800">
              <p>1. Open JazzCash app on your phone</p>
              <p>2. Go to "Send Money" → "To Account"</p>
              <p>3. Enter our JazzCash number: <strong>0300-1234567</strong></p>
              <p>4. Enter amount: <strong>{currency}{calculateTotal(paymentMethods.find(m => m.id === selectedPayment)).toFixed(2)}</strong></p>
              <p>5. Add reference: <strong>QC-{Date.now().toString().slice(-6)}</strong></p>
            </div>
          )}
          
          {selectedPayment === 'easypaisa' && (
            <div className="text-sm text-blue-800">
              <p>1. Open EasyPaisa app on your phone</p>
              <p>2. Go to "Send Money" → "To Account"</p>
              <p>3. Enter our EasyPaisa number: <strong>0345-1234567</strong></p>
              <p>4. Enter amount: <strong>{currency}{calculateTotal(paymentMethods.find(m => m.id === selectedPayment)).toFixed(2)}</strong></p>
              <p>5. Add reference: <strong>QC-{Date.now().toString().slice(-6)}</strong></p>
            </div>
          )}
          
          {selectedPayment === 'bank_transfer' && (
            <div className="text-sm text-blue-800">
              <p>1. Transfer to our bank account:</p>
              <p><strong>Bank:</strong> HBL (Habib Bank Limited)</p>
              <p><strong>Account Title:</strong> QuickCart Pvt Ltd</p>
              <p><strong>Account Number:</strong> 1234567890123456</p>
              <p><strong>IBAN:</strong> PK36HABB0012345678901234</p>
              <p>2. Send us the transaction receipt via WhatsApp: <strong>+92-300-1234567</strong></p>
            </div>
          )}
          
          {selectedPayment === 'stripe' && (
            <div className="text-sm text-blue-800">
              <p>1. Enter your card details securely</p>
              <p>2. Your payment will be processed by Stripe</p>
              <p>3. You'll receive instant confirmation</p>
              <p>4. Processing fee: {currency}2.5 (2.5%)</p>
            </div>
          )}
          
          {selectedPayment === 'cod' && (
            <div className="text-sm text-blue-800">
              <p>1. Pay when your order arrives</p>
              <p>2. Cash on delivery fee: {currency}50</p>
              <p>3. Have exact change ready</p>
              <p>4. Our delivery person will collect payment</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;
