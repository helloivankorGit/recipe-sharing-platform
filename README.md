# 🍳 Recipe Sharing Platform

A modern, full-stack recipe sharing application built with Next.js, TypeScript, and Supabase. Share your favorite recipes, discover new dishes, and build a community of food lovers!

## 🚀 Live Demo

**🔗 [Try it live on Vercel](https://recipe-sharing-platform-uyy6.vercel.app/)**

<img width="1085" height="781" alt="image" src="https://github.com/user-attachments/assets/ae69c4cb-5d53-44ba-9cec-827b79073af6" />
*Landing page with clean, modern design*

## ✨ Features

### 🔐 Authentication System
- **User Registration & Login** - Secure authentication powered by Supabase
- **Profile Management** - Personalized user profiles
- **Session Management** - Persistent login sessions

<img width="1095" height="503" alt="image" src="https://github.com/user-attachments/assets/35c83516-3e1f-4221-bb5f-79f55936dad7" />
*Seamless login and registration experience*

### 📝 Recipe Management
- **Create Recipes** - Rich recipe creation with dynamic ingredient fields
- **Edit Recipes** - Full editing capabilities for recipe owners
- **Recipe Categories** - Organize recipes by type (Breakfast, Dinner, Dessert, etc.)
- **Difficulty Levels** - Easy, Medium, Hard classification
- **Cooking Time** - Track preparation and cooking time

<img width="1082" height="926" alt="image" src="https://github.com/user-attachments/assets/6ace8651-bd8c-4b84-8b8c-05120a9649a4" />
*Intuitive recipe creation form with dynamic ingredients*

### 🌟 Community Features
- **Browse All Recipes** - Discover recipes from the entire community
- **Like/Save System** - Save favorite recipes for later
- **Saved Recipes Page** - Personal collection of liked recipes
- **Comments** - Engage with recipe creators and share feedback
- **Author Attribution** - See who created each recipe

<img width="1000" height="675" alt="image" src="https://github.com/user-attachments/assets/feb8ee73-6b14-447f-a360-94f2059c723d" />
*Beautiful grid layout showcasing community recipes*

### 💬 Interactive Elements
- **Recipe Comments** - Comment on recipes and engage with the community
- **Comment Moderation** - Recipe authors can delete comments on their recipes
- **Like Counter** - Real-time like counts with heart animations
- **Responsive Design** - Perfect experience on mobile and desktop

<img width="996" height="954" alt="image" src="https://github.com/user-attachments/assets/4b281e60-5a8a-4617-b0d6-57a3d5e25eaa" />
*Detailed recipe view with ingredients, instructions, and interactions*

### 🔍 Search & Filtering
- **Smart Search** - Search recipes by title, description, or category with real-time results
- **Category Filter** - Filter recipes by category (dynamically populated from existing recipes)
- **Difficulty Filter** - Filter by difficulty level (Easy, Medium, Hard)
- **Combined Filters** - Use multiple filters simultaneously for precise recipe discovery
- **Filter Results Counter** - See how many recipes match your current filters
- **Clear All Filters** - Quick reset to view all recipes
- **Available on All Pages** - Search and filter on Browse, My Recipes, and Saved Recipes pages

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **Deployment**: Vercel
- **Styling**: Tailwind CSS with custom components

## 🗃️ Database Schema

### Tables
- **profiles** - User profile information
- **recipes** - Recipe data with ingredients, instructions, metadata
- **recipe_likes** - Like/save functionality
- **recipe_comments** - Comment system with moderation

<img width="955" height="704" alt="image" src="https://github.com/user-attachments/assets/5ca68508-33fb-49bc-8861-9cd783d0145b" />
*Clean, normalized database design*

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm
- Supabase account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/helloivankorGit/recipe-sharing-platform.git
cd recipe-sharing-platform
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.local.example .env.local
```

Add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. **Set up the database**

Run the following SQL commands in your Supabase SQL editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create recipes table
CREATE TABLE recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  ingredients TEXT NOT NULL,
  instructions TEXT NOT NULL,
  cooking_time INTEGER,
  difficulty TEXT,
  category TEXT
);

-- Create recipe_likes table
CREATE TABLE recipe_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(recipe_id, user_id)
);

-- Create recipe_comments table
CREATE TABLE recipe_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_recipes_user_id ON recipes(user_id);
CREATE INDEX idx_recipes_created_at ON recipes(created_at DESC);
CREATE INDEX idx_recipe_likes_recipe_id ON recipe_likes(recipe_id);
CREATE INDEX idx_recipe_likes_user_id ON recipe_likes(user_id);
CREATE INDEX idx_recipe_comments_recipe_id ON recipe_comments(recipe_id);
CREATE INDEX idx_recipe_comments_created_at ON recipe_comments(created_at DESC);
```

5. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000) to see the application.


## 🔧 Project Structure

```
recipe-sharing-platform/
├── app/
│   ├── browse/              # Browse all community recipes
│   ├── components/          # Reusable UI components
│   ├── create/              # Recipe creation page
│   ├── login/               # Authentication pages
│   ├── my-recipes/          # User's own recipes
│   ├── recipes/[id]/        # Recipe details & editing
│   ├── saved-recipes/       # User's saved/liked recipes
│   └── types/               # TypeScript type definitions
├── lib/
│   ├── database.types.ts    # Supabase type definitions
│   └── supabaseClient.ts    # Supabase configuration
└── public/                  # Static assets
```

## 🎯 Key Features Explained

### Dynamic Ingredient Management
- Add unlimited ingredients with the "+" button
- Remove ingredients (except the first one)
- Real-time form validation

### Smart Recipe Display
- Responsive 3-column grid on desktop, stacked on mobile
- Author attribution with profile information
- Like counts and save functionality
- Category and difficulty badges

### Advanced Comment System
- Threaded comments with timestamps
- Author moderation capabilities
- Real-time updates
- Profile integration

## 🚀 Deployment

### Deploy to Vercel

1. **Connect to Vercel**
```bash
npm install -g vercel
vercel
```

2. **Add environment variables** in the Vercel dashboard
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Deploy**
```bash
vercel --prod
```

### Alternative: Deploy to Netlify

1. **Build the project**
```bash
npm run build
```

2. **Deploy the `out` folder** to Netlify

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database and Auth powered by [Supabase](https://supabase.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Deployed on [Vercel](https://vercel.com/)

---

**Happy Cooking! 👨‍🍳👩‍🍳**
