import { useEffect, useState } from 'react';
import { Star, Check, X, Search } from 'lucide-react';
import { reviewService } from '@/services/reviewService';
import type { Review } from '@/types';

export const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for demo
  const mockReviews: Review[] = [
    {
      id: '1',
      name: 'Olena Kovalenko',
      author_name: 'Olena Kovalenko',
      rating: 5,
      text: 'Amazing service! The staff was very professional and friendly.',
      text_en: 'Amazing service! The staff was very professional and friendly.',
      date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      is_approved: true,
      isApproved: true,
    },
    {
      id: '2',
      name: 'Maria Petrenko',
      author_name: 'Maria Petrenko',
      rating: 4,
      text: 'Great experience overall. Will definitely come back.',
      text_en: 'Great experience overall. Will definitely come back.',
      date: new Date(Date.now() - 86400000).toISOString(),
      created_at: new Date(Date.now() - 86400000).toISOString(),
      is_approved: false,
      isApproved: false,
    },
    {
      id: '3',
      name: 'Anna Shevchenko',
      author_name: 'Anna Shevchenko',
      rating: 5,
      text: 'Best aesthetic clinic in Kyiv! Highly recommend.',
      text_en: 'Best aesthetic clinic in Kyiv! Highly recommend.',
      date: new Date(Date.now() - 172800000).toISOString(),
      created_at: new Date(Date.now() - 172800000).toISOString(),
      is_approved: true,
      isApproved: true,
    },
  ];

  useEffect(() => {
    setReviews(mockReviews);
  }, []);

  const handleApprove = async (id: string) => {
    await reviewService.approve(id);
    setReviews(reviews.map(r => r.id === id ? { ...r, is_approved: true, isApproved: true } : r));
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this review?')) {
      await reviewService.delete(id);
      setReviews(reviews.filter(r => r.id !== id));
    }
  };

  const filteredReviews = reviews.filter((review) => {
    const isApproved = review.is_approved || review.isApproved;
    const matchesTab =
      activeTab === 'all' ? true : activeTab === 'pending' ? !isApproved : isApproved;
    const authorName = review.author_name || review.name;
    const matchesSearch = authorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const approvedReviews = reviews.filter(r => r.is_approved || r.isApproved);
  const averageRating = approvedReviews.length > 0
    ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length
    : 0;

  return (
    <div>
      <h1 className="text-3xl font-display mb-8">Reviews</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-gray-500 text-sm mb-1">Total Reviews</p>
          <p className="text-3xl font-bold">{reviews.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-gray-500 text-sm mb-1">Pending Approval</p>
          <p className="text-3xl font-bold text-yellow-600">
            {reviews.filter((r) => !(r.is_approved || r.isApproved)).length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-gray-500 text-sm mb-1">Approved</p>
          <p className="text-3xl font-bold text-green-600">
            {approvedReviews.length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-gray-500 text-sm mb-1">Average Rating</p>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold text-[#D4A24F]">{averageRating.toFixed(1)}</p>
            <Star size={24} className="text-[#D4A24F] fill-[#D4A24F]" />
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-2">
            {(['all', 'pending', 'approved'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'bg-[#D4A24F] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab}
                {tab === 'pending' && reviews.filter((r) => !(r.is_approved || r.isApproved)).length > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                    {reviews.filter((r) => !(r.is_approved || r.isApproved)).length}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D4A24F]"
            />
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => {
          const isApproved = review.is_approved || review.isApproved;
          const authorName = review.author_name || review.name;
          const reviewText = review.text_en || review.text;
          const createdAt = review.created_at || review.date;
          return (
            <div
              key={review.id}
              className={`bg-white rounded-xl shadow-sm p-6 ${
                !isApproved ? 'border-2 border-yellow-200' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#D4A24F]/20 flex items-center justify-center">
                    <span className="text-[#D4A24F] font-medium text-lg">
                      {authorName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{authorName}</h3>
                      {!isApproved && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                          Pending
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          className={
                            star <= review.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 mt-2">{reviewText}</p>
                    <p className="text-sm text-gray-400 mt-2">
                      {createdAt ? new Date(createdAt).toLocaleDateString() : ''}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!isApproved && (
                    <button
                      onClick={() => handleApprove(review.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                      title="Approve"
                    >
                      <Check size={20} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};