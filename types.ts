// Base Cosmic object interface
export interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
}

// Search result status type
export type SearchStatus = 'found' | 'not_found' | 'error';

// Search result object from Cosmic
export interface SearchResult extends CosmicObject {
  type: 'search-results';
  metadata: {
    uploaded_image?: {
      url: string;
      imgix_url: string;
    };
    found_username?: string;
    profile_url?: string;
    search_status: {
      key: SearchStatus;
      value: string;
    };
    search_date?: string;
  };
}

// API response types
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
}

export interface CosmicSingleResponse<T> {
  object: T;
}

// Form data for creating search results
export interface SearchFormData {
  image: File;
}

// Upload response
export interface UploadResponse {
  success: boolean;
  username?: string;
  profileUrl?: string;
  status: SearchStatus;
  message?: string;
}