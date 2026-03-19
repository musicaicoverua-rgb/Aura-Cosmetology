// ============================================================================
// SUPABASE CLIENT CONFIGURATION
// ============================================================================
// Centralized Supabase client instance for the entire application
// Uses singleton pattern to ensure single connection across app
// ============================================================================

import { createClient } from '@supabase/supabase-js';

// =============================================================================
// CREDENTIALS (HARDCODED AS PER REQUIREMENTS)
// =============================================================================
const SUPABASE_URL = 'https://rttcgqcbxwskhxkngjyn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0dGNncWNieHdza2h4a25nanluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MTc0MzQsImV4cCI6MjA4OTQ5MzQzNH0.-2uc0LjMprltixuFlrjbZIPnG_WqJyiwYndnQJ-722g';

// =============================================================================
// DATABASE TYPES
// =============================================================================
export interface Settings {
  id: number;
  clinic_name: string;
  phone: string;
  email: string;
  instagram: string;
  address: string;
  working_hours: string;
  logo_url: string | null;
  favicon_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface SiteContent {
  id: string;
  section_key: string;
  title: string;
  subtitle: string;
  description: string;
  extra_data: Record<string, unknown>;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// =============================================================================
// SINGLETON CLIENT INSTANCE
// =============================================================================
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public',
  },
});

// =============================================================================
// AUTHENTICATION HELPERS
// =============================================================================

/**
 * Sign in with email and password
 * Returns user data on success, throws error on failure
 */
export const signInWithPassword = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * Sign out the current user
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
};

/**
 * Get current session
 */
export const getCurrentSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw new Error(error.message);
  }
  return data.session;
};

/**
 * Get current user
 */
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw new Error(error.message);
  }
  return data.user;
};

/**
 * Subscribe to auth state changes
 */
export const onAuthStateChange = (
  callback: (event: string, session: unknown) => void
) => {
  return supabase.auth.onAuthStateChange(callback);
};

// =============================================================================
// DATABASE HELPERS
// =============================================================================

/**
 * Fetch all settings (singleton row)
 */
export const fetchSettings = async (): Promise<Settings | null> => {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 1)
    .single();

  if (error) {
    console.error('Error fetching settings:', error);
    throw new Error(`Failed to fetch settings: ${error.message}`);
  }

  return data as Settings | null;
};

/**
 * Update settings (admin only)
 */
export const updateSettings = async (
  updates: Partial<Omit<Settings, 'id' | 'created_at'>>
): Promise<Settings> => {
  const { data, error } = await supabase
    .from('settings')
    .update(updates)
    .eq('id', 1)
    .select()
    .single();

  if (error) {
    console.error('Error updating settings:', error);
    throw new Error(`Failed to update settings: ${error.message}`);
  }

  if (!data) {
    throw new Error('No data returned from settings update');
  }

  return data as Settings;
};

/**
 * Fetch all site content sections
 */
export const fetchSiteContent = async (): Promise<SiteContent[]> => {
  const { data, error } = await supabase
    .from('site_content')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching site content:', error);
    throw new Error(`Failed to fetch site content: ${error.message}`);
  }

  return (data as SiteContent[]) || [];
};

/**
 * Fetch single site content section by key
 */
export const fetchSiteContentByKey = async (
  sectionKey: string
): Promise<SiteContent | null> => {
  const { data, error } = await supabase
    .from('site_content')
    .select('*')
    .eq('section_key', sectionKey)
    .single();

  if (error) {
    console.error(`Error fetching site content for ${sectionKey}:`, error);
    throw new Error(
      `Failed to fetch site content for ${sectionKey}: ${error.message}`
    );
  }

  return data as SiteContent | null;
};

/**
 * Update site content section (admin only)
 */
export const updateSiteContent = async (
  sectionKey: string,
  updates: Partial<Omit<SiteContent, 'id' | 'section_key' | 'created_at'>>
): Promise<SiteContent> => {
  const { data, error } = await supabase
    .from('site_content')
    .update(updates)
    .eq('section_key', sectionKey)
    .select()
    .single();

  if (error) {
    console.error(`Error updating site content for ${sectionKey}:`, error);
    throw new Error(
      `Failed to update site content for ${sectionKey}: ${error.message}`
    );
  }

  if (!data) {
    throw new Error('No data returned from site content update');
  }

  return data as SiteContent;
};

/**
 * Create new site content section (admin only)
 */
export const createSiteContent = async (
  content: Omit<SiteContent, 'id' | 'created_at' | 'updated_at'>
): Promise<SiteContent> => {
  const { data, error } = await supabase
    .from('site_content')
    .insert(content)
    .select()
    .single();

  if (error) {
    console.error('Error creating site content:', error);
    throw new Error(`Failed to create site content: ${error.message}`);
  }

  if (!data) {
    throw new Error('No data returned from site content creation');
  }

  return data as SiteContent;
};

/**
 * Delete site content section (admin only)
 */
export const deleteSiteContent = async (sectionKey: string): Promise<void> => {
  const { error } = await supabase
    .from('site_content')
    .delete()
    .eq('section_key', sectionKey);

  if (error) {
    console.error(`Error deleting site content for ${sectionKey}:`, error);
    throw new Error(
      `Failed to delete site content for ${sectionKey}: ${error.message}`
    );
  }
};
/**
 * Upload an image to Supabase Storage
 */
export const uploadImage = async (file: File): Promise<string> => {
  // Генеруємо унікальне ім'я файлу, щоб вони не перезаписували один одного
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  // Завантажуємо файл у кошик "images"
  const { error: uploadError } = await supabase.storage
    .from('images')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    throw new Error(`Failed to upload image: ${uploadError.message}`);
  }

  // Отримуємо публічне посилання на файл, щоб показати його на сайті
  const { data } = supabase.storage
    .from('images')
    .getPublicUrl(filePath);

  return data.publicUrl;
};
export default supabase;
