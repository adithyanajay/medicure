import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Star } from 'lucide-react';

export default function DoctorsScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const doctors = [
    {
      id: 1,
      name: 'Dr. Sarah Smith',
      specialization: 'Cardiology',
      experience: '10 years',
      rating: 4.8,
      patients: 1200,
      image: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    {
      id: 2,
      name: 'Dr. Michael Johnson',
      specialization: 'Neurology',
      experience: '8 years',
      rating: 4.6,
      patients: 950,
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    // Add more doctors as needed
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Doctors</h1>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5 mr-2" />
          Add Doctor
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center">
          <Search className="w-5 h-5 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search doctors..."
            className="flex-1 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {doctor.name}
                  </h3>
                  <p className="text-gray-600">{doctor.specialization}</p>
                  <div className="flex items-center mt-2">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm text-gray-600">
                      {doctor.rating} ({doctor.patients} patients)
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {doctor.experience} experience
                </span>
                <div className="flex space-x-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 