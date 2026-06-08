export type ContentStatus = "pending" | "approved" | "rejected";
export type UserRole = "user" | "business_owner" | "admin";
export type SourceType =
  | "user_submitted"
  | "admin_curated"
  | "community_suggested"
  | "business_claimed"
  | "whatsapp_summary";
export type ItemType = "post" | "business" | "topic";
export type ReportStatus = "pending" | "reviewed" | "dismissed";

export type Profile = {
  id: string;
  user_id: string;
  name: string | null;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
};

export type Post = {
  id: string;
  user_id: string;
  title: string;
  category: string;
  description: string;
  location: string | null;
  whatsapp_number: string | null;
  image_url: string | null;
  status: ContentStatus;
  is_featured: boolean;
  source_type: SourceType;
  view_count: number;
  created_at: string;
  updated_at: string;
};

export type Business = {
  id: string;
  user_id: string;
  owner_name: string | null;
  business_name: string;
  description: string;
  category: string;
  instagram_url: string | null;
  tiktok_url: string | null;
  whatsapp_number: string | null;
  location: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  status: ContentStatus;
  is_featured: boolean;
  source_type: SourceType;
  view_count: number;
  created_at: string;
  updated_at: string;
};

export type CommunityTopic = {
  id: string;
  user_id: string;
  user_name: string | null;
  title: string;
  category: string;
  description: string;
  location: string | null;
  status: ContentStatus;
  is_featured: boolean;
  reply_count: number;
  last_activity_at: string;
  source_type: SourceType;
  created_at: string;
  updated_at: string;
};

export type CommunityReply = {
  id: string;
  topic_id: string;
  user_id: string;
  user_name: string | null;
  message: string;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
};

export type Recommendation = {
  id: string;
  user_id: string | null;
  title: string;
  category: string | null;
  description: string;
  location: string | null;
  instagram_url: string | null;
  whatsapp_number: string | null;
  display_name: string | null;
  show_name: boolean;
  status: ContentStatus;
  source_type: SourceType;
  created_at: string;
  updated_at: string;
};

export type Favorite = {
  id: string;
  user_id: string;
  item_type: ItemType;
  item_id: string;
  created_at: string;
};

export type Report = {
  id: string;
  user_id: string | null;
  item_type: ItemType;
  item_id: string;
  reason: string;
  description: string | null;
  status: ReportStatus;
  created_at: string;
};

export type AdminImport = {
  id: string;
  admin_user_id: string;
  raw_text: string;
  cleaned_summary: string | null;
  default_category: string | null;
  default_location: string | null;
  warning_detected: boolean;
  created_at: string;
};

export type Category = {
  id: string;
  name: string;
  description: string | null;
  emoji: string | null;
  slug: string;
  sort_order: number;
  is_active: boolean;
};

export type Location = {
  id: string;
  name: string;
  sort_order: number;
  is_active: boolean;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
};
