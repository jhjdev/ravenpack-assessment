import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';

import { getPost, getCommentsForPost, getUser } from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';
import { theme as themeColors } from '../../styles/theme';

type PostDetailsRouteParams = {
  PostDetails: {
    postId: number;
  };
  UserPosts: {
    userId: number;
  };
};

type PostDetailsScreenRouteProp = RouteProp<PostDetailsRouteParams, 'PostDetails'>;

export const PostDetailsScreen: React.FC = () => {
  const route = useRoute<PostDetailsScreenRouteProp>();
  const { postId } = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<PostDetailsRouteParams>>();
  const { currentTheme } = useTheme();
  const theme = themeColors[currentTheme];

  const {
    data: post,
    isLoading: isPostLoading,
    isError: isPostError,
    error: postError,
    refetch: refetchPost,
  } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPost(postId),
  });

  const {
    data: comments,
    isLoading: isCommentsLoading,
    isError: isCommentsError,
    error: commentsError,
    refetch: refetchComments,
  } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => getCommentsForPost(postId),
  });

  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useQuery({
    queryKey: ['user', post?.userId],
    queryFn: () => getUser(post?.userId || 0),
    enabled: !!post?.userId,
  });

  const handleRefresh = () => {
    refetchPost();
    refetchComments();
  };

  const navigateToUserPosts = (userId: number) => {
    navigation.navigate('UserPosts', { userId });
  };

  if (isPostLoading || isCommentsLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.accent} />
        <Text style={[styles.loadingText, { color: theme.text }]}>Loading post details...</Text>
      </View>
    );
  }

  if (isPostError || isCommentsError) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.error }]}>
          Error loading post: {(postError as Error)?.message || (commentsError as Error)?.message}
        </Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: theme.accent }]}
          onPress={handleRefresh}>
          <Text style={[styles.retryButtonText, { color: theme.background }]}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      refreshControl={
        <RefreshControl
          refreshing={isPostLoading || isCommentsLoading}
          onRefresh={handleRefresh}
          colors={[theme.accent]}
          tintColor={theme.accent}
        />
      }>
      {post && (
        <View style={styles.postContainer}>
          <Text style={[styles.postTitle, { color: theme.text }]}>{post.title}</Text>
          {user && !isUserLoading && !isUserError && (
            <TouchableOpacity onPress={() => navigateToUserPosts(user.id)}>
              <Text style={[styles.userInfo, { color: theme.accent }]}>
                By: {user.name} (@{user.username})
              </Text>
            </TouchableOpacity>
          )}
          <Text style={[styles.postBody, { color: theme.text }]}>{post.body}</Text>
        </View>
      )}

      <View style={styles.commentsSection}>
        <Text style={[styles.commentsTitle, { color: theme.text }]}>
          Comments ({comments?.length || 0})
        </Text>
        {comments && comments.length > 0 ? (
          comments.map(comment => (
            <View key={comment.id} style={[styles.commentContainer, { borderColor: theme.border }]}>
              <Text style={[styles.commentName, { color: theme.text }]}>{comment.name}</Text>
              <Text style={[styles.commentEmail, { color: theme.textSecondary }]}>
                {comment.email}
              </Text>
              <Text style={[styles.commentBody, { color: theme.text }]}>{comment.body}</Text>
            </View>
          ))
        ) : (
          <Text style={[styles.noCommentsText, { color: theme.textSecondary }]}>
            No comments found for this post.
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  commentBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  commentContainer: {
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
    padding: 12,
  },
  commentEmail: {
    fontSize: 14,
    marginBottom: 8,
  },
  commentName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  commentsSection: {
    marginTop: 20,
  },
  commentsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  errorContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 10,
  },
  noCommentsText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  postBody: {
    fontSize: 16,
    lineHeight: 24,
  },
  postContainer: {
    marginBottom: 20,
  },
  postTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  retryButton: {
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userInfo: {
    fontSize: 16,
    marginBottom: 16,
  },
});
