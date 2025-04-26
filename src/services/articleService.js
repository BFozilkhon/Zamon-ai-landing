import { supabase } from './supabase';

/**
 * Transform snake_case keys to camelCase
 * @param {Object} data - The data with snake_case keys
 * @returns {Object} - The data with camelCase keys
 */
const transformToCamelCase = (data) => {
  if (!data) return data;
  
  if (Array.isArray(data)) {
    return data.map(transformToCamelCase);
  }
  
  if (typeof data !== 'object' || data === null) {
    return data;
  }
  
  const transformed = {};
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      transformed[camelKey] = transformToCamelCase(data[key]);
    }
  }
  
  return transformed;
};

/**
 * Article service for handling all Supabase operations related to articles
 */
const articleService = {
  /**
   * Get articles with pagination and filtering
   * 
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Articles with pagination info
   */
  async getArticles({ 
    page = 1, 
    limit = 10, 
    status, 
    category, 
    tag, 
    search,
    sort = 'created_at:desc'
  } = {}) {
    // Parse sort parameter
    const [sortField, sortOrder] = sort.split(':');
    const ascOrDesc = sortOrder === 'asc';
    
    // Calculate range for pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Start query
    let query = supabase
      .from('articles')
      .select('*', { count: 'exact' });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    } else {
      // Default to published articles for public view
      query = query.eq('status', 'published');
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (tag) {
      query = query.contains('tags', [tag]);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%,excerpt.ilike.%${search}%`);
    }

    // Apply pagination and sorting
    const { data, error, count } = await query
      .order(sortField, { ascending: ascOrDesc })
      .range(from, to);

    if (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }

    // Transform snake_case to camelCase
    const transformedData = transformToCamelCase(data);

    return {
      articles: transformedData,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalArticles: count
    };
  },

  /**
   * Get an article by ID
   * 
   * @param {string} id - Article ID
   * @returns {Promise<Object>} The article
   */
  async getArticleById(id) {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching article:', error);
      throw error;
    }

    // Increment view count
    await this.incrementViewCount(id);

    // Transform snake_case to camelCase
    return transformToCamelCase(data);
  },

  /**
   * Get an article by slug
   * 
   * @param {string} slug - Article slug
   * @returns {Promise<Object>} The article
   */
  async getArticleBySlug(slug) {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching article by slug:', error);
      throw error;
    }

    // Increment view count
    await this.incrementViewCount(data.id);

    // Transform snake_case to camelCase
    return transformToCamelCase(data);
  },

  /**
   * Create a new article
   * 
   * @param {Object} article - Article data
   * @returns {Promise<Object>} The created article
   */
  async createArticle(article) {
    // Map camelCase to snake_case for DB
    const {
      featuredImage,
      ...rest
    } = article;
    
    // Convert all camelCase keys to snake_case
    const dbArticle = {};
    
    // Process all fields with snake_case conversion
    for (const key in rest) {
      if (Object.prototype.hasOwnProperty.call(rest, key)) {
        // Convert camelCase to snake_case
        const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        dbArticle[snakeKey] = rest[key];
      }
    }
    
    // Add standard fields
    dbArticle.created_at = new Date().toISOString();
    dbArticle.updated_at = new Date().toISOString();
    
    // Add featured_image if provided
    if (featuredImage !== undefined) {
      dbArticle.featured_image = featuredImage;
    }
    
    const { data, error } = await supabase
      .from('articles')
      .insert([dbArticle])
      .select('*');

    if (error) {
      console.error('Error creating article:', error);
      throw error;
    }

    // Transform snake_case to camelCase
    return transformToCamelCase(data[0]);
  },

  /**
   * Update an existing article
   * 
   * @param {string} id - Article ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} The updated article
   */
  async updateArticle(id, updates) {
    // Map camelCase to snake_case for DB
    const {
      featuredImage,
      createdAt, // Explicitly exclude createdAt from updates
      ...rest
    } = updates;
    
    // Convert all camelCase keys to snake_case
    const dbUpdates = {};
    
    // Process all other fields with snake_case conversion
    for (const key in rest) {
      if (Object.prototype.hasOwnProperty.call(rest, key)) {
        // Convert camelCase to snake_case
        const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        dbUpdates[snakeKey] = rest[key];
      }
    }
    
    // Add the updated_at timestamp
    dbUpdates.updated_at = new Date().toISOString();
    
    // Only include featured_image if it exists in the updates
    if (featuredImage !== undefined) {
      dbUpdates.featured_image = featuredImage;
    }
    
    const { data, error } = await supabase
      .from('articles')
      .update(dbUpdates)
      .eq('id', id)
      .select('*');

    if (error) {
      console.error('Error updating article:', error);
      throw error;
    }

    // Transform snake_case to camelCase
    return transformToCamelCase(data[0]);
  },

  /**
   * Delete an article
   * 
   * @param {string} id - Article ID
   * @returns {Promise<void>}
   */
  async deleteArticle(id) {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting article:', error);
      throw error;
    }

    return true;
  },

  /**
   * Toggle like on an article
   * 
   * @param {string} articleId - Article ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Like status and count
   */
  async toggleLike(articleId, userId) {
    // Check if user already liked the article
    const { data: existingLike, error: checkError } = await supabase
      .from('article_likes')
      .select('*')
      .eq('article_id', articleId)
      .eq('user_id', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "No rows returned"
      console.error('Error checking like status:', checkError);
      throw checkError;
    }

    // If like exists, remove it; otherwise, add it
    if (existingLike) {
      const { error: deleteError } = await supabase
        .from('article_likes')
        .delete()
        .eq('id', existingLike.id);

      if (deleteError) {
        console.error('Error removing like:', deleteError);
        throw deleteError;
      }
    } else {
      const { error: insertError } = await supabase
        .from('article_likes')
        .insert([
          {
            article_id: articleId,
            user_id: userId
          }
        ]);

      if (insertError) {
        console.error('Error adding like:', insertError);
        throw insertError;
      }
    }

    // Get updated like count
    const { count, error: countError } = await supabase
      .from('article_likes')
      .select('*', { count: 'exact' })
      .eq('article_id', articleId);

    if (countError) {
      console.error('Error counting likes:', countError);
      throw countError;
    }

    return {
      liked: !existingLike,
      likeCount: count
    };
  },

  /**
   * Get categories with article counts
   * 
   * @returns {Promise<Array>} Categories with counts
   */
  async getCategories() {
    const { data, error } = await supabase
      .rpc('get_category_counts');

    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }

    return data;
  },

  /**
   * Get tags with article counts
   * 
   * @returns {Promise<Array>} Tags with counts
   */
  async getTags() {
    const { data, error } = await supabase
      .rpc('get_tag_counts');

    if (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }

    return data;
  },

  /**
   * Get articles by user
   * 
   * @param {string} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Articles with pagination info
   */
  async getArticlesByUser(userId, { page = 1, limit = 10 } = {}) {
    // Calculate range for pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from('articles')
      .select('*, author:user_id(*)', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error fetching user articles:', error);
      throw error;
    }

    // Transform snake_case to camelCase
    const transformedData = transformToCamelCase(data);
    
    return {
      articles: transformedData,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalArticles: count
    };
  },

  /**
   * Increment the view count for an article
   * 
   * @param {string} id - Article ID
   * @returns {Promise<void>}
   */
  async incrementViewCount(id) {
    const { error } = await supabase.rpc('increment_article_views', { article_id: id });
    
    if (error) {
      console.error('Error incrementing view count:', error);
      // Don't throw, just log - view count is non-critical
    }
  },

  /**
   * Check if the storage bucket exists
   * @returns {Promise<boolean>} Whether the bucket is accessible
   */
  async checkMediaBucket() {
    try {
      // Try to list files in the media bucket to check if it exists and is accessible
      const { data, error } = await supabase.storage
        .from('media')
        .list('', { limit: 1 });
      
      if (error) {
        console.error('Error accessing media bucket:', error);
        
        // Special handling for common errors
        if (error.message.includes('does not exist')) {
          console.error('Media bucket does not exist. Please create it in the Supabase dashboard.');
        } else if (error.message.includes('security policy')) {
          console.error('Row-level security prevents access to the media bucket. Check permissions in Supabase.');
        }
        
        return false;
      }
      
      console.log('Media bucket is accessible');
      return true;
    } catch (error) {
      console.error('Error checking media bucket:', error);
      return false;
    }
  },

  /**
   * Upload featured image for an article
   * 
   * @param {File} file - Image file
   * @returns {Promise<string>} URL of the uploaded image
   */
  async uploadImage(file) {
    try {
      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `article-images/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        if (uploadError.message.includes('bucket not found')) {
          throw new Error(
            'The media storage bucket does not exist. Please contact your administrator to create a public storage bucket named "media".'
          );
        }
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      if (!data || !data.publicUrl) {
        throw new Error('Failed to get public URL for uploaded image');
      }

      return data.publicUrl;
    } catch (error) {
      console.error('Error in image upload process:', error);
      throw error;
    }
  }
};

export default articleService; 