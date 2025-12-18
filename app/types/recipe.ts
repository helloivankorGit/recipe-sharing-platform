export type Recipe = {
  id: string;
  created_at: string;
  user_id: string;
  title: string;
  description: string | null;
  ingredients: string;
  instructions: string;
  cooking_time: number | null;
  difficulty: string | null;
  category: string | null;
  profiles?: {
    username: string | null;
    full_name: string | null;
  };
};
