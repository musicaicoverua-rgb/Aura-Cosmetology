// ============================================================================
// MAIN APPLICATION - AURA COSMETOLOGY
// ============================================================================

import React from 'react';
import {
BrowserRouter as Router,
Routes,
Route,
Navigate,
Outlet,
Link,
useLocation
} from 'react-router-dom';
import { Toaster } from 'sonner';
import supabase from '@/lib/supabase'; // <-- ДОДАНО: Підключення бази даних

// Contexts
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
@@ -122,8 +123,32 @@
);
};

// 3. Сторінка Галереї (Нова)
// 3. Сторінка Галереї (Розумна сторінка з базою даних)
const GalleryPage: React.FC = () => {
  const [images, setImages] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      // Дістаємо всі фото з таблиці gallery
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

return (
<PageTransition>
<section className="min-h-screen bg-slate-950 flex flex-col items-center py-32">
@@ -134,9 +159,36 @@
<p className="text-slate-400 mb-12">
Результати нашої роботи до та після
</p>
          <div className="p-8 border border-slate-800 rounded-2xl bg-slate-900/50">
             <p className="text-slate-500">Тут буде сітка фотографій з бази даних</p>
          </div>

          {loading ? (
            // Анімація завантаження
            <div className="flex justify-center">
              <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : images.length === 0 ? (
            // Якщо фотографій ще немає
            <div className="p-12 border border-slate-800 rounded-2xl bg-slate-900/50">
               <p className="text-slate-500 text-lg">Галерея поки що порожня. Скоро тут з'являться наші роботи!</p>
            </div>
          ) : (
            // Сітка з фотографіями
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {images.map((img) => (
                <div key={img.id} className="relative group overflow-hidden rounded-2xl aspect-square bg-slate-800">
                  <img
                    src={img.image_url}
                    alt={img.title || 'Робота Aura Cosmetology'}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <span className="text-white font-medium text-lg border-b border-purple-500 pb-1">
                      {img.title || 'До та Після'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
</div>
</section>
</PageTransition>
