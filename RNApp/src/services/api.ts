import axios from 'axios';

// Base URL for the JSONPlaceholder API
const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

// Create an axios instance with default configurations
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Types for the data models
export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface Album {
  userId: number;
  id: number;
  title: string;
}

export interface Photo {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

// API Error type
export interface ApiError {
  message: string;
  status?: number;
}

// API Service class
class ApiService {
  // Posts endpoints
  async getPosts(): Promise<Post[]> {
    try {
      const response = await apiClient.get<Post[]>('/posts');
      return response.data;
    } catch (error) {
      this.handleError(error, 'Error fetching posts');
      return [];
    }
  }

  async getPost(postId: number): Promise<Post | null> {
    try {
      const response = await apiClient.get<Post>(`/posts/${postId}`);
      return response.data;
    } catch (error) {
      this.handleError(error, `Error fetching post with ID ${postId}`);
      return null;
    }
  }

  async getPostsByUser(userId: number): Promise<Post[]> {
    try {
      const response = await apiClient.get<Post[]>(`/posts?userId=${userId}`);
      return response.data;
    } catch (error) {
      this.handleError(error, `Error fetching posts by user with ID ${userId}`);
      return [];
    }
  }

  // Comments endpoints
  async getComments(): Promise<Comment[]> {
    try {
      const response = await apiClient.get<Comment[]>('/comments');
      return response.data;
    } catch (error) {
      this.handleError(error, 'Error fetching comments');
      return [];
    }
  }

  async getCommentsForPost(postId: number): Promise<Comment[]> {
    try {
      const response = await apiClient.get<Comment[]>(`/posts/${postId}/comments`);
      return response.data;
    } catch (error) {
      this.handleError(error, `Error fetching comments for post with ID ${postId}`);
      return [];
    }
  }

  // Users endpoints
  async getUsers(): Promise<User[]> {
    try {
      const response = await apiClient.get<User[]>('/users');
      return response.data;
    } catch (error) {
      this.handleError(error, 'Error fetching users');
      return [];
    }
  }

  async getUser(userId: number): Promise<User | null> {
    try {
      const response = await apiClient.get<User>(`/users/${userId}`);
      return response.data;
    } catch (error) {
      this.handleError(error, `Error fetching user with ID ${userId}`);
      return null;
    }
  }

  // Albums endpoints
  async getAlbums(): Promise<Album[]> {
    try {
      const response = await apiClient.get<Album[]>('/albums');
      return response.data;
    } catch (error) {
      this.handleError(error, 'Error fetching albums');
      return [];
    }
  }

  async getAlbumsByUser(userId: number): Promise<Album[]> {
    try {
      const response = await apiClient.get<Album[]>(`/albums?userId=${userId}`);
      return response.data;
    } catch (error) {
      this.handleError(error, `Error fetching albums by user with ID ${userId}`);
      return [];
    }
  }

  // Photos endpoints
  async getPhotos(): Promise<Photo[]> {
    try {
      const response = await apiClient.get<Photo[]>('/photos');
      return response.data;
    } catch (error) {
      this.handleError(error, 'Error fetching photos');
      return [];
    }
  }

  async getPhotosByAlbum(albumId: number): Promise<Photo[]> {
    try {
      const response = await apiClient.get<Photo[]>(`/photos?albumId=${albumId}`);
      return response.data;
    } catch (error) {
      this.handleError(error, `Error fetching photos by album with ID ${albumId}`);
      return [];
    }
  }

  // Todos endpoints
  async getTodos(): Promise<Todo[]> {
    try {
      const response = await apiClient.get<Todo[]>('/todos');
      return response.data;
    } catch (error) {
      this.handleError(error, 'Error fetching todos');
      return [];
    }
  }

  async getTodosByUser(userId: number): Promise<Todo[]> {
    try {
      const response = await apiClient.get<Todo[]>(`/todos?userId=${userId}`);
      return response.data;
    } catch (error) {
      this.handleError(error, `Error fetching todos by user with ID ${userId}`);
      return [];
    }
  }

  // Helper method to handle errors
  private handleError(error: unknown, defaultMessage: string): never {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || defaultMessage;
      const status = error.response?.status;
      console.error(`[API Error] ${status ? `${status}: ` : ''}${message}`);
      throw { message, status } as ApiError;
    }
    console.error(`[API Error] ${defaultMessage}:`, error);
    throw { message: defaultMessage } as ApiError;
  }
}

// Create and export a singleton instance of the ApiService
export const apiService = new ApiService();

// Export individual API methods for convenience
export const {
  getPosts,
  getPost,
  getPostsByUser,
  getComments,
  getCommentsForPost,
  getUsers,
  getUser,
  getAlbums,
  getAlbumsByUser,
  getPhotos,
  getPhotosByAlbum,
  getTodos,
  getTodosByUser,
} = apiService;

// Default export for the ApiService
export default apiService;

// Add searchPosts utility function
export const searchPosts = async (query: string): Promise<Post[]> => {
  try {
    const allPosts = await apiService.getPosts();
    return allPosts.filter(
      post =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.body.toLowerCase().includes(query.toLowerCase()),
    );
  } catch (error) {
    console.error('Error searching posts:', error);
    throw { message: 'Error searching posts' } as ApiError;
  }
};
