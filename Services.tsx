import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import { serviceService } from '@/services/serviceService';
import type { Service } from '@/types';

export const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [formData, setFormData] = useState({
    name_uk: '',
    name_en: '',
    name_ru: '',
    description_uk: '',
    description_en: '',
    duration: '',
    price: '',
    category: '',
    is_active: true,
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    const { data } = await serviceService.getAllAdmin();
    setServices(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const serviceData = {
      ...formData,
      name: formData.name_en,
      description: formData.description_en,
    };
    if (editingService) {
      await serviceService.update(editingService.id, serviceData);
    } else {
      await serviceService.create(serviceData as any);
    }
    setShowModal(false);
    setEditingService(null);
    resetForm();
    loadServices();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      await serviceService.delete(id);
      loadServices();
    }
  };

  const handleToggleActive = async (service: Service) => {
    await serviceService.toggleActive(service.id, !service.is_active);
    loadServices();
  };

  const resetForm = () => {
    setFormData({
      name_uk: '',
      name_en: '',
      name_ru: '',
      description_uk: '',
      description_en: '',
      duration: '',
      price: '',
      category: '',
      is_active: true,
    });
  };

  const categories = [...new Set(services.map((s) => s.category).filter(Boolean))];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display">Services</h1>
        <button
          onClick={() => {
            setEditingService(null);
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#D4A24F] text-white rounded-lg hover:bg-[#c49345] transition-colors"
        >
          <Plus size={20} />
          Add Service
        </button>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button className="px-4 py-2 bg-[#D4A24F] text-white rounded-full text-sm">
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className={`bg-white rounded-xl shadow-sm overflow-hidden ${
              !service.is_active ? 'opacity-60' : ''
            }`}
          >
            <div className="h-40 bg-gray-100 flex items-center justify-center">
              {service.image ? (
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon size={48} className="text-gray-300" />
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold">{service.name}</h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    service.is_active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {service.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                {service.description}
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#D4A24F] font-semibold">{service.price}</span>
                <span className="text-gray-500">{service.duration}</span>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleToggleActive(service)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    service.is_active
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {service.is_active ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => {
                    setEditingService(service);
                    setFormData({
                      name_uk: service.name_uk || service.name,
                      name_en: service.name_en || service.name,
                      name_ru: service.name_ru || '',
                      description_uk: service.description_uk || service.description,
                      description_en: service.description_en || service.description,
                      duration: service.duration,
                      price: service.price,
                      category: service.category || '',
                      is_active: service.is_active ?? true,
                    });
                    setShowModal(true);
                  }}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-auto">
            <h2 className="text-xl font-semibold mb-4">
              {editingService ? 'Edit Service' : 'Add New Service'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name (EN)</label>
                  <input
                    type="text"
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D4A24F]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name (UK)</label>
                  <input
                    type="text"
                    value={formData.name_uk}
                    onChange={(e) => setFormData({ ...formData, name_uk: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D4A24F]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (EN)</label>
                <textarea
                  value={formData.description_en}
                  onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D4A24F]"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D4A24F]"
                    placeholder="e.g. $100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D4A24F]"
                    placeholder="e.g. 60 min"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D4A24F]"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-[#D4A24F] rounded"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  Active
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
                  {editingService ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};