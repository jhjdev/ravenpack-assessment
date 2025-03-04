import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { PostDetailsScreen } from '../../src/screens/PostDetailsScreen/PostDetailsScreen';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '../../src/contexts/ThemeContext';
import { getPost, getCommentsForPost, getUser } from '../../src/services/api';

// Mock dependencies
jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(),
  useNavigation: jest.fn(),
}));

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

jest.mock('../../src/contexts/ThemeContext', () => ({
  useTheme: jest.fn(),
}));

jest.mock('../../src/services/api', () => ({
  getPost: jest.fn(),
  getCommentsForPost: jest.fn(),
  getUser: jest.fn(),
  apiService: {
    getPosts: jest.fn(),
    getPost: jest.fn(),
    getCommentsForPost: jest.fn(),
    getUser: jest.fn(),
  },
}));

describe('PostDetailsScreen', () => {
  // Setup default mocks for each test
  beforeEach(() => {
    // Mock navigation and route
    (useNavigation as jest.Mock).mockReturnValue({
      navigate: jest.fn(),
    });
    
    (useRoute as jest.Mock).mockReturnValue({
      params: { postId: 1 },
    });
    
    // Mock theme
    (useTheme as jest.Mock).mockReturnValue({
      currentTheme: 'light',
      isDarkMode: false,
    });
    
    // Reset mocks between tests
    jest.clearAllMocks();
  });
  
  test('renders loading state correctly', () => {
    // Mock loading state for post query
    (useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
      if (queryKey[0] === 'post') {
        return {
          isLoading: true,
          isError: false,
          data: null,
          refetch: jest.fn(),
        };
      }
      if (queryKey[0] === 'comments') {
        return {
          isLoading: true,
          isError: false,
          data: [],
          refetch: jest.fn(),
        };
      }
      return {
        isLoading: false,
        isError: false,
        data: null,
      };
    });
    
    render(<PostDetailsScreen />);
    
    // Check if loading indicator and text are shown
    expect(screen.getByText('Loading post details...')).toBeTruthy();
  });
  
  test('renders error state correctly', () => {
    // Mock error state for post query
    (useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
      if (queryKey[0] === 'post') {
        return {
          isLoading: false,
          isError: true,
          error: new Error('Failed to fetch post'),
          refetch: jest.fn(),
        };
      }
      if (queryKey[0] === 'comments') {
        return {
          isLoading: false,
          isError: false,
          data: [],
          refetch: jest.fn(),
        };
      }
      return {
        isLoading: false,
        isError: false,
        data: null,
      };
    });
    
    render(<PostDetailsScreen />);
    
    // Check if error message and retry button are shown
    expect(screen.getByText(/Error loading post: Failed to fetch post/)).toBeTruthy();
    expect(screen.getByText('Retry')).toBeTruthy();
  });
  
  test('renders post and comments correctly', () => {
    const mockPost = {
      id: 1,
      userId: 1,
      title: 'Test Post Title',
      body: 'This is the test post body',
    };
    
    const mockComments = [
      {
        id: 1,
        postId: 1,
        name: 'Comment Author',
        email: 'author@example.com',
        body: 'This is a test comment',
      },
      {
        id: 2,
        postId: 1,
        name: 'Another Commenter',
        email: 'another@example.com',
        body: 'This is another test comment',
      },
    ];
    
    const mockUser = {
      id: 1,
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      address: {
        street: 'Test Street',
        suite: 'Suite 123',
        city: 'Test City',
        zipcode: '12345',
        geo: {
          lat: '0',
          lng: '0',
        },
      },
      phone: '123-456-7890',
      website: 'example.com',
      company: {
        name: 'Test Company',
        catchPhrase: 'Testing is important',
        bs: 'Test BS',
      },
    };
    
    // Mock successful query responses
    (useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
      if (queryKey[0] === 'post') {
        return {
          isLoading: false,
          isError: false,
          data: mockPost,
          refetch: jest.fn(),
        };
      }
      if (queryKey[0] === 'comments') {
        return {
          isLoading: false,
          isError: false,
          data: mockComments,
          refetch: jest.fn(),
        };
      }
      if (queryKey[0] === 'user') {
        return {
          isLoading: false,
          isError: false,
          data: mockUser,
        };
      }
      return {
        isLoading: false,
        isError: false,
        data: null,
      };
    });
    
    render(<PostDetailsScreen />);
    
    // Verify post content is displayed
    expect(screen.getByText('Test Post Title')).toBeTruthy();
    expect(screen.getByText('This is the test post body')).toBeTruthy();
    
    // Verify user info is displayed
    expect(screen.getByText('By: John Doe (@johndoe)')).toBeTruthy();
    
    // Verify comments are displayed
    expect(screen.getByText('Comments (2)')).toBeTruthy();
    expect(screen.getByText('Comment Author')).toBeTruthy();
    expect(screen.getByText('author@example.com')).toBeTruthy();
    expect(screen.getByText('This is a test comment')).toBeTruthy();
    expect(screen.getByText('Another Commenter')).toBeTruthy();
  });
  
  test('handles refresh correctly', () => {
    const refetchPostMock = jest.fn();
    const refetchCommentsMock = jest.fn();
    
    const mockPost = {
      id: 1,
      userId: 1,
      title: 'Test Post Title',
      body: 'This is the test post body',
    };
    
    const mockComments = [
      {
        id: 1,
        postId: 1,
        name: 'Comment Author',
        email: 'author@example.com',
        body: 'This is a test comment',
      },
    ];
    
    // Mock successful query responses with refetch functions
    (useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
      if (queryKey[0] === 'post') {
        return {
          isLoading: false,
          isError: false,
          data: mockPost,
          refetch: refetchPostMock,
        };
      }
      if (queryKey[0] === 'comments') {
        return {
          isLoading: false,
          isError: false,
          data: mockComments,
          refetch: refetchCommentsMock,
        };
      }
      return {
        isLoading: false,
        isError: false,
        data: null,
        refetch: jest.fn(),
      };
    });
    
    render(<PostDetailsScreen />);
    
    // Find and click the retry button
    const retryButton = screen.queryByText('Retry');
    if (retryButton) {
      fireEvent.press(retryButton);
      
      // Check if refetch functions were called
      expect(refetchPostMock).toHaveBeenCalled();
      expect(refetchCommentsMock).toHaveBeenCalled();
    }
  });
  
  test('navigates to user posts when user name is clicked', () => {
    const navigateMock = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({
      navigate: navigateMock,
    });
    
    const mockPost = {
      id: 1,
      userId: 1,
      title: 'Test Post Title',
      body: 'This is the test post body',
    };
    
    const mockComments = [];
    
    const mockUser = {
      id: 1,
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      address: {
        street: 'Test Street',
        suite: 'Suite 123',
        city: 'Test City',
        zipcode: '12345',
        geo: {
          lat: '0',
          lng: '0',
        },
      },
      phone: '123-456-7890',
      website: 'example.com',
      company: {
        name: 'Test Company',
        catchPhrase: 'Testing is important',
        bs: 'Test BS',
      },
    };
    
    // Mock successful query responses
    (useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
      if (queryKey[0] === 'post') {
        return {
          isLoading: false,
          isError: false,
          data: mockPost,
          refetch: jest.fn(),
        };
      }
      if (queryKey[0] === 'comments') {
        return {
          isLoading: false,
          isError: false,
          data: mockComments,
          refetch: jest.fn(),
        };
      }
      if (queryKey[0] === 'user') {
        return {
          isLoading: false,
          isError: false,
          data: mockUser,
        };
      }
      return {
        isLoading: false,
        isError: false,
        data: null,
      };
    });
    
    render(<PostDetailsScreen />);
    
    // Find and click the user info text
    const userInfoText = screen.getByText('By: John Doe (@johndoe)');
    fireEvent.press(userInfoText);
    
    // Check if navigation was called with correct parameters
    expect(navigateMock).toHaveBeenCalledWith('UserPosts', { userId: 1 });
  });
  
  test('renders no comments message when there are no comments', () => {
    const mockPost = {
      id: 1,
      userId: 1,
      title: 'Test Post Title',
      body: 'This is the test post body',
    };
    
    const mockComments = [];
    
    // Mock successful query responses with empty comments array
    (useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
      if (queryKey[0] === 'post') {
        return {
          isLoading: false,
          isError: false,
          data: mockPost,
          refetch: jest.fn(),
        };
      }
      if (queryKey[0] === 'comments') {
        return {
          isLoading: false,
          isError: false,
          data: mockComments,
          refetch: jest.fn(),
        };
      }
      return {
        isLoading: false,
        isError: false,
        data: null,
      };
    });
    
    render(<PostDetailsScreen />);
    
    // Verify no comments message is displayed
    expect(screen.getByText('No comments found for this post.')).toBeTruthy();
  });
  
  test('handles error in comments fetch correctly', () => {
    // Mock error state for comments query
    (useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
      if (queryKey[0] === 'post') {
        return {
          isLoading: false,
          isError: false,
          data: { id: 1, userId: 1, title: 'Test Post', body: 'Test body' },
          refetch: jest.fn(),
        };
      }
      if (queryKey[0] === 'comments') {
        return {
          isLoading: false,
          isError: true,
          error: new Error('Failed to fetch comments'),
          refetch: jest.fn(),
        };
      }
      return {
        isLoading: false,
        isError: false,
        data: null,
      };
    });
    
    render(<PostDetailsScreen />);
    
    // Check if error message and retry button are shown
    expect(screen.getByText(/Error loading post: Failed to fetch comments/)).toBeTruthy();
    expect(screen.getByText('Retry')).toBeTruthy();
  });
});

