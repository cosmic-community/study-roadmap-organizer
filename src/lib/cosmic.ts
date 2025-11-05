import { createBucketClient } from '@cosmicjs/sdk'

export const cosmic = createBucketClient({
  bucketSlug: import.meta.env.VITE_COSMIC_BUCKET_SLUG as string,
  readKey: import.meta.env.VITE_COSMIC_READ_KEY as string,
  writeKey: import.meta.env.VITE_COSMIC_WRITE_KEY as string
})

// Simple error helper for Cosmic SDK
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// Fetch all documents with categories
export async function getDocuments() {
  try {
    const response = await cosmic.objects
      .find({ type: 'documents' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.objects;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch documents');
  }
}

// Fetch single document by slug
export async function getDocument(slug: string) {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'documents', slug })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.object;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch document');
  }
}

// Fetch all categories
export async function getCategories() {
  try {
    const response = await cosmic.objects
      .find({ type: 'categories' })
      .props(['id', 'title', 'slug', 'metadata'])
    
    return response.objects;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch categories');
  }
}

// Fetch documents by category
export async function getDocumentsByCategory(categoryId: string) {
  try {
    const response = await cosmic.objects
      .find({
        type: 'documents',
        'metadata.category': categoryId
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.objects;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch documents by category');
  }
}