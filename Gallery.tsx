import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { galleryService } from '@/services/galleryService';
import type { GalleryItem } from '@/types';

export const Gallery = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [formData, setFormData] = useState({
    beforeImage: '',
    afterImage: '',
    title: '',
    description: '',
    category: '',
  });

  // Mock data for demo
  const [items, setItems] = useState<GalleryItem[]>([
    {
      id: '1',
      beforeImage: '/images/hero_portrait.jpg',
      afterImage: '/images/results_portrait.jpg',
      title: 'Facial Rejuvenation',
      description: 'Results after 3 sessions',
      category: 'Facial',
    },
    {
      id: '2',
      beforeImage: '/images/about_portrait.jpg',
      afterImage: '/images/services_portrait.jpg',
      title: 'Skin Treatment',
      description: 'Acne treatment results',
      category: 'Skin',
    },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await galleryService.create(formData);
    setShowModal(false);
    setFormData({
      beforeImage: '',
      afterImage: '',
      title: '',
      description: '',
      category: '',
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      await galleryService.delete(id);
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const categories = ['all', ...new Set(items.map((item) => item.category))];

  const filteredItems =
    selectedCategory === 'all' ? items : items.filter((item) => item.category === selectedCategory);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display">Gallery</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#D4A24F] text-white rounded-lg hover:bg-[#c49345] transition-colors"
        >
          <Plus size={20} />
          Add Before/After
        </button>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
              selectedCategory === cat
                ? 'bg-[#D4A24F] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-2 gap-1">
              <div className="relative">
                <img
                  src={item.beforeImage}
                  alt="Before"
                  className="w-full h-48 object-cover"
                />
                <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded">
                  Before
                </span>
              </div>
              <div className="relative">
                <img
                  src={item.afterImage}
                  alt="After"
                  className="w-full h-48 object-cover"
                />
                <span className="absolute bottom-2 left-2 px-2 py-1 bg-[#D4A24F]/80 text-white text-xs rounded">
                  After
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-1">{item.title}</h3>
              <p className="text-sm text-gray-500 mb-3">{item.description}</p>
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                  {item.category}
                </span>
                <button
                  onClick={() => handleDelete(item.id)}
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-auto">
            <h2 className="text-xl font-semibold mb-4">Add Before/After</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Before Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.beforeImage}
                    onChange={(e) => setFormData({ ...formData, beforeImage: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D4A24F]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    After Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.afterImage}
                    onChange={(e) => setFormData({ ...formData, afterImage: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D4A24F]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D4A24F]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D4A24F]"
                  rows={2}
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
                  placeholder="e.g. Facial, Skin, Laser"
                  required
                />
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
                  Add to Gallery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};