  const { currentTheme, isDarkMode } = useTheme();
  const theme = themeColors[currentTheme];
    queryFn: () => getPost(postId),
    queryFn: () => getCommentsForPost(postId),
    queryFn: () => getUser(post?.userId || 0),
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color="#0066CC" />
        <Text style={[styles.loadingText, { color: theme.text }]}>Loading post details...</Text>
      <View style={[styles.errorContainer, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: "#DC3545" }]}>
          style={[styles.retryButton, { backgroundColor: "#0066CC" }]}
          onPress={handleRefresh}
        >
          <Text style={[styles.retryButtonText, { color: "#FFFFFF" }]}>Retry</Text>
          refreshing={isPostLoading || isCommentsLoading}
          onRefresh={handleRefresh}
          colors={["#0066CC"]}
          tintColor={"#0066CC"}
              <Text style={[styles.userInfo, { color: "#0066CC" }]}>
              <Text style={[styles.commentEmail, { color: theme.textSecondary }]}>
          <Text style={[styles.noCommentsText, { color: theme.textSecondary }]}>
