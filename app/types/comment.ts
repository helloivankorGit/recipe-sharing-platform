export type Comment = {
  id: string;
  recipe_id: string;
  user_id: string;
  comment: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    username: string | null;
    full_name: string | null;
  };
};
