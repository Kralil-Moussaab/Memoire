import { useState } from "react";
import { Gem, CreditCard, Check, ArrowLeft, Shield, Clock, Zap, X, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { bayingJewels } from "../services/api"; 

const jewelsPackages = [
  {
    id: 1,
    amount: 100,
    price: 9.99,
    popular: false,
    perJewel: "0.099¢ per jewel",
    color: "from-purple-500 to-indigo-500",
  },
  {
    id: 2,
    amount: 500,
    price: 44.99,
    popular: true,
    savings: "10% savings",
    perJewel: "0.089¢ per jewel",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 3,
    amount: 1000,
    price: 84.99,
    popular: false,
    savings: "15% savings",
    perJewel: "0.084¢ per jewel",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: 4,
    amount: 2000,
    price: 159.99,
    popular: false,
    savings: "20% savings",
    perJewel: "0.079¢ per jewel",
    color: "from-orange-500 to-amber-500",
  },
];

const features = [
  {
    icon: Shield,
    title: "Secure Payment",
    description: "Your payment information is encrypted and secure",
  },
  {
    icon: Clock,
    title: "Instant Credit",
    description: "Jewels are added to your account immediately",
  },
  {
    icon: Zap,
    title: "No Expiration",
    description: "Your Jewels never expire, use them anytime",
  },
];

export default function JewelsPage() {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    const formattedValue = value.replace(/(\d{4})/g, "$1 ").trim();
    setCardNumber(formattedValue);
  };

  const handleExpiryChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 6) {
      const formattedValue = value.replace(/(\d{2})(\d{0,4})/, "$1/$2").trim();
      setExpiry(formattedValue);
    }
  };

  const handleCvcChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 3) {
      setCvc(value);
    }
  };

  const handlePurchase = () => {
    if (!cardNumber || !expiry || !cvc) {
      setError("Please fill in all payment fields");
      return;
    }
    
    setError("");
    setShowPasswordModal(true);
  };

  const handleConfirmPurchase = async () => {
    if (!password) {
      setError("Password is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const purchaseData = JSON.stringify({
        CardNumber: cardNumber.replace(/\s/g, ""), 
        ExpiryDate: expiry,
        CVC: cvc,
        package: selectedPackage.id.toString(),
        password: password
      });

      const response = await bayingJewels(purchaseData);
      
      if (response.success) {
        setSuccess(true);
        setShowPasswordModal(false);
        setTimeout(() => {
          navigate(-1);
        }, 2000);
      } else {
        setError(response.error || "Failed to purchase jewels. Please try again.");
      }
    } catch (err) {
      setError("An error occurred during purchase. Please try again.");
      console.error("Purchase error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        <div className="text-center mb-12">
          <div className="inline-flex p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
            <Gem className="w-12 h-12 text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Purchase Jewels
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Get more Jewels to consult with our expert doctors
          </p>
        </div>

        {success && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full shadow-2xl">
              <div className="text-center">
                <div className="inline-flex p-3 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                  <Check className="w-12 h-12 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Purchase Successful!
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {selectedPackage?.amount} Jewels have been added to your account.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Redirecting...
                </p>
              </div>
            </div>
          </div>
        )}

        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Confirm Purchase
                </h2>
                <button 
                  onClick={() => setShowPasswordModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {error && (
                <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-lg mb-6">
                  {error}
                </div>
              )}
              
              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Please enter your password to confirm the purchase of {selectedPackage?.amount} Jewels for ${selectedPackage?.price}.
                </p>
                
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white text-lg"
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmPurchase}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Confirm Purchase"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {jewelsPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 ${
                selectedPackage?.id === pkg.id
                  ? "ring-2 ring-blue-500 scale-105"
                  : ""
              }`}
            >
              {pkg.popular && (
                <div className="absolute top-0 left-0 right-0">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1 text-sm font-medium text-center">
                    Most Popular
                  </div>
                </div>
              )}
              <div className={`bg-gradient-to-r ${pkg.color} p-6`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white text-2xl font-bold">
                      {pkg.amount}
                    </h3>
                    <p className="text-white/80 text-sm">Jewels</p>
                  </div>
                  <Gem className="w-8 h-8 text-white/80" />
                </div>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    ${pkg.price}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {pkg.perJewel}
                  </div>
                </div>
                {pkg.savings && (
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 mb-4">
                    {pkg.savings}
                  </div>
                )}
                <button
                  onClick={() => setSelectedPackage(pkg)}
                  className={`w-full py-2.5 rounded-lg transition-all duration-300 ${
                    selectedPackage?.id === pkg.id
                      ? "bg-blue-500 text-white"
                      : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white"
                  }`}
                >
                  {selectedPackage?.id === pkg.id ? (
                    <div className="flex items-center justify-center">
                      <Check size={20} className="mr-2" />
                      Selected
                    </div>
                  ) : (
                    "Select Package"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <div className="inline-flex p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                <feature.icon className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {selectedPackage && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
              Payment Details
            </h2>
            
            {error && !showPasswordModal && (
              <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Card Number
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    maxLength={19}
                    placeholder="1234 5678 9012 3456"
                    className="w-full pl-10 pr-4 py-3 border dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white text-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={handleExpiryChange}
                    placeholder="MM/YYYY"
                    maxLength={7}
                    className="w-full px-4 py-3 border dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    CVC
                  </label>
                  <input
                    type="text"
                    value={cvc}
                    onChange={handleCvcChange}
                    placeholder="123"
                    maxLength={3}
                    className="w-full px-4 py-3 border dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white text-lg"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={handlePurchase}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center text-lg font-medium disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Gem className="w-6 h-6 mr-2" />
                Purchase {selectedPackage.amount} Jewels for ${selectedPackage.price}
              </button>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                By purchasing, you agree to our Terms of Service
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}