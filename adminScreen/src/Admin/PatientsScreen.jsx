import React, { useState } from 'react';
import { Search, User, Phone, Mail, CalendarDays, Clock } from 'lucide-react';

export default function PatientsScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const patients = [
    {
      id: 1,
      name: 'John Doe',
      age: 35,
      gender: 'Male',
      phone: '+1 234 567 8900',
      email: 'john.doe@example.com',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
      lastVisit: '2024-03-20',
      nextAppointment: '2024-03-25',
    },
    {
      id: 2,
      name: 'Jane Smith',
      age: 28,
      gender: 'Female',
      phone: '+1 234 567 8901',
      email: 'jane.smith@example.com',
      image: 'https://randomuser.me/api/portraits/women/1.jpg',
      lastVisit: '2024-03-18',
      nextAppointment: '2024-03-26',
    },
    // Add more patients as needed
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Patients</h1>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center">
          <Search className="w-5 h-5 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search patients..."
            className="flex-1 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map((patient) => (
          <div
            key={patient.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start">
                <img
                  src={patient.image}
                  alt={patient.name}
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {patient.name}
                  </h3>
                  <div className="flex items-center mt-1">
                    <User className="w-4 h-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-600">
                      {patient.age} years, {patient.gender}
                    </span>
                  </div>
                  <div className="flex items-center mt-1">
                    <Phone className="w-4 h-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-600">{patient.phone}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <Mail className="w-4 h-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-600">{patient.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center">
                  <CalendarDays className="w-4 h-4 text-gray-400 mr-1" />
                  <span className="text-sm text-gray-600">
                    Last Visit: {patient.lastVisit}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-400 mr-1" />
                  <span className="text-sm text-gray-600">
                    Next: {patient.nextAppointment}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 