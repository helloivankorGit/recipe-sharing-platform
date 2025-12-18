export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          full_name: string | null;
          email: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          full_name?: string | null;
          email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          full_name?: string | null;
          email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      recipes: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          title: string;
          description: string | null;
          ingredients: string;
          cooking_time: number | null;
          difficulty: string | null;
          category: string | null;
          instructions: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          title: string;
          description?: string | null;
          ingredients: string;
          cooking_time?: number | null;
          difficulty?: string | null;
          category?: string | null;
          instructions: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          ingredients?: string;
          cooking_time?: number | null;
          difficulty?: string | null;
          category?: string | null;
          instructions?: string;
        };
      };
      recipe_likes: {
        Row: {
          id: string;
          recipe_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          recipe_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          recipe_id?: string;
          user_id?: string;
          created_at?: string;
        };
      };
      recipe_comments: {
        Row: {
          id: string;
          recipe_id: string;
          user_id: string;
          comment: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          recipe_id: string;
          user_id: string;
          comment: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          recipe_id?: string;
          user_id?: string;
          comment?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};


