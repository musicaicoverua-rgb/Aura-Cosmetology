// ============================================================================
// DYNAMIC CONTENT CONTEXT
// ============================================================================
// Fetches and manages all dynamic content from Supabase database
// Provides global access to settings and site content across the application
// Implements pessimistic UI updates with strict error handling
// ============================================================================

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { toast } from 'sonner';
import type { Settings, SiteContent } from '@/lib/supabase';
import {
  fetchSettings,
  fetchSiteContent,
  updateSettings as supabaseUpdateSettings,
  updateSiteContent as supabaseUpdateSiteContent,
} from '@/lib/supabase';

// =============================================================================
// TYPES
// =============================================================================

export interface ContentState {
  settings: Settings | null;
  siteContent: SiteContent[];
  contentMap: Map<string, SiteContent>;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  lastFetched: Date | null;
}

export interface ContentContextType extends ContentState {
  // Getters
  getContentByKey: (sectionKey: string) => SiteContent | undefined;
  getHeroContent: () => SiteContent | undefined;
  getAboutContent: () => SiteContent | undefined;
  getServicesContent: () => SiteContent | undefined;
  getContactContent: () => SiteContent | undefined;
  getTestimonialsContent: () => SiteContent | undefined;

  // Setters (Admin only)
  updateSettings: (
    updates: Partial<Omit<Settings, 'id' | 'created_at'>>
  ) => Promise<void>;
  updateContent: (
    sectionKey: string,
    updates: Partial<Omit<SiteContent, 'id' | 'section_key' | 'created_at'>>
  ) => Promise<void>;
  refreshContent: () => Promise<void>;

  // Utility
  clearError: () => void;
}

// =============================================================================
// CONTEXT CREATION
// =============================================================================

const ContentContext = createContext<ContentContextType | undefined>(undefined);

// =============================================================================
// PROVIDER COMPONENT
// =============================================================================

interface ContentProviderProps {
  children: ReactNode;
}

