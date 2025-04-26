# Zamon AI Landing Page

This project uses React for the frontend and Supabase for the backend, providing a complete solution for content management and user authentication.

## Features

- User authentication
- Admin dashboard for content management
- Article/blog system with CRUD operations
- Media management

## Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Create the following tables in your Supabase database:
   - `profiles` - Stores user profile information
   - `articles` - Stores article content
   - `article_likes` - Tracks article likes
   - `comments` - Stores article comments

3. Create storage buckets:
   - `media` for article images
   - `avatars` for user avatars

4. Get your Supabase URL and anon key from the API settings

## Project Setup

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/zamon-ai-landing.git
   cd zamon-ai-landing
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your Supabase credentials
   ```
   REACT_APP_SUPABASE_URL=your-supabase-url
   REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Start the development server
   ```bash
   npm start
   ```

## Services

The project contains the following service files to interact with Supabase:

- `src/services/supabase.js` - Supabase client configuration
- `src/services/authService.js` - Authentication functions
- `src/services/articleService.js` - Article management functions
