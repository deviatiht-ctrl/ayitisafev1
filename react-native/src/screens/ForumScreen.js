import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList,
  SafeAreaView, StatusBar, Modal, Image, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from '../i18n/useTranslation';
import { colors, fonts } from '../theme';

const MOCK_POSTS = [
  {
    id: '1',
    author: 'Jean Pierre',
    avatar: null,
    title: 'Sitiyasyon nan Delmas 32',
    content: 'Èske gen moun ki konnen sitiyasyon nan Delmas 32 jodi a? M te tande gen pwoblèm men m pa sèten.',
    timestamp: '2 èdtan de sa',
    likes: 12,
    comments: [
      { id: 'c1', author: 'Marie', content: 'Wi gen barikad nan zòn nan, evite ale la.', timestamp: '1 èdtan' },
      { id: 'c2', author: 'Paul', content: 'Mèsi pou enfòmasyon an!', timestamp: '45 min' },
    ],
    photos: [],
  },
  {
    id: '2',
    author: 'Sophie M.',
    avatar: null,
    title: 'Wout sekirize pou ale Pétion-Ville',
    content: 'Ki wout ki pi sekirize pou ale Pétion-Ville depi Tabarre? M bezwen ale demen maten.',
    timestamp: '5 èdtan de sa',
    likes: 8,
    comments: [
      { id: 'c3', author: 'Jacques', content: 'Pase pa Route de Frères, li pi sekirize.', timestamp: '4 èdtan' },
    ],
    photos: [],
  },
  {
    id: '3',
    author: 'Marc Antoine',
    avatar: null,
    title: 'Mèsi AyitiSafe!',
    content: 'App sa a sove lavi m yè! M te evite yon zòn danjere gras a alèt la. Mèsi anpil ekip AyitiSafe!',
    timestamp: '1 jou de sa',
    likes: 45,
    comments: [],
    photos: [],
  },
];

export default function ForumScreen({ navigation }) {
  const { t } = useTranslation();
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [showNewPost, setShowNewPost] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newComment, setNewComment] = useState('');
  const [likedPosts, setLikedPosts] = useState([]);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const saved = await AsyncStorage.getItem('forumPosts');
    if (saved) {
      setPosts([...JSON.parse(saved), ...MOCK_POSTS]);
    }
  };

  const savePosts = async (newPosts) => {
    const userPosts = newPosts.filter(p => !MOCK_POSTS.find(mp => mp.id === p.id));
    await AsyncStorage.setItem('forumPosts', JSON.stringify(userPosts));
  };

  const handleNewPost = () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    
    const post = {
      id: Date.now().toString(),
      author: 'Mwen',
      avatar: null,
      title: newTitle,
      content: newContent,
      timestamp: 'Kounye a',
      likes: 0,
      comments: [],
      photos: [],
    };
    
    const newPosts = [post, ...posts];
    setPosts(newPosts);
    savePosts(newPosts);
    setNewTitle('');
    setNewContent('');
    setShowNewPost(false);
  };

  const handleLike = (postId) => {
    if (likedPosts.includes(postId)) return;
    setLikedPosts([...likedPosts, postId]);
    setPosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
  };

  const handleComment = () => {
    if (!newComment.trim() || !selectedPost) return;
    
    const comment = {
      id: Date.now().toString(),
      author: 'Mwen',
      content: newComment,
      timestamp: 'Kounye a',
    };
    
    setPosts(posts.map(p => 
      p.id === selectedPost.id 
        ? { ...p, comments: [...p.comments, comment] }
        : p
    ));
    setNewComment('');
  };

  const renderPost = ({ item }) => (
    <TouchableOpacity 
      style={styles.postCard}
      onPress={() => setSelectedPost(item)}
      activeOpacity={0.8}
    >
      <View style={styles.postHeader}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={20} color="#9CA3AF" />
        </View>
        <View style={styles.postMeta}>
          <Text style={styles.authorName}>{item.author}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
      </View>
      
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postContent} numberOfLines={3}>{item.content}</Text>
      
      {item.photos && item.photos.length > 0 && (
        <View style={styles.photoRow}>
          {item.photos.slice(0, 3).map((uri, i) => (
            <Image key={i} source={{ uri }} style={styles.postPhoto} />
          ))}
          {item.photos.length > 3 && (
            <View style={styles.morePhotos}>
              <Text style={styles.morePhotosText}>+{item.photos.length - 3}</Text>
            </View>
          )}
        </View>
      )}
      
      <View style={styles.postActions}>
        <TouchableOpacity 
          style={styles.actionBtn}
          onPress={() => handleLike(item.id)}
        >
          <Ionicons 
            name={likedPosts.includes(item.id) ? "heart" : "heart-outline"} 
            size={18} 
            color={likedPosts.includes(item.id) ? colors.danger : "#64748B"} 
          />
          <Text style={styles.actionText}>{item.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionBtn}
          onPress={() => setSelectedPost(item)}
        >
          <Ionicons name="chatbubble-outline" size={18} color="#64748B" />
          <Text style={styles.actionText}>{item.comments.length} {t('comments')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="share-outline" size={18} color="#64748B" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('communityForum')}</Text>
        <TouchableOpacity 
          style={styles.newPostBtn}
          onPress={() => setShowNewPost(true)}
        >
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Posts List */}
      {posts.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="chatbubbles-outline" size={60} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>{t('noPostsYet')}</Text>
          <Text style={styles.emptyText}>{t('beFirstPost')}</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderPost}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* New Post Modal */}
      <Modal visible={showNewPost} animationType="slide" transparent>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('newPost')}</Text>
              <TouchableOpacity onPress={() => setShowNewPost(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder={t('postTitle')}
              placeholderTextColor="#9CA3AF"
            />

            <TextInput
              style={[styles.input, styles.textarea]}
              value={newContent}
              onChangeText={setNewContent}
              placeholder={t('writePost')}
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />

            <TouchableOpacity 
              style={[styles.publishBtn, (!newTitle.trim() || !newContent.trim()) && styles.publishBtnDisabled]}
              onPress={handleNewPost}
              disabled={!newTitle.trim() || !newContent.trim()}
            >
              <Ionicons name="send" size={18} color="#FFF" />
              <Text style={styles.publishBtnText}>{t('publish')}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Post Detail Modal */}
      <Modal visible={!!selectedPost} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.detailModal]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedPost?.title}</Text>
              <TouchableOpacity onPress={() => setSelectedPost(null)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.detailHeader}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={20} color="#9CA3AF" />
              </View>
              <View>
                <Text style={styles.authorName}>{selectedPost?.author}</Text>
                <Text style={styles.timestamp}>{selectedPost?.timestamp}</Text>
              </View>
            </View>

            <Text style={styles.detailContent}>{selectedPost?.content}</Text>

            {selectedPost?.photos && selectedPost.photos.length > 0 && (
              <View style={styles.detailPhotos}>
                {selectedPost.photos.map((uri, i) => (
                  <Image key={i} source={{ uri }} style={styles.detailPhoto} />
                ))}
              </View>
            )}

            <View style={styles.commentSection}>
              <Text style={styles.commentHeader}>
                {t('comments')} ({selectedPost?.comments?.length || 0})
              </Text>
              <FlatList
                data={selectedPost?.comments || []}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.commentItem}>
                    <Text style={styles.commentAuthor}>{item.author}</Text>
                    <Text style={styles.commentText}>{item.content}</Text>
                    <Text style={styles.commentTime}>{item.timestamp}</Text>
                  </View>
                )}
                style={styles.commentList}
              />
            </View>

            <View style={styles.commentInputRow}>
              <TextInput
                style={styles.commentInput}
                value={newComment}
                onChangeText={setNewComment}
                placeholder={t('writeComment')}
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity 
                style={styles.sendCommentBtn}
                onPress={handleComment}
              >
                <Ionicons name="send" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0',
  },
  headerTitle: { fontFamily: fonts.bold, fontSize: 24, color: colors.primary },
  newPostBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.accent,
    justifyContent: 'center', alignItems: 'center',
  },
  listContent: { padding: 16 },
  postCard: {
    backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#F4F6F9',
    justifyContent: 'center', alignItems: 'center',
  },
  postMeta: { marginLeft: 10 },
  authorName: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.primary },
  timestamp: { fontFamily: fonts.regular, fontSize: 12, color: '#9CA3AF' },
  postTitle: { fontFamily: fonts.semiBold, fontSize: 16, color: colors.primary, marginBottom: 6 },
  postContent: { fontFamily: fonts.regular, fontSize: 14, color: '#64748B', lineHeight: 20 },
  photoRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  postPhoto: { width: 80, height: 80, borderRadius: 8 },
  morePhotos: {
    width: 80, height: 80, borderRadius: 8, backgroundColor: '#F4F6F9',
    justifyContent: 'center', alignItems: 'center',
  },
  morePhotosText: { fontFamily: fonts.semiBold, fontSize: 16, color: '#64748B' },
  postActions: { flexDirection: 'row', marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F4F6F9' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
  actionText: { fontFamily: fonts.medium, fontSize: 13, color: '#64748B', marginLeft: 5 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyTitle: { fontFamily: fonts.semiBold, fontSize: 18, color: colors.primary, marginTop: 16 },
  emptyText: { fontFamily: fonts.regular, fontSize: 14, color: '#64748B', marginTop: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  detailModal: { maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontFamily: fonts.bold, fontSize: 18, color: colors.primary, flex: 1, marginRight: 10 },
  input: {
    backgroundColor: '#F4F6F9', borderRadius: 12, padding: 14,
    fontFamily: fonts.regular, fontSize: 15, color: colors.primary, marginBottom: 12,
  },
  textarea: { minHeight: 120 },
  publishBtn: {
    backgroundColor: colors.accent, borderRadius: 12, height: 50,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 8,
  },
  publishBtnDisabled: { opacity: 0.5 },
  publishBtnText: { fontFamily: fonts.semiBold, fontSize: 16, color: '#FFF' },
  detailHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  detailContent: { fontFamily: fonts.regular, fontSize: 15, color: colors.primary, lineHeight: 22 },
  detailPhotos: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  detailPhoto: { width: 100, height: 100, borderRadius: 10 },
  commentSection: { marginTop: 20, borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingTop: 16 },
  commentHeader: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.primary, marginBottom: 12 },
  commentList: { maxHeight: 200 },
  commentItem: { backgroundColor: '#F4F6F9', borderRadius: 10, padding: 12, marginBottom: 8 },
  commentAuthor: { fontFamily: fonts.semiBold, fontSize: 13, color: colors.primary },
  commentText: { fontFamily: fonts.regular, fontSize: 14, color: '#64748B', marginTop: 4 },
  commentTime: { fontFamily: fonts.regular, fontSize: 11, color: '#9CA3AF', marginTop: 4 },
  commentInputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 },
  commentInput: {
    flex: 1, backgroundColor: '#F4F6F9', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10,
    fontFamily: fonts.regular, fontSize: 14, color: colors.primary,
  },
  sendCommentBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.accent,
    justifyContent: 'center', alignItems: 'center',
  },
});
