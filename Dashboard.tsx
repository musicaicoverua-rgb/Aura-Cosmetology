import { useEffect, useState } from 'react';
import { 
  Calendar, 
  Users, 
  MessageSquare, 
  Star, 
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';
import { appointmentService } from '@/services/appointmentService';
import { clientService } from '@/services/clientService';
import { reviewService } from '@/services/reviewService';

interface Stats {
  appointments: { today: number; pending: number; total: number };
  clients: { total: number; vip: number };
  messages: { unread: number };
  reviews: { total: number; pending: number; average: number };
}

export const Dashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      const [appointmentStats, clientStats, reviewStats] = await Promise.all([
        appointmentService.getStats(),
        clientService.getStats(),
        reviewService.getStats(),
      ]);

      setStats({
        appointments: appointmentStats.data || { today: 0, pending: 0, total: 0 },
        clients: clientStats.data || { total: 0, vip: 0 },
        messages: { unread: 0 },
        reviews: reviewStats.data || { total: 0, pending: 0, average: 0 },
      });
      setIsLoading(false);
    };

    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4A24F]" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Today's Appointments",
      value: stats?.appointments.today || 0,
      icon: Calendar,
      color: 'bg-blue-500',
      trend: '+12%',
    },
    {
      title: 'Pending Appointments',
      value: stats?.appointments.pending || 0,
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      title: 'Total Clients',
      value: stats?.clients.total || 0,
      icon: Users,
      color: 'bg-green-500',
      trend: '+5%',
    },
    {
      title: 'VIP Clients',
      value: stats?.clients.vip || 0,
      icon: Star,
      color: 'bg-purple-500',
    },
    {
      title: 'Unread Messages',
      value: stats?.messages.unread || 0,
      icon: MessageSquare,
      color: 'bg-red-500',
    },
    {
      title: 'Pending Reviews',
      value: stats?.reviews.pending || 0,
      icon: CheckCircle,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-display mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">{card.title}</p>
                <p className="text-3xl font-bold">{card.value}</p>
                {card.trend && (
                  <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                    <TrendingUp size={16} />
                    <span>{card.trend}</span>
                  </div>
                )}
              </div>
              <div className={`${card.color} p-3 rounded-lg text-white`}>
                <card.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <a
            href="/admin/appointments"
            className="px-4 py-2 bg-[#D4A24F] text-white rounded-lg hover:bg-[#c49345] transition-colors"
          >
            View Calendar
          </a>
          <a
            href="/admin/clients"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Add New Client
          </a>
          <a
            href="/admin/services"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Manage Services
          </a>
          <a
            href="/admin/messages"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Check Messages
          </a>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Appointments</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Olena Kovalenko</p>
                <p className="text-sm text-gray-500">Aesthetic Consultation</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Today, 14:00</p>
                <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                  Pending
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Maria Petrenko</p>
                <p className="text-sm text-gray-500">Medical Facial</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Today, 16:30</p>
                <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  Confirmed
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Average Rating</h2>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl font-bold">{stats?.reviews.average || 0}</div>
            <div>
              <div className="flex items-center gap-1 text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={20}
                    className={
                      star <= Math.round(stats?.reviews.average || 0)
                        ? 'fill-current'
                        : 'text-gray-300'
                    }
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Based on {stats?.reviews.total || 0} reviews
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};