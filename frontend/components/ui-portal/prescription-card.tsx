import { FaTrashAlt, FaEdit, FaPrint } from "react-icons/fa";  // Import Font Awesome icons

export default function PrescriptionCard() {
    return (
        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <a href="#">
                <img
                    className="rounded-t-lg w-full"
                    src="/docs/images/blog/image-1.jpg"
                    alt="Prescription Image"
                />
            </a>
            <div className="p-5">
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Prescription ID: 12345
                </h5>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    <strong>Patient Information:</strong> John Doe, Male, Age: 30, Address: 123 Main St, City, Country
                </p>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    <strong>Pharmacist Information:</strong> Dr. Sarah Smith, Licensed Pharmacist, 5 Years Experience
                </p>

                {/* Buttons with Icons */}
                <div className="flex space-x-4 mt-4">
                    <button className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                        <FaTrashAlt className="w-5 h-5" />
                    </button>
                    <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <FaEdit className="w-5 h-5" />
                    </button>
                    <button className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                        <FaPrint className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
