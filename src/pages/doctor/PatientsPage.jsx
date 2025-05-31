import { useState, useEffect } from "react";
import { Search, Filter, ChevronDown, Phone, Mail, MapPin } from "lucide-react";
import { getPatientOfDoctor } from "../../services/api";

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await getPatientOfDoctor();
        if (response.success) {
          setPatients(response.data.users);
        } else {
          setError("Failed to fetch patients");
        }
      } catch (err) {
        setError("Error fetching patients");
        console.error("Error fetching patients:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
    setShowDetails(true);
  };

  if (loading) {
    return (
      <div className="p-5 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">
          Loading patients...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

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

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map((patient) => (
          <div
            key={patient.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-2xl text-gray-500 dark:text-gray-400">
                    {patient.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {patient.name}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {patient.age} years • {patient.sexe}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Phone className="w-4 h-4 mr-2" />
                  {patient.phoneNumber}
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4 mr-2" />
                  {patient.email}
                </div>
              </div>

              <div className="mt-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Chronic Disease
                </div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {patient.chronicDisease}
                </div>
              </div>

              <div className="mt-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Blood Group
                </div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {patient.groupage}
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => handleViewDetails(patient)}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Patient Details Modal */}
      {showDetails && selectedPatient && (
        <div className="fixed inset-0 backdrop-blur bg-black/30 flex items-center justify-center z-50">
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
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedPatient.name}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {selectedPatient.age} years • {selectedPatient.sexe}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Email
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedPatient.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Phone
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedPatient.phoneNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Chronic Disease
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedPatient.chronicDisease}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Blood Group
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedPatient.groupage}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
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
