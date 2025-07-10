const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://10.100.102.15:3001/api';

export interface GalleryImage {
  filename: string;
  url: string; // This will be base64 data
}
console.log(API_BASE_URL);
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: 'Network error occurred',
      };
    }
  }

  // Gallery API methods
  async getGalleryImages(): Promise<GalleryImage[]> {
    const response = await this.request<GalleryImage[]>('/gallery');
    return response.success ? response.data || [] : [];
  }

  async uploadImage(file: File): Promise<GalleryImage | null> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${this.baseUrl}/gallery`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Upload failed:', error);
      return null;
    }
  }

  async uploadMultipleImages(files: File[]): Promise<GalleryImage[]> {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      const response = await fetch(`${this.baseUrl}/gallery/multiple`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      return data.success ? data.data || [] : [];
    } catch (error) {
      console.error('Multiple upload failed:', error);
      return [];
    }
  }

  async deleteImage(filename: string): Promise<boolean> {
    const response = await this.request(`/gallery/${filename}`, {
      method: 'DELETE',
    });
    return response.success;
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    const response = await this.request('/health');
    return response.success;
  }

  // Location API methods
  async getLocation(person: 'ori' | 'shaked'): Promise<any> {
    const response = await this.request(`/location/${person}`);
    return response.success ? response.data : null;
  }

  async updateLocation(
    person: 'ori' | 'shaked',
    location: string,
    description: string,
    photo?: File,
    coordinates?: { lat: number; lng: number }
  ): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('location', location);
      formData.append('description', description);
      
      if (photo) {
        formData.append('photo', photo);
      }
      
      if (coordinates) {
        formData.append('lat', coordinates.lat.toString());
        formData.append('lng', coordinates.lng.toString());
      }

      const response = await fetch(`${this.baseUrl}/location/${person}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Location update failed:', error);
      return null;
    }
  }
}

export const apiService = new ApiService(); 