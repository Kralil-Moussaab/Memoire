import { useState } from "react";
import { Search, Filter, ChevronDown, Phone, Mail, MapPin } from "lucide-react";

export default function PatientsPage() {
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      age: 32,
      gender: "Female",
      lastVisit: "2024-02-15",
      nextVisit: "2024-03-15",
      condition: "Hypertension",
      phone: "+1234567890",
      email: "sarah.j@example.com",
      address: "123 Main St, City",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    {
      id: 2,
      name: "Michael Brown",
      age: 45,
      gender: "Male",
      lastVisit: "2024-02-10",
      nextVisit: "2024-03-10",
      condition: "Diabetes",
      phone: "+1234567891",
      email: "michael.b@example.com",
      address: "456 Oak St, City",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
      id: 3,
      name: "Emily Davis",
      age: 28,
      gender: "Female",
      lastVisit: "2024-02-18",
      nextVisit: "2024-03-18",
      condition: "Asthma",
      phone: "+1234567892",
      email: "emily.d@example.com",
      address: "789 Pine St, City",
      image: "https://randomuser.me/api/portraits/women/3.jpg",
    },
  ]);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
    setShowDetails(true);
  };

  return (
    <div className="p-5">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Patients
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage and view your patient records
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300">
            <Filter size={20} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map((patient) => (
          <div
            key={patient.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <img
                  src={patient.image}
                  alt={patient.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {patient.name}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {patient.age} years • {patient.gender}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Phone className="w-4 h-4 mr-2" />
                  {patient.phone}
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4 mr-2" />
                  {patient.email}
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4 mr-2" />
                  {patient.address}
                </div>
              </div>

              <div className="mt-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Condition
                </div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {patient.condition}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Last Visit
                  </div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {patient.lastVisit}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Next Visit
                  </div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {patient.nextVisit}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => handleViewDetails(patient)}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  View Details
                </button>
                <button className="px-4 py-2 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50">
                  Schedule
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Patient Details Modal */}
      {showDetails && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Patient Details
              </h2>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ×
              </button>
            </div>
            {/* Add detailed patient information here */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}