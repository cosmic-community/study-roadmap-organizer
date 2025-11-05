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

// Category interface
export interface Category extends CosmicObject {
  type: 'categories';
  metadata: {
    category_name: string;
    description?: string;
  };
}

// Document interface with comprehensive metadata
export interface Document extends CosmicObject {
  type: 'documents';
  metadata: {
    document_title: string;
    original_file: {
      url: string;
      imgix_url: string;
    };
    ai_summary?: string;
    key_insights?: string;
    category?: Category;
    processing_status?: {
      key: string;
      value: string;
    };
    upload_date?: string;
    document_type?: {
      key: string;
      value: string;
    };
    tags?: string;
  };
}

// API response types
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
}

// Type literals for select-dropdown values
export type ProcessingStatus = 'Pending' | 'Processing' | 'Completed';
export type DocumentType = 'PDF Document' | 'Written Notes' | 'Report' | 'Article' | 'Other';

// Type guards
export function isDocument(obj: CosmicObject): obj is Document {
  return obj.type === 'documents';
}

export function isCategory(obj: CosmicObject): obj is Category {
  return obj.type === 'categories';
}