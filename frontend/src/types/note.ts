export interface Note {
  id: number;
  title: string;
  content: string;
  summary: string | null;
  similarity_score?: number;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success?: boolean;
  message?: string;
  data?: {
    errors?: Record<string, string[]>;
  };
  errors?: Record<string, string[]>;
}

export interface NotePayload {
  title: string;
  content: string;
}

export interface SearchPayload {
  query: string;
}
