import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react-native';
import UserPostsScreen from '../../src/screens/UserPostsScreen/UserPostsScreen';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../../src/contexts/ThemeContext';
import { getPostsByUser } from '../../src/services/api';

// Mock dependencies
jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(),
  useNavigation: jest.fn(),
}));

jest.mock('../../src/services/api', () => ({
  getPostsByUser: jest.fn(),
}));

// Mock date-fns format to avoid date-related issues in tests
jest.mock('date-fns', () => ({
  format: jest.fn(() => 'Jan 01, 2023'),
}));

describe('UserPostsScreen', () => {
  // Setup default mocks for each test
  beforeEach(() => {
    // Mock navigation
    (useNavigation as jest.Mock).mockReturnValue({
      navigate: jest.fn(),
    });
    
    // Mock route with required params
    (useRoute as jest.Mock).mockReturnValue({
      params: { userId: 1, userName: 'John Doe' },
    });
    
    // Reset mocks between tests
    jest.clearAllMocks();
  });
  
  const renderWithTheme = (theme: 'light' | 'dark' = 'light') => {
    return render(
      <ThemeContext.Provider value={{ currentTheme: theme, setTheme: jest.fn() }}>
        <UserPostsScreen />
      </ThemeContext.Provider>
    );
  };

  test('renders loading state correctly', async () => {
    // Mock API to never resolve during this test
    (getPostsByUser as jest.Mock).mockImplementation(() => new Promise(() => {}));
    
    renderWithTheme();
    
    // Expect loading indicator to be visible
    expect(screen.getByTestId('loading-indicator')).toBeTruthy();
  });
  
  test('renders error state correctly', async () => {
    // Mock API to throw an error
    (getPostsByUser as jest.Mock).mockRejectedValue(new Error('Failed to fetch posts'));
    
    renderWithTheme();
    
    // Wait for error state to be rendered
    await waitFor(() => {
      expect(screen.getByText('Failed to load posts. Please try again.')).toBeTruthy();
    });
    
    // Check if retry button is present
    expect(screen.getByText('Retry')).toBeTruthy();
  });
  
  test('renders posts correctly', async () => {
    // Mock successful API response
    const mockPosts = [
      {
        id: 1,
        userId: 1,
        title: 'Test Post 1',
        body: 'This is the first test post',
      },
      {
        id: 2,
        userId: 1,
        title: 'Test Post 2',
        body: 'This is the second test post',
      },
    ];
    
    (getPostsByUser as jest.Mock).mockResolvedValue(mockPosts);
    
    renderWithTheme();
    
    // Wait for posts to be rendered
    await waitFor(() => {
      expect(screen.getByText('Posts by John Doe')).toBeTruthy();
    });
    
    // Check if posts are displayed
    expect(screen.getByText('Test Post 1')).toBeTruthy();
    expect(screen.getByText('This is the first test post')).toBeTruthy();
    expect(screen.getByText('Test Post 2')).toBeTruthy();
    expect(screen.getByText('This is the second test post')).toBeTruthy();
  });
  
  test('renders empty state correctly', async () => {
    // Mock empty API response
    (getPostsByUser as jest.Mock).mockResolvedValue([]);
    
    renderWithTheme();
    
    // Wait for empty state to be rendered
    await waitFor(() => {
      expect(screen.getByText('No posts found for this user')).toBeTruthy();
    });
  });
  
  test('handles retry correctly when in error state', async () => {
    // Mock API to throw an error and then resolve on second call
    (getPostsByUser as jest.Mock)
      .mockRejectedValueOnce(new Error('Failed to fetch posts'))
      .mockResolvedValueOnce([
        {
          id: 1,
          userId: 1,
          title: 'Test Post After Retry',
          body: 'This post appears after retrying',
        },
      ]);
    
    renderWithTheme();
    
    // Wait for error state to be rendered
    await waitFor(() => {
      expect(screen.getByText('Failed to load posts. Please try again.')).toBeTruthy();
    });
    
    // Find and click retry button
    const retryButton = screen.getByText('Retry');
    fireEvent.press(retryButton);
    
    // Wait for success state after retry
    await waitFor(() => {
      expect(screen.getByText('Test Post After Retry')).toBeTruthy();
    });
    
    // Verify API was called twice
    expect(getPostsByUser).toHaveBeenCalledTimes(2);
  });
  
  test('navigates to post details when a post is pressed', async () => {
    // Setup navigation mock
    const navigateMock = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({
      navigate: navigateMock,
    });
    
    // Mock successful API response
    const mockPosts = [
      {
        id: 5,
        userId: 1,
        title: 'Test Post',
        body: 'Test post body',
      },
    ];
    
    (getPostsByUser as jest.Mock).mockResolvedValue(mockPosts);
    
    renderWithTheme();
    
    // Wait for post to be rendered
    await waitFor(() => {
      expect(screen.getByText('Test Post')).toBeTruthy();
    });
    
    // Find and click the post
    const postCard = screen.getByText('Test Post');
    fireEvent.press(postCard);
    
    // Check if navigation was called with correct parameters
    expect(navigateMock).toHaveBeenCalledWith('PostDetails', { postId: 5 });
  });
  
  test('handles pull-to-refresh correctly', async () => {
    // Mock initial and refreshed data
    const initialPosts = [
      {
        id: 1,
        userId: 1,
        title: 'Initial Post',
        body: 'Initial post body',
      },
    ];
    
    const refreshedPosts = [
      {
        id: 1,
        userId: 1,
        title: 'Initial Post',
        body: 'Initial post body',
      },
      {
        id: 2,
        userId: 1,
        title: 'New Post',
        body: 'New post body',
      },
    ];
    
    // Setup API mock to return different data on second call
    (getPostsByUser as jest.Mock)
      .mockResolvedValueOnce(initialPosts)
      .mockResolvedValueOnce(refreshedPosts);
    
    renderWithTheme();
    
    // Wait for initial post to be rendered
    await waitFor(() => {
      expect(screen.getByText('Initial Post')).toBeTruthy();
    });
    
    // Find FlatList and simulate refresh
    const flatList = screen.UNSAFE_getByType('FlatList');
    act(() => {
      flatList.props.onRefresh();
    });
    
    // Wait for refreshed posts to be rendered
    await waitFor(() => {
      expect(screen.getByText('New Post')).toBeTruthy();
    });
    
    // Verify API was called twice
    expect(getPostsByUser).toHaveBeenCalledTimes(2);
  });
  
  test('renders correctly with dark theme', async () => {
    // Mock successful API response
    const mockPosts = [
      {
        id: 1,
        userId: 1,
        title: 'Dark Theme Post',
        body: 'Post body in dark theme',
      },
    ];
    
    (getPostsByUser as jest.Mock).mockResolvedValue(mockPosts);
    
    // Render with dark theme
    renderWithTheme('dark');
    
    // Wait for post to be rendered
    await waitFor(() => {
      expect(screen.getByText('Dark Theme Post')).toBeTruthy();
    });
    
    // Since we can't easily check styles in these tests without a more complex setup,
    // we can at least verify the component renders correctly with dark theme
    expect(screen.getByText('Posts by John Doe')).toBeTruthy();
  });
});

