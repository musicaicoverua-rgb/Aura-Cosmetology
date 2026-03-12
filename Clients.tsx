import { useEffect, useState } from 'react';
import { Search, Plus, Star, Phone, Mail, Calendar, Edit, Trash2, MessageSquare } from 'lucide-react';
import { clientService } from '@/services/clientService';
import type { Client } from '@/types';

export const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [noteText, setNoteText] = useState('');
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    isVip: false,
    notes: '',
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    const { data } = await clientService.getAll();
    setClients(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      await clientService.update(editingClient.id, formData);
    } else {
      await clientService.create({
        ...formData,
        appointments_count: 0,
        last_visit: null,
      });
    }
    setShowModal(false);
    setEditingClient(null);
    setFormData({ name: '', phone: '', email: '', isVip: false, notes: '' });
    loadClients();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this client?')) {
      await clientService.delete(id);
      loadClients();
    }
  };

  const handleToggleVip = async (client: Client) => {
    await clientService.toggleVip(client.id, !client.isVip);
    loadClients();
  };

  const handleAddNote = async () => {
    if (selectedClient && noteText.trim()) {
      await clientService.addNote(selectedClient.id, noteText);
      setNoteText('');
      setShowNoteModal(false);
      setSelectedClient(null);
      loadClients();
    }
  };

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.includes(searchQuery) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const vipClients = clients.filter((c) => c.isVip);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display">CRM Clients</h1>
        <button
          onClick={() => {
            setEditingClient(null);
            setFormData({ name: '', phone: '', email: '', isVip: false, notes: '' });
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#D4A24F] text-white rounded-lg hover:bg-[#c49345] transition-colors"
        >
          <Plus size={20} />
          Add Client
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-gray-500 text-sm mb-1">Total Clients</p>
          <p className="text-3xl font-bold">{clients.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-gray-500 text-sm mb-1">VIP Clients</p>
          <p className="text-3xl font-bold text-[#D4A24F]">{vipClients.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-gray-500 text-sm mb-1">New This Month</p>
          <p className="text-3xl font-bold text-green-600">
            {clients.filter((c) => {
              const created = c.created_at ? new Date(c.created_at) : null;
              const now = new Date();
              return created && created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
            }).length}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search clients by name, phone, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#D4A24F] focus:border-transparent"
          />
        </div>
      </div>

      {/* Clients List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-500">Client</th>
                <th className="text-left py-4 px-6 font-medium text-gray-500">Contact</th>
                <th className="text-left py-4 px-6 font-medium text-gray-500">Visits</th>
                <th className="text-left py-4 px-6 font-medium text-gray-500">Last Visit</th>
                <th className="text-left py-4 px-6 font-medium text-gray-500">VIP</th>
                <th className="text-left py-4 px-6 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} className="border-t hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#D4A24F]/20 flex items-center justify-center">
                        <span className="text-[#D4A24F] font-medium">
                          {client.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{client.name}</p>
                        {client.notes && (
                          <p className="text-xs text-gray-500 truncate max-w-[200px]">
                            {client.notes.split('\n')[0]}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone size={14} className="text-gray-400" />
                        {client.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail size={14} className="text-gray-400" />
                        {client.email}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      <Calendar size={14} />
                      {client.appointmentsCount}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {client.lastVisit
                      ? new Date(client.lastVisit).toLocaleDateString()
                      : 'Never'}
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleToggleVip(client)}
                      className={`p-2 rounded-lg transition-colors ${
                        client.isVip
                          ? 'bg-[#D4A24F] text-white'
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                    >
                      <Star size={18} className={client.isVip ? 'fill-current' : ''} />
                    </button>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedClient(client);
                          setShowNoteModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Add Note"
                      >
                        <MessageSquare size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingClient(client);
                          setFormData({
                            name: client.name,
                            phone: client.phone,
                            email: client.email,
                            isVip: client.isVip,
                            notes: client.notes || '',
                          });
                          setShowModal(true);
                        }}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingClient ? 'Edit Client' : 'Add New Client'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D4A24F]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D4A24F]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D4A24F]"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isVip"
                  checked={formData.isVip}
                  onChange={(e) => setFormData({ ...formData, isVip: e.target.checked })}
                  className="w-4 h-4 text-[#D4A24F] rounded"
                />
                <label htmlFor="isVip" className="text-sm font-medium text-gray-700">
                  VIP Client
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#D4A24F] text-white rounded-lg hover:bg-[#c49345]"
                >
                  {editingClient ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Note Modal */}
      {showNoteModal && selectedClient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Add Note for {selectedClient.name}</h2>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Enter your note..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D4A24F] min-h-[100px]"
            />
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowNoteModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNote}
                className="flex-1 px-4 py-2 bg-[#D4A24F] text-white rounded-lg hover:bg-[#c49345]"
              >
                Add Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};