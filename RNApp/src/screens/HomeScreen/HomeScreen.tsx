import React, {useCallback} from 'react';
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
import {useQuery} from '@tanstack/react-query';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../contexts/ThemeContext';
import {apiService, Post} from '../../services/api';
import {
  createThemedStyles,
  typography,
  spacing,
  borderRadius,
  commonStyles,
} from '../../styles/styles';

const HomeScreen = () => {
  const navigation = useNavigation();
  const {currentTheme} = useTheme();
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
    navigation.navigate('PostDetails', {postId: post.id});
    // Also log for debugging purposes
    console.log('Navigate to post details', post.id);
  };

  // Navigate to user's posts
  const navigateToUserPosts = (userId: number) => {
    // Only pass userId to UserPostsScreen - let it handle fetching user details
    navigation.navigate('UserPosts', {userId});
    // Also log for debugging purposes
    console.log('Navigate to user posts', userId);
  };

  // Render individual post item
  const renderPostItem = ({item}: {item: Post}) => (
    <TouchableOpacity
      style={styles.postCard}
      onPress={() => navigateToPostDetails(item)}
      activeOpacity={0.7}>
      <Text style={styles.postTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.postBody} numberOfLines={2}>
        {item.body}
      </Text>
      <View style={styles.postFooter}>
        <TouchableOpacity style={styles.readMoreButton} onPress={() => navigateToPostDetails(item)}>
          <Text style={styles.readMoreText}>Read more</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.authorButton}
          onPress={() => navigateToUserPosts(item.userId)}>
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
        keyExtractor={item => item.id.toString()}
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
              <ActivityIndicator size="large" color={styles.loadingIndicator.color} />
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
    authorButton: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
    },
    container: {
      ...commonStyles.container,
      backgroundColor: theme.colors.background,
    },
    emptyContainer: {
      ...commonStyles.center,
      padding: spacing.xl,
    },
    emptyText: {
      color: theme.colors.text.secondary,
      fontSize: typography.fontSize.lg,
      marginBottom: spacing.md,
    },
    errorContainer: {
      ...commonStyles.container,
      ...commonStyles.center,
      backgroundColor: theme.colors.background,
      padding: spacing.xl,
    },
    errorMessage: {
      color: theme.colors.text.secondary,
      fontSize: typography.fontSize.md,
      marginBottom: spacing.lg,
      textAlign: 'center',
    },
    errorTitle: {
      color: theme.colors.error,
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold as any,
      marginBottom: spacing.sm,
    },
    listContent: {
      padding: spacing.md,
      paddingBottom: spacing.xxxl,
    },
    loadingContainer: {
      ...commonStyles.center,
      padding: spacing.xl,
    },
    loadingIndicator: {
      color: theme.colors.primary,
    },
    loadingText: {
      color: theme.colors.text.secondary,
      fontSize: typography.fontSize.md,
      marginTop: spacing.md,
    },
    postBody: {
      color: theme.colors.text.secondary,
      fontSize: typography.fontSize.md,
      lineHeight: typography.lineHeight.md,
      marginBottom: spacing.md,
    },
    postCard: {
      ...commonStyles.card,
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      ...theme.shadows.medium,
      elevation: 3,
      marginBottom: spacing.sm,
      padding: spacing.md,
    },
    postFooter: {
      ...commonStyles.row,
      borderTopColor: theme.colors.border,
      borderTopWidth: 1,
      justifyContent: 'space-between',
      marginTop: spacing.sm,
      paddingTop: spacing.sm,
    },
    postTitle: {
      color: theme.colors.text.primary,
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold as any,
      marginBottom: spacing.sm,
    },
    readMoreButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: borderRadius.sm,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
    },
    readMoreText: {
      color: '#FFFFFF',
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium as any,
    },
    refreshColor: {
      color: theme.colors.primary,
    },
    refreshProgressBackground: {
      backgroundColor: theme.colors.surface,
    },
    retryButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
    },
    retryButtonText: {
      color: '#FFFFFF',
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.medium as any,
    },
    separator: {
      height: spacing.md,
    },
    userLink: {
      color: theme.colors.primary,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium as any,
    },
  }),
);

export default HomeScreen;
