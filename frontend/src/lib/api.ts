import axios, { AxiosError } from "axios";
import type {
  ApiErrorResponse,
  ApiResponse,
  Note,
  NotePayload,
  SearchPayload,
} from "@/types/note";

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export const apiClient = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data?.message ??
      error.message ??
      "Something went wrong. Please try again."
    );
  }

  return "Something went wrong. Please try again.";
}

export function getFieldErrors(error: unknown) {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return undefined;
  }

  return error.response?.data?.data?.errors ?? error.response?.data?.errors;
}

export type ApiAxiosError = AxiosError<ApiErrorResponse>;

export const notesApi = {
  async list() {
    const response = await apiClient.get<ApiResponse<Note[]>>("/notes");
    return response.data.data;
  },

  async get(id: number | string) {
    const response = await apiClient.get<ApiResponse<Note>>(`/notes/${id}`);
    return response.data.data;
  },

  async create(payload: NotePayload) {
    const response = await apiClient.post<ApiResponse<Note>>("/notes", payload);
    return response.data.data;
  },

  async update(id: number | string, payload: NotePayload) {
    const response = await apiClient.put<ApiResponse<Note>>(`/notes/${id}`, payload);
    return response.data.data;
  },

  async remove(id: number | string) {
    await apiClient.delete<ApiResponse<never>>(`/notes/${id}`);
  },

  async summarize(id: number | string) {
    const response = await apiClient.post<ApiResponse<Note>>(`/notes/${id}/summary`);
    return response.data.data;
  },

  async search(payload: SearchPayload) {
    const response = await apiClient.post<ApiResponse<Note[]>>("/notes/search", payload);
    return response.data.data;
  },
};
