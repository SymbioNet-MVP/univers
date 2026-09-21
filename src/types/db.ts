export type InstitutionType =
  | 'School'
  | 'University'
  | 'Academy'
  | 'Learning Organization';

export type EducationLevel =
  | 'High School'
  | 'Undergraduate'
  | 'Graduate'
  | 'PhD'
  | 'Alumni'
  | 'Mentor'
  | 'Lifelong Learner';

export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';
export type RequestStatus = 'pending' | 'accepted' | 'declined' | 'cancelled';
export type PostType = 'Question' | 'Study Goal' | 'Looking for Buddy' | 'Resource Share';

export interface Institution {
  id: string;
  name: string;
  country: string;
  domain: string | null;
  type: InstitutionType;
  verified: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  country: string | null;
  institution_id: string | null;
  institution_text: string | null;
  field_of_study: string | null;
  education_level: EducationLevel | null;
  languages: string[];
  timezone: string | null;
  interests: string[];
  skills: string[];
  goals: string | null;
  bio: string | null;
  verification: VerificationStatus;
  onboarding_completed: boolean;
  referral_code: string | null;
  referred_by: string | null;
  is_founder: boolean;
  created_at: string;
  updated_at: string;
}

export type InviteStatus = 'pending' | 'joined';

export interface Invite {
  id: string;
  inviter_id: string;
  code: string;
  invited_email: string | null;
  visitor_id: string | null;
  invitee_id: string | null;
  status: InviteStatus;
  created_at: string;
  joined_at: string | null;
}

export interface MatchFlags {
  same_field: boolean;
  same_language: boolean;
  same_level: boolean;
  same_institution: boolean;
  same_timezone: boolean;
  same_country: boolean;
  same_interests: boolean;
}

export interface MatchSuggestion {
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  country: string | null;
  institution_name: string | null;
  field_of_study: string | null;
  education_level: EducationLevel | null;
  languages: string[];
  timezone: string | null;
  goals: string | null;
  bio: string | null;
  verification: VerificationStatus;
  shared_interests: string[];
  score: number;
  matching: MatchFlags;
}

export interface MatchRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string | null;
  status: RequestStatus;
  created_at: string;
  responded_at: string | null;
}

export interface Conversation {
  id: string;
  match_id: string | null;
  user_a: string;
  user_b: string;
  last_message_at: string;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read_at: string | null;
  created_at: string;
}

export interface CommunityPost {
  id: string;
  author_id: string;
  type: PostType;
  title: string;
  body: string;
  field: string | null;
  created_at: string;
}

export interface CommunityComment {
  id: string;
  post_id: string;
  author_id: string;
  body: string;
  created_at: string;
}