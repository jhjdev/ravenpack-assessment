import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { apiService, Post } from '../../services/api';
import {
  createThemedStyles,
  typography,
  spacing,
  borderRadius,
  commonStyles,
} from '../../styles/styles';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { currentTheme } = useTheme();
  const isDarkTheme = currentTheme === 'dark';
  const styles = themedStyles(isDarkTheme);

  // Fetch posts using TanStack Query
  const {
    data: posts,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: apiService.getPosts.bind(apiService),
  });

  // Handle refresh action
  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // Navigate to post details
  const navigateToPostDetails = (post: Post) => {
    navigation.navigate('PostDetails', { postId: post.id });
    // Also log for debugging purposes
    console.log('Navigate to post details', post.id);
  };

  // Navigate to user's posts
  const navigateToUserPosts = (userId: number) => {
    // Only pass userId to UserPostsScreen - let it handle fetching user details
    navigation.navigate('UserPosts', { userId });
    // Also log for debugging purposes
    console.log('Navigate to user posts', userId);
  };

  // Render individual post item
  const renderPostItem = ({ item }: { item: Post }) => (
    <TouchableOpacity
      style={styles.postCard}
      onPress={() => navigateToPostDetails(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.postTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.postBody} numberOfLines={2}>
        {item.body}
      </Text>
      <View style={styles.postFooter}>
        <TouchableOpacity 
          style={styles.readMoreButton}
          onPress={() => navigateToPostDetails(item)}
        >
          <Text style={styles.readMoreText}>Read more</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.authorButton}
          onPress={() => navigateToUserPosts(item.userId)}
        >
          <Text style={styles.userLink}>View author posts</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // Empty list component
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No posts found</Text>
      <TouchableOpacity style={styles.retryButton} onPress={refetch}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  // Error component
  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.errorMessage}>
          {error instanceof Error ? error.message : 'Failed to fetch posts'}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={!isLoading && renderEmptyList()}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={onRefresh}
            colors={[styles.refreshColor.color]}
            tintColor={styles.refreshColor.color}
            progressBackgroundColor={styles.refreshProgressBackground.backgroundColor}
          />
        }
        ListHeaderComponent={
          isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                size="large"
                color={styles.loadingIndicator.color}
              />
              <Text style={styles.loadingText}>Loading posts...</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

// Create theme-specific styles
const themedStyles = createThemedStyles((theme, commonStyles) =>
  StyleSheet.create({
    container: {
      ...commonStyles.container,
      backgroundColor: theme.colors.background,
    },
    listContent: {
      padding: spacing.md,
      paddingBottom: spacing.xxxl,
    },
    postCard: {
      ...commonStyles.card,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: borderRadius.lg,
      ...theme.shadows.medium,
      padding: spacing.md,
      marginBottom: spacing.sm,
      elevation: 3,
    },
    postTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold as any,
      color: theme.colors.text.primary,
      marginBottom: spacing.sm,
    },
    postBody: {
      fontSize: typography.fontSize.md,
      color: theme.colors.text.secondary,
      marginBottom: spacing.md,
      lineHeight: typography.lineHeight.md,
    },
    postFooter: {
      ...commonStyles.row,
      justifyContent: 'space-between',
      marginTop: spacing.sm,
      paddingTop: spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    readMoreButton: {
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      backgroundColor: theme.colors.primary,
      borderRadius: borderRadius.sm,
    },
    readMoreText: {
      fontSize: typography.fontSize.sm,
      color: '#FFFFFF',
      fontWeight: typography.fontWeight.medium as any,
    },
    authorButton: {
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
    },
    userLink: {
      fontSize: typography.fontSize.sm,
      color: theme.colors.primary,
      fontWeight: typography.fontWeight.medium as any,
    },
    separator: {
      height: spacing.md,
    },
    loadingContainer: {
      ...commonStyles.center,
      padding: spacing.xl,
    },
    loadingIndicator: {
      color: theme.colors.primary,
    },
    loadingText: {
      marginTop: spacing.md,
      fontSize: typography.fontSize.md,
      color: theme.colors.text.secondary,
    },
    emptyContainer: {
      ...commonStyles.center,
      padding: spacing.xl,
    },
    emptyText: {
      fontSize: typography.fontSize.lg,
      color: theme.colors.text.secondary,
      marginBottom: spacing.md,
    },
    errorContainer: {
      ...commonStyles.container,
      ...commonStyles.center,
      padding: spacing.xl,
      backgroundColor: theme.colors.background,
    },
    errorTitle: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold as any,
      color: theme.colors.error,
      marginBottom: spacing.sm,
    },
    errorMessage: {
      fontSize: typography.fontSize.md,
      color: theme.colors.text.secondary,
      marginBottom: spacing.lg,
      textAlign: 'center',
    },
    retryButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.md,
    },
    retryButtonText: {
      color: '#FFFFFF',
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.medium as any,
    },
    refreshColor: {
      color: theme.colors.primary,
    },
    refreshProgressBackground: {
      backgroundColor: theme.colors.surface,
    },
  })
);

export default HomeScreen;

