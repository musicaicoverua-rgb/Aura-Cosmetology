import { useEffect, useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Search, CheckCircle, XCircle, Clock } from 'lucide-react';
import { appointmentService } from '@/services/appointmentService';
import { serviceService } from '@/services/serviceService';
import type { Appointment, Service } from '@/types';

export const Appointments = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  useEffect(() => {
    loadData();
  }, [currentDate]);

  const loadData = async () => {
    const startDate = format(monthStart, 'yyyy-MM-dd');
    const endDate = format(monthEnd, 'yyyy-MM-dd');

    const [appointmentsData, servicesData] = await Promise.all([
      appointmentService.getByDateRange(startDate, endDate),
      serviceService.getAll(),
    ]);

    setAppointments(appointmentsData.data || []);
    setServices(servicesData.data || []);
  };

  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter((apt) => isSameDay(new Date(apt.date), day));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return CheckCircle;
      case 'pending':
        return Clock;
      case 'cancelled':
        return XCircle;
      default:
        return Clock;
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    const clientName = apt.client_name || apt.name || '';
    const clientPhone = apt.client_phone || apt.phone || '';
    const matchesSearch = 
      clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clientPhone.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display">Appointments</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#D4A24F] text-white rounded-lg hover:bg-[#c49345] transition-colors">
          <Plus size={20} />
          New Appointment
        </button>
      </div>

      {/* Calendar Navigation */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-xl font-semibold">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <button
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
          {days.map((day) => {
            const dayAppointments = getAppointmentsForDay(day);
            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={`min-h-[80px] p-2 rounded-lg border transition-colors text-left ${
                  isSameDay(day, new Date())
                    ? 'border-[#D4A24F] bg-[#D4A24F]/5'
                    : 'border-gray-100 hover:border-gray-200'
                } ${selectedDate && isSameDay(day, selectedDate) ? 'ring-2 ring-[#D4A24F]' : ''}`}
              >
                <span className="text-sm font-medium">{format(day, 'd')}</span>
                {dayAppointments.length > 0 && (
                  <div className="mt-1 space-y-1">
                    {dayAppointments.slice(0, 2).map((apt) => (
                      <div
                        key={apt.id}
                        className={`text-xs px-1.5 py-0.5 rounded truncate ${getStatusColor(apt.status)}`}
                      >
                        {apt.time} - {apt.client_name || apt.name}
                      </div>
                    ))}
                    {dayAppointments.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{dayAppointments.length - 2} more
                      </div>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D4A24F] focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D4A24F]"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Date & Time</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Client</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Service</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((apt) => {
                const StatusIcon = getStatusIcon(apt.status);
                const serviceId = apt.service_id || apt.serviceId;
                const clientName = apt.client_name || apt.name;
                const clientPhone = apt.client_phone || apt.phone;
                return (
                  <tr key={apt.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium">{apt.date}</div>
                      <div className="text-sm text-gray-500">{apt.time}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium">{clientName}</div>
                      <div className="text-sm text-gray-500">{clientPhone}</div>
                    </td>
                    <td className="py-3 px-4">
                      {services.find((s) => s.id === serviceId)?.name || 'Unknown Service'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                        <StatusIcon size={14} />
                        {apt.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => appointmentService.update(apt.id, { status: 'confirmed' })}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Confirm"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          onClick={() => appointmentService.update(apt.id, { status: 'cancelled' })}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Cancel"
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};