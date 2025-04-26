import { supabase } from './supabase';

const commentService = {
  /**
   * Get comments for an article
   * @param {string} articleId - The article ID
   * @returns {Promise<Array>} Array of comments
   */
  async getComments(articleId) {
    // First get all comments
    const { data: comments, error: commentsError } = await supabase
      .from('comments')
      .select('*')
      .eq('article_id', articleId)
      .order('created_at', { ascending: false });

    if (commentsError) {
      console.error('Error fetching comments:', commentsError);
      throw commentsError;
    }

    // Then get like counts for each comment
    const { data: likeCounts, error: likesError } = await supabase
      .from('comment_likes')
      .select('comment_id')
      .in('comment_id', comments.map(c => c.id));

    if (likesError) {
      console.error('Error fetching like counts:', likesError);
      throw likesError;
    }

    // Count likes for each comment
    const likesByComment = likeCounts.reduce((acc, like) => {
      acc[like.comment_id] = (acc[like.comment_id] || 0) + 1;
      return acc;
    }, {});

    // Combine comments with their like counts
    return comments.map(comment => ({
      ...comment,
      likes: likesByComment[comment.id] || 0
    }));
  },

  /**
   * Add a new comment
   * @param {Object} comment - The comment data
   * @param {string} comment.articleId - The article ID
   * @param {string} comment.name - The commenter's name
   * @param {string} comment.content - The comment content
   * @returns {Promise<Object>} The created comment
   */
  async addComment({ articleId, name, content }) {
    const { data: comment, error: commentError } = await supabase
      .from('comments')
      .insert([{
        article_id: articleId,
        name,
        content,
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (commentError) {
      console.error('Error adding comment:', commentError);
      throw commentError;
    }

    // New comments start with 0 likes
    return {
      ...comment,
      likes: 0
    };
  },

  /**
   * Delete a comment
   * @param {string} commentId - The comment ID
   * @returns {Promise<void>}
   */
  async deleteComment(commentId) {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  },

  /**
   * Toggle like on a comment
   * @param {string} commentId - The comment ID
   * @returns {Promise<Object>} Updated like count and status
   */
  async toggleLike(commentId) {
    // First check if the user has already liked this comment
    const { data: existingLike, error: checkError } = await supabase
      .from('comment_likes')
      .select('id')
      .eq('comment_id', commentId)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking like status:', checkError);
      throw checkError;
    }

    let error;
    if (existingLike) {
      // Unlike if already liked
      ({ error } = await supabase
        .from('comment_likes')
        .delete()
        .eq('id', existingLike.id));
    } else {
      // Like if not already liked
      ({ error } = await supabase
        .from('comment_likes')
        .insert([{ comment_id: commentId }]));
    }

    if (error) {
      console.error('Error toggling like:', error);
      throw error;
    }

    // Get updated like count
    const { data: likes, error: countError } = await supabase
      .from('comment_likes')
      .select('id')
      .eq('comment_id', commentId);

    if (countError) {
      console.error('Error getting updated like count:', countError);
      throw countError;
    }

    return {
      liked: !existingLike,
      likes: likes.length
    };
  },

  /**
   * Check if user has liked a comment
   * @param {string} commentId - The comment ID
   * @returns {Promise<boolean>} Whether the user has liked the comment
   */
  async hasLiked(commentId) {
    const { data, error } = await supabase
      .from('comment_likes')
      .select('id')
      .eq('comment_id', commentId)
      .maybeSingle();

    if (error) {
      console.error('Error checking like status:', error);
      throw error;
    }

    return !!data;
  }
};

export default commentService; 