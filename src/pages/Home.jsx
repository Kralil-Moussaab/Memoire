import React from "react";
import {
  Search,
  MapPin,
  Stethoscope,
  Heart,
  Activity,
  Brain,
  Microscope,
  Shield,
  Baby,
  Bone,
  ChevronDown,
} from "lucide-react";
import cube from "../assets/cube.png";
import patient from "../assets/patient.png";

export default function Hero() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="relative">
        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 pt-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="max-w-xl mb-12 md:mb-0 md:w-1/2">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Consult a Doctor Anytime,
                <br />
                Anywhere with <span className="text-blue-500">Med-Link</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Book Your Next Appointment or Connect Instantly via Chat or
                Video Call a particular doctor.
              </p>
              <button className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors">
                Consult Now
              </button>
            </div>
            <img
              src={cube}
              alt="Doctor"
              className="w-1/3 hidden md:block"
            />
          </div>
        </div>

        {/* Search Section */}
        <div className="max-w-5xl mx-auto px-4 -mb-20 relative z-10 mt-12">
          <div className="bg-white rounded-xl shadow-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Ex: Doctor..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Ex: Surgeon/Cardiologist"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <MapPin
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Set your location"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors">
                Search
              </button>
            </div>

            {/* What We Offer */}
            <div className="mt-8">
              <h3 className="text-center text-lg font-semibold mb-6">
                What We Offer
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-xl text-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="text-blue-500" size={24} />
                  </div>
                  <h4 className="text-sm font-medium">Find Doctor</h4>
                </div>
                <div className="bg-blue-50 p-6 rounded-xl text-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-sm font-medium">Book Appointment</h4>
                </div>
                <div className="bg-blue-50 p-6 rounded-xl text-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-sm font-medium">Online Consultation</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Find By Specialisation */}
      <div className="max-w-7xl mx-auto px-4 md:px-20 pt-52 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Find By <span className="text-blue-500">Specialisation</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connect with specialized healthcare professionals across various
            medical fields
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="text-blue-500" size={24} />
            </div>
            <p className="text-base md:text-lg font-semibold text-center text-gray-800">
              Dentistry
            </p>
            <p className="text-xs md:text-sm text-gray-500 text-center mt-2">
              Oral & Dental Care
            </p>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="text-blue-500" size={24} />
            </div>
            <p className="text-base md:text-lg font-semibold text-center text-gray-800">
              General
            </p>
            <p className="text-xs md:text-sm text-gray-500 text-center mt-2">
              Primary Healthcare
            </p>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Activity className="text-blue-500" size={24} />
            </div>
            <p className="text-base md:text-lg font-semibold text-center text-gray-800">
              Cardiologist
            </p>
            <p className="text-xs md:text-sm text-gray-500 text-center mt-2">
              Heart Specialist
            </p>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Brain className="text-blue-500" size={24} />
            </div>
            <p className="text-base md:text-lg font-semibold text-center text-gray-800">
              Neurologist
            </p>
            <p className="text-xs md:text-sm text-gray-500 text-center mt-2">
              Brain & Nerves
            </p>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Microscope className="text-blue-500" size={24} />
            </div>
            <p className="text-base md:text-lg font-semibold text-center text-gray-800">
              ENT
            </p>
            <p className="text-xs md:text-sm text-gray-500 text-center mt-2">
              Ear, Nose & Throat
            </p>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="text-blue-500" size={24} />
            </div>
            <p className="text-base md:text-lg font-semibold text-center text-gray-800">
              Dermatologist
            </p>
            <p className="text-xs md:text-sm text-gray-500 text-center mt-2">
              Skin Specialist
            </p>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Baby className="text-blue-500" size={24} />
            </div>
            <p className="text-base md:text-lg font-semibold text-center text-gray-800">
              Gynecologist
            </p>
            <p className="text-xs md:text-sm text-gray-500 text-center mt-2">
              Women's Health
            </p>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bone className="text-blue-500" size={24} />
            </div>
            <p className="text-base md:text-lg font-semibold text-center text-gray-800">
              Orthopedic
            </p>
            <p className="text-xs md:text-sm text-gray-500 text-center mt-2">
              Bone & Joints
            </p>
          </div>
        </div>
        <div className="text-center mt-12">
          <button className="bg-blue-500 cursor-pointer text-white px-8 md:px-10 py-3 rounded-xl hover:bg-blue-600 transition-colors duration-300 font-medium">
            View All Specialisations
          </button>
        </div>
      </div>

      {/* Patient Caring Section */}
      <div className="grid md:grid-cols-2 gap-7 px-4 md:px-20 pb-10 items-center">
        <div className="space-y-4 order-2 md:order-1">
          <img
            src={patient}
            alt="Doctor consulting patient"
            className="w-full rounded-lg mx-auto"
          />
        </div>
        <div className="text-center md:text-left order-1 md:order-2">
          <div className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            HELPING PATIENTS ACROSS ALGERIA!
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Patient <span className="text-blue-500">Caring</span>
          </h2>
          <p className="text-gray-600 mb-8">
            Our goal is to deliver quality of care in a courteous, respectful,
            and compassionate manner. We hope you will allow us to care for you
            and strive to be the first and best choice for healthcare.
          </p>
          <div className="space-y-4 inline-block text-left">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="text-gray-700">
                Seamless Doctor Appointments
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="text-gray-700">Online Support</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="text-gray-700">Easy Management</span>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked <span className="text-blue-500">Questions</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Get Your Answer</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          <details className="group bg-white rounded-lg shadow-md p-4 transition-all duration-300">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <span className="text-base md:text-lg font-medium text-gray-900">
                Why choose our medical for your family?
              </span>
              <ChevronDown className="h-5 w-5 text-gray-500 group-open:rotate-180 transition-transform" />
            </summary>
            <p className="mt-4 text-sm md:text-base text-gray-600">
              We provide comprehensive family healthcare with experienced
              doctors and modern facilities.
            </p>
          </details>

          <details className="group bg-white rounded-lg shadow-md p-4 transition-all duration-300">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <span className="text-base md:text-lg font-medium text-gray-900">
                What can I use Med-Link for?
              </span>
              <ChevronDown className="h-5 w-5 text-gray-500 group-open:rotate-180 transition-transform" />
            </summary>
            <p className="mt-4 text-sm md:text-base text-gray-600">
              Med-Link offers online consultations, appointment booking, and
              access to specialist doctors.
            </p>
          </details>

          <details className="group bg-white rounded-lg shadow-md p-4 transition-all duration-300">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <span className="text-base md:text-lg font-medium text-gray-900">
                What should I expect from my online visit?
              </span>
              <ChevronDown className="h-5 w-5 text-gray-500 group-open:rotate-180 transition-transform" />
            </summary>
            <p className="mt-4 text-sm md:text-base text-gray-600">
              You'll have a private video consultation with a qualified doctor
              who can diagnose, treat, and prescribe medication if needed.
            </p>
          </details>

          <details className="group bg-white rounded-lg shadow-md p-4 transition-all duration-300">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <span className="text-base md:text-lg font-medium text-gray-900">
                What type of doctors and specialists are available on Med-Link?
              </span>
              <ChevronDown className="h-5 w-5 text-gray-500 group-open:rotate-180 transition-transform" />
            </summary>
            <p className="mt-4 text-sm md:text-base text-gray-600">
              We have a wide range of specialists including cardiologists,
              dermatologists, pediatricians, and more.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}