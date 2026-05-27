export interface Profile {
  id: string;
  full_name: string | null;
  whatsapp_number: string | null;
  campus_id: string | null;
}

export interface Item {
  id: number;
  status: 'LOST' | 'FOUND';
  title: string;
  raw_description: string;
  category: string;
  last_location: string;
  date_event: string;
  is_resolved: boolean;
  created_by: string | null; // Can be null for guest mode temporarily, or we store the reporter's name in full_name
  // Custom fields for guest mode
  reporter_name?: string;
  reporter_whatsapp?: string;
}

export interface AiMatchResult {
  id: number;
  similarity: number;
  match_percentage?: number;
  justification?: string;
  item?: Item;
}