export const ContentProvider: React.FC<ContentProviderProps> = ({
  children,
}) => {
  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------
  const [settings, setSettings] = useState<Settings | null>(null);
  const [siteContent, setSiteContent] = useState<SiteContent[]>([]);
  const [contentMap, setContentMap] = useState<Map<string, SiteContent>>(
    new Map()
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  // ---------------------------------------------------------------------------
  // INITIAL DATA FETCH
  // ---------------------------------------------------------------------------
  const fetchAllContent = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch settings and site content in parallel
      const [settingsData, siteContentData] = await Promise.all([
        fetchSettings(),
        fetchSiteContent(),
      ]);

      // Update settings state
      setSettings(settingsData);

      // Update site content state
      setSiteContent(siteContentData);

      // Build content map for O(1) access
      const newContentMap = new Map<string, SiteContent>();
      siteContentData.forEach((content) => {
        newContentMap.set(content.section_key, content);
      });
      setContentMap(newContentMap);

      // Update last fetched timestamp
      setLastFetched(new Date());

      console.log('Content fetched successfully:', {
        settings: !!settingsData,
        sections: siteContentData.length,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch content';
      console.error('Error fetching content:', err);
      setError(errorMessage);
      toast.error('Failed to load content', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchAllContent();
  }, [fetchAllContent]);

  // ---------------------------------------------------------------------------
  // GETTER METHODS
  // ---------------------------------------------------------------------------

  /**
   * Get content by section key (O(1) lookup)
   */
  const getContentByKey = useCallback(
    (sectionKey: string): SiteContent | undefined => {
      return contentMap.get(sectionKey);
    },
    [contentMap]
  );

  /**
   * Get hero section content
   */
  const getHeroContent = useCallback((): SiteContent | undefined => {
    return contentMap.get('hero');
  }, [contentMap]);

  /**
   * Get about section content
   */
  const getAboutContent = useCallback((): SiteContent | undefined => {
    return contentMap.get('about');
  }, [contentMap]);

  /**
   * Get services section content
   */
  const getServicesContent = useCallback((): SiteContent | undefined => {
    return contentMap.get('services');
  }, [contentMap]);

  /**
   * Get contact section content
   */
  const getContactContent = useCallback((): SiteContent | undefined => {
    return contentMap.get('contact');
  }, [contentMap]);

  /**
   * Get testimonials section content
   */
  const getTestimonialsContent = useCallback((): SiteContent | undefined => {
    return contentMap.get('testimonials');
  }, [contentMap]);

  // ---------------------------------------------------------------------------
  // SETTER METHODS (PESSIMISTIC UI UPDATES)
  // ---------------------------------------------------------------------------

  /**
   * Update settings in database
   * PESSIMISTIC: Waits for DB confirmation before updating UI
   * Throws error immediately if DB fails
   */
  const updateSettings = useCallback(
    async (updates: Partial<Omit<Settings, 'id' | 'created_at'>>) => {
      // Prevent multiple simultaneous saves
      if (isSaving) {
        toast.info('Please wait, previous save in progress...');
        return;
      }

      try {
        setIsSaving(true);
        setError(null);

        // Show loading toast
        const loadingToast = toast.loading('Saving settings...');

        // Attempt database update
        const updatedSettings = await supabaseUpdateSettings(updates);

        // ONLY update UI after successful DB transaction
        setSettings(updatedSettings);

        // Dismiss loading toast and show success
        toast.dismiss(loadingToast);
        toast.success('Settings saved successfully!', {
          description: 'Your changes have been saved to the database.',
        });

        console.log('Settings updated:', updatedSettings);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update settings';

        console.error('Error updating settings:', err);
        setError(errorMessage);

        // Show error toast immediately
        toast.error('Failed to save settings', {
          description: errorMessage,
        });

        // RE-THROW ERROR for component-level handling
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [isSaving]
  );

  /**
   * Update site content in database
   * PESSIMISTIC: Waits for DB confirmation before updating UI
   * Throws error immediately if DB fails
   */
  const updateContent = useCallback(
    async (
      sectionKey: string,
      updates: Partial<
        Omit<SiteContent, 'id' | 'section_key' | 'created_at'>
      >
    ) => {
      // Prevent multiple simultaneous saves
      if (isSaving) {
        toast.info('Please wait, previous save in progress...');
        return;
      }

      try {
        setIsSaving(true);
        setError(null);

        // Show loading toast
        const loadingToast = toast.loading(`Saving ${sectionKey}...`);

        // Attempt database update
        const updatedContent = await supabaseUpdateSiteContent(
          sectionKey,
          updates
        );

        // ONLY update UI after successful DB transaction
        setSiteContent((prev) =>
          prev.map((content) =>
            content.section_key === sectionKey ? updatedContent : content
          )
        );

        setContentMap((prev) => {
          const newMap = new Map(prev);
          newMap.set(sectionKey, updatedContent);
          return newMap;
        });

        // Dismiss loading toast and show success
        toast.dismiss(loadingToast);
        toast.success('Content saved successfully!', {
          description: `${sectionKey} section has been updated.`,
        });

        console.log(`Content [${sectionKey}] updated:`, updatedContent);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : `Failed to update ${sectionKey}`;

        console.error(`Error updating content [${sectionKey}]:`, err);
        setError(errorMessage);

        // Show error toast immediately
        toast.error('Failed to save content', {
          description: errorMessage,
        });

        // RE-THROW ERROR for component-level handling
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [isSaving]
  );

  // ---------------------------------------------------------------------------
  // UTILITY METHODS
  // ---------------------------------------------------------------------------

  /**
   * Manually refresh all content from database
   */
  const refreshContent = useCallback(async () => {
    toast.info('Refreshing content...');
    await fetchAllContent();
    toast.success('Content refreshed!');
  }, [fetchAllContent]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ---------------------------------------------------------------------------
  // CONTEXT VALUE
  // ---------------------------------------------------------------------------
  const contextValue: ContentContextType = {
    // State
    settings,
    siteContent,
    contentMap,
    isLoading,
    isSaving,
    error,
    lastFetched,

    // Getters
    getContentByKey,
    getHeroContent,
    getAboutContent,
    getServicesContent,
    getContactContent,
    getTestimonialsContent,

    // Setters
    updateSettings,
    updateContent,
    refreshContent,

    // Utility
    clearError,
  };

  return (
    <ContentContext.Provider value={contextValue}>
      {children}
    </ContentContext.Provider>
  );
};

// =============================================================================
// CUSTOM HOOK
// =============================================================================

/**
 * useContent hook - Access dynamic content anywhere in the app
 * Must be used within ContentProvider
 */
export const useContent = (): ContentContextType => {
  const context = useContext(ContentContext);

  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }

  return context;
};

/**
 * useContentByKey hook - Get specific section content
 */
export const useContentByKey = (sectionKey: string): SiteContent | undefined => {
  const { getContentByKey } = useContent();
  return getContentByKey(sectionKey);
};

export default ContentContext;
