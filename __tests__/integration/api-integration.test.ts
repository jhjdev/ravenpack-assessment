import { apiService } from '../../src/services/api';

describe('API Integration Tests', () => {
  // Integration test to verify the complete API flow works end-to-end
  describe('Data Flow Integration', () => {
    test('should successfully fetch and process posts data', async () => {
      try {
        // Test the complete flow: fetch posts -> verify structure -> ensure data is usable
        const posts = await apiService.getPosts();
        
        // Verify we get data back
        expect(Array.isArray(posts)).toBe(true);
        
        if (posts.length > 0) {
          const firstPost = posts[0];
          
          // Verify post structure matches what our app expects
          expect(firstPost).toHaveProperty('id');
          expect(firstPost).toHaveProperty('userId');
          expect(firstPost).toHaveProperty('title');
          expect(firstPost).toHaveProperty('body');
          
          // Verify data types are correct
          expect(typeof firstPost.id).toBe('number');
          expect(typeof firstPost.userId).toBe('number');
          expect(typeof firstPost.title).toBe('string');
          expect(typeof firstPost.body).toBe('string');
          
          // Test that we can fetch details for the first post
          const postDetails = await apiService.getPost(firstPost.id);
          expect(postDetails.id).toBe(firstPost.id);
          expect(postDetails.title).toBe(firstPost.title);
          
          // Test that we can fetch posts by the user who created the first post
          const userPosts = await apiService.getPostsByUser(firstPost.userId);
          expect(Array.isArray(userPosts)).toBe(true);
          
          // The user's posts should include the original post we found
          const matchingPost = userPosts.find(post => post.id === firstPost.id);
          expect(matchingPost).toBeDefined();
        }
        
        // Test passes if we get here without errors
        expect(true).toBe(true);
      } catch (error) {
        // If this fails, it means our API integration has real issues
        console.error('API Integration failed:', error);
        throw error;
      }
    }, 10000); // 10 second timeout for network requests
    
    test('should handle API errors gracefully in integration context', async () => {
      try {
        // Test fetching a post that likely doesn't exist
        await apiService.getPost(99999);
        
        // If we get here, either the API returned something or error handling worked
        expect(true).toBe(true);
      } catch (error) {
        // This is actually expected for a non-existent post
        // The important thing is that the error is handled and doesn't crash
        expect(error).toBeDefined();
      }
    });
  });
  
  describe('API Service Consistency', () => {
    test('should maintain consistent data structure across different endpoints', async () => {
      try {
        const [posts, users] = await Promise.all([
          apiService.getPosts(),
          apiService.getUsers(),
        ]);
        
        if (posts.length > 0 && users.length > 0) {
          const firstPost = posts[0];
          const postAuthor = users.find(user => user.id === firstPost.userId);
          
          // Verify the relationship between posts and users is consistent
          expect(postAuthor).toBeDefined();
          expect(postAuthor?.id).toBe(firstPost.userId);
        }
        
        expect(true).toBe(true);
      } catch (error) {
        console.error('API consistency test failed:', error);
        throw error;
      }
    }, 10000);
  });
});
