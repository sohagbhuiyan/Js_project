import React from 'react';

const PaymentManagement = () => {
  const transactions = [
    { id: 1, orderId: 'ORD-001', amount: 149.99, status: 'Completed', date: '2023-08-15' },
    { id: 2, orderId: 'ORD-002', amount: 89.99, status: 'Pending', date: '2023-08-16' },
    { id: 3, orderId: 'ORD-003', amount: 199.99, status: 'Failed', date: '2023-08-17' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Payment Management</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Transactions</h2>
            <button className="text-sm text-blue-600 hover:text-blue-800">
              View All →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Order ID</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Amount</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-blue-600">
                      <button className="hover:underline">
                        {transaction.orderId}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm">${transaction.amount.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        transaction.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{transaction.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Gateway Integration */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold mb-4">Payment Integrations</h2>
          <div className="space-y-6">
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <img src="/stripe-logo.png" alt="Stripe" className="h-6 mr-2" />
                  <span className="font-medium">Stripe</span>
                </div>
                <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200">
                  Configure
                </button>
              </div>
              <p className="text-sm text-gray-600">Credit/Debit Cards, Apple Pay, Google Pay</p>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <img src="/paypal-logo.png" alt="PayPal" className="h-6 mr-2" />
                  <span className="font-medium">PayPal</span>
                </div>
                <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200">
                  Configure
                </button>
              </div>
              <p className="text-sm text-gray-600">PayPal Express Checkout</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Test Mode Activated</h3>
              <p className="text-xs text-blue-700">
                Use test credentials for payment processing. 
                <a href="#" className="underline ml-1">View test cards</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentManagement;
