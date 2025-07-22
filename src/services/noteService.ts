import axios from "axios";
import type { AxiosResponse } from "axios";
import type { Note, NoteTag } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api/notes";

const token = import.meta.env.VITE_NOTEHUB_TOKEN;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  totalNotes: number;
}

export interface CreateNoteParams {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface DeleteNoteResponse {
  message: string;
  deletedNoteId: number;
}

export const fetchNotes = async ({
  page,
  perPage,
  search = "",
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = { page, perPage };

  if (search) {
    params.search = search;
  }

  const response: AxiosResponse<FetchNotesResponse> = await axiosInstance.get(
    "",
    { params }
  );
  return response.data;
};

export const createNote = async (noteData: CreateNoteParams): Promise<Note> => {
  const response: AxiosResponse<Note> = await axiosInstance.post("", noteData);
  return response.data;
};

export const deleteNote = async (id: number): Promise<DeleteNoteResponse> => {
  const response = await axiosInstance.delete<DeleteNoteResponse>(`/${id}`);
  return response.data;
};
