'use client'
import React from 'react';
import { useRouter } from 'next/navigation';

const CreditPurchase = () => {
  const router = useRouter();

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      "Hello! I'm interested in testing the AI Remodelling System.\n\n" +
      "Here are my details:\n" +
      "Name: [Please fill]\n" +
      "Email: [Please fill]\n" +
      "Profession: [e.g., Interior Designer, Architect, Real Estate Agent, etc.]\n" +
      "Identity Document Type: [ID Card/Passport/Driver's License]\n\n" +
      "Intended Use Case:\n" +
      "- Primary purpose: [e.g., Client Visualization, Project Planning, etc.]\n" +
      "- Project types: [e.g., Residential Interiors, Commercial Spaces, etc.]\n" +
      "- Monthly expected usage: [Approximate number of designs needed]\n\n" +
      "I have attached my identity document for verification."
    );
    window.open(`https://wa.me/8801755557150?text=${message}`, '_blank');
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="text-center space-y-4 sm:space-y-6">
          {/* Header Section */}
          <div className="mb-4 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-2 flex items-center justify-center flex-wrap gap-2">
              System under Beta Test
              <span className="inline-block animate-pulse bg-blue-500 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full">
                Beta
              </span>
            </h2>
            <p className="text-gray-600 mt-2 sm:mt-4 max-w-2xl mx-auto text-sm sm:text-base px-4">
              Our AI Remodelling System is currently in beta testing phase. Professional users in interior design, architecture, and real estate can request free credits for testing.
            </p>
          </div>

          {/* Instructions Card */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 max-w-2xl mx-auto">
            <h3 className="text-base sm:text-lg font-semibold mb-4">How to Request Beta Access:</h3>
            
            {/* Use Cases Section */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-blue-800 mb-2 text-sm sm:text-base">Ideal Use Cases:</h4>
              <ul className="text-blue-700 text-sm sm:text-base space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2"></span>
                  <span>Interior designers visualizing room makeovers for clients</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2"></span>
                  <span>Architects presenting design concepts to stakeholders</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2"></span>
                  <span>Real estate agents showcasing property potential to buyers</span>
                </li>
              </ul>
            </div>
            
            {/* Instructions List */}
            <div className="text-left space-y-3 mb-6">
              <div className="flex items-start gap-2">
                <span className="font-bold">1.</span>
                <span className="text-sm sm:text-base">Click the WhatsApp button below</span>
              </div>
              
              <div className="flex items-start gap-2">
                <span className="font-bold">2.</span>
                <div className="flex-1">
                  <span className="text-sm sm:text-base">Send us the following information:</span>
                  <ul className="ml-4 mt-2 space-y-1 text-gray-600 text-sm sm:text-base">
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                      Your full name
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                      Email address
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                      Your profession
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                      Intended use case & expected usage
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                      A valid identity document (ID card/Passport/Driver's License)
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <span className="font-bold">3.</span>
                <span className="text-sm sm:text-base">Once approved, you'll receive free credits for testing the system</span>
              </div>
            </div>

            {/* WhatsApp Button */}
            <button
              onClick={handleWhatsAppClick}
              className="w-full bg-green-500 text-white px-4 sm:px-6 py-3 rounded-lg font-medium flex items-center justify-center hover:bg-green-600 transition-colors gap-2 text-sm sm:text-base"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Contact on WhatsApp
            </button>
          </div>

          {/* Privacy Notice */}
          <div className="text-xs sm:text-sm text-gray-500 mt-4 sm:mt-6 px-4">
            Your identity document will be used solely for verification purposes and will be handled with strict confidentiality.
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditPurchase;