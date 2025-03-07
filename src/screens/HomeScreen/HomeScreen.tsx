import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../contexts/ThemeContext';
import { apiService, Post } from '../../services/api';
import { commonStyles, theme, typography, spacing, borderRadius } from '../../styles/theme';

/* eslint-disable react-native/no-unused-styles */

// Define the navigation types
type RootStackParamList = {
  Home: undefined;
  PostDetails: { postId: number };
  UserPosts: { userId: number };
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

// Type definition for styles prop
interface StyledComponentProps {
  styles: ReturnType<typeof themedStyles>;
}

// Loading header component extracted to avoid defining components during render
const LoadingHeader = ({
  isLoading,
  styles,
}: {
  isLoading: boolean;
  styles: ReturnType<typeof themedStyles>;
}) => {
  if (!isLoading) return null;

  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={styles.loadingIndicator.color as string} />
      <Text style={styles.loadingText}>Loading posts...</Text>
    </View>
  );
};

// Separator component extracted to avoid defining components during render
const ItemSeparator = ({ styles }: StyledComponentProps) => <View style={styles.separator} />;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { currentTheme } = useTheme();
  const isDarkTheme = currentTheme === 'dark';
  const styles = themedStyles(isDarkTheme);

  // Memoize the ItemSeparatorComponent to prevent unstable rendering
  const renderItemSeparator = useCallback(() => <ItemSeparator styles={styles} />, [styles]);

  // Fetch posts using TanStack Query
  const {
    data: posts,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<Post[]>({
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
  };

  // Navigate to user's posts
  const navigateToUserPosts = (userId: number) => {
    navigation.navigate('UserPosts', { userId });
  };

  // Render individual post item
  const renderPostItem = ({ item }: { item: Post }) => (
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
      <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
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
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
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
        ListEmptyComponent={!isLoading ? renderEmptyList() : null}
        ItemSeparatorComponent={renderItemSeparator}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={onRefresh}
            colors={[styles.refreshColor.color as string]}
            tintColor={styles.refreshColor.color as string}
            progressBackgroundColor={styles.refreshProgressBackground.backgroundColor as string}
          />
        }
        ListHeaderComponent={<LoadingHeader isLoading={isLoading} styles={styles} />}
      />
    </View>
  );
};

// Create theme-specific styles
const themedStyles = (isDarkTheme: boolean) => {
  const currentTheme = isDarkTheme ? theme.dark : theme.light;

  return StyleSheet.create({
    authorButton: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
    },
    container: {
      ...commonStyles.container,
      backgroundColor: currentTheme.background,
    },
    emptyContainer: {
      ...commonStyles.center,
      padding: spacing.xl,
    },
    emptyText: {
      color: currentTheme.textSecondary,
      fontSize: typography.fontSize.lg,
      marginBottom: spacing.md,
    },
    errorContainer: {
      ...commonStyles.container,
      ...commonStyles.center,
      backgroundColor: currentTheme.background,
      padding: spacing.xl,
    },
    errorMessage: {
      color: currentTheme.textSecondary,
      fontSize: typography.fontSize.md,
      marginBottom: spacing.lg,
      textAlign: 'center',
    },
    errorTitle: {
      color: currentTheme.error,
      fontWeight: typography.fontWeight.bold,
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
      color: currentTheme.accent,
    },
    loadingText: {
      color: currentTheme.textSecondary,
      fontSize: typography.fontSize.md,
      marginTop: spacing.md,
    },
    postBody: {
      color: currentTheme.textSecondary,
      fontSize: typography.fontSize.md,
      lineHeight: typography.lineHeight.md,
      marginBottom: spacing.md,
    },
    postCard: {
      ...commonStyles.card,
      backgroundColor: currentTheme.cardBackground,
      borderColor: currentTheme.border,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      marginBottom: spacing.sm,
      padding: spacing.md,
    },
    postFooter: {
      ...commonStyles.row,
      borderTopColor: currentTheme.border,
      borderTopWidth: 1,
      justifyContent: 'space-between',
      marginTop: spacing.sm,
      paddingTop: spacing.sm,
    },
    postTitle: {
      color: currentTheme.text,
      fontWeight: typography.fontWeight.bold,
      marginBottom: spacing.sm,
    },
    readMoreButton: {
      backgroundColor: currentTheme.accent,
      borderRadius: borderRadius.sm,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
    },
    readMoreText: {
      color: currentTheme.cardBackground,
      fontWeight: typography.fontWeight.medium,
    },
    refreshColor: {
      color: currentTheme.accent,
    },
    refreshProgressBackground: {
      backgroundColor: currentTheme.cardBackground,
    },
    retryButton: {
      backgroundColor: currentTheme.accent,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
    },
    retryButtonText: {
      color: currentTheme.cardBackground,
      fontWeight: typography.fontWeight.medium,
    },
    separator: {
      height: spacing.md,
    },
    userLink: {
      color: currentTheme.accent,
      fontWeight: typography.fontWeight.medium,
    },
  });
};

export default HomeScreen;
