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
  // Custom fields for guest mode
  reporter_name?: string;
  reporter_contact?: string;
}

export interface AiMatchResult {
  id: number;
  similarity: number;
  match_percentage?: number;
  justification?: string;
  item?: Item;
}
