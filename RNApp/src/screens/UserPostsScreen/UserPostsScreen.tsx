import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTheme} from '../../contexts/ThemeContext';
import {theme as themeColors, commonStyles} from '../../styles/theme';
import {getPostsByUser, getUser, Post, User} from '../../services/api';
import {format} from 'date-fns';

type UserPostsScreenRouteProp = RouteProp<
  {
    UserPosts: {userId: number; userName?: string};
  },
  'UserPosts'
>;

type RootStackParamList = {
  UserPosts: {userId: number; userName?: string};
  PostDetails: {postId: number};
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'UserPosts'>;

const UserPostsScreen: React.FC = () => {
  const {currentTheme, isDarkMode} = useTheme();
  const theme = themeColors[currentTheme];
  const route = useRoute<UserPostsScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const {userId, userName: initialUserName} = route.params;

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(!initialUserName);

  // Current userName is either the initial one or comes from fetched user data
  const userName = initialUserName || (userData ? userData.name : `User #${userId}`);

  const loadPosts = async (refresh = false) => {
    if (refresh) {
      setRefreshing(true);
    } else if (!refreshing) {
      setLoading(true);
    }

    setError(null);

    try {
      const userPosts = await getPostsByUser(userId);
      setPosts(userPosts);
    } catch (err) {
      setError('Failed to load posts. Please try again.');
      console.error('Error fetching user posts:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [userId]);

  // Fetch user data if userName isn't provided
  useEffect(() => {
    const fetchUserData = async () => {
      if (!initialUserName) {
        setLoadingUser(true);
        try {
          const user = await getUser(userId);
          setUserData(user);
        } catch (err) {
          console.error('Error fetching user details:', err);
          // We'll continue with the placeholder name if fetching fails
        } finally {
          setLoadingUser(false);
        }
      }
    };

    fetchUserData();
  }, [userId, initialUserName]);

  const onRefresh = () => {
    loadPosts(true);
  };

  const navigateToPostDetails = (postId: number) => {
    navigation.navigate('PostDetails', {postId});
  };

  const renderPostItem = ({item}: {item: Post}) => (
    <TouchableOpacity
      style={[styles.postCard, {backgroundColor: theme.cardBackground}]}
      onPress={() => navigateToPostDetails(item.id)}>
      <Text style={[styles.postTitle, {color: theme.text}]}>{item.title}</Text>
      <Text style={[styles.postBody, {color: theme.textSecondary}]} numberOfLines={3}>
        {item.body}
      </Text>
      <View style={styles.postFooter}>
        <Text style={[styles.postDate, {color: theme.textSecondary}]}>
          {format(new Date(), 'MMM dd, yyyy')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={[styles.loadingContainer, {backgroundColor: theme.background}]}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
      <View style={[styles.header, {borderBottomColor: theme.border}]}>
        <Text style={[styles.userName, {color: theme.text}]}>
          Posts by {loadingUser ? `User #${userId} (loading...)` : userName}
        </Text>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, {color: theme.error}]}>{error}</Text>
          <TouchableOpacity
            style={[styles.retryButton, {backgroundColor: theme.accent}]}
            onPress={() => loadPosts()}>
            <Text style={[styles.retryButtonText, {color: 'white'}]}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderPostItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          onRefresh={onRefresh}
          refreshing={refreshing}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, {color: theme.textSecondary}]}>
                No posts found for this user
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  errorContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  header: {
    borderBottomWidth: 1,
    padding: 16,
    // Border color is applied dynamically in the component
  },
  listContainer: {
    padding: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  postBody: {
    fontSize: 14,
    marginBottom: 8,
  },
  postCard: {
    borderRadius: 8,
    elevation: 2,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  postDate: {
    fontSize: 12,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  retryButton: {
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  retryButtonText: {
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default UserPostsScreen;
