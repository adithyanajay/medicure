import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  User, 
  TrendingUp,
  Clock,
  DollarSign
} from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Doctors', value: '24', icon: Users, color: 'blue' },
    { label: 'Total Appointments', value: '156', icon: Calendar, color: 'green' },
    { label: 'Total Patients', value: '89', icon: User, color: 'purple' },
    { label: 'Today\'s Appointments', value: '12', icon: Clock, color: 'orange' },
  ];

  const recentAppointments = [
    {
      id: 1,
      patientName: 'John Doe',
      doctorName: 'Dr. Sarah Smith',
      time: '10:00 AM',
      date: '2024-03-25',
      status: 'Confirmed',
    },
    {
      id: 2,
      patientName: 'Jane Smith',
      doctorName: 'Dr. Michael Johnson',
      time: '11:30 AM',
      date: '2024-03-25',
      status: 'Pending',
    },
    // Add more appointments as needed
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          <span className="text-sm text-gray-600">Last updated: 2 hours ago</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-semibold text-gray-800 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-${stat.color}-50`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-500`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Recent Appointments</h2>
          <Link
            to="/appointments"
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentAppointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {appointment.patientName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {appointment.doctorName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {appointment.date} at {appointment.time}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        appointment.status === 'Confirmed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 