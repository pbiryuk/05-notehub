import React, { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { fetchNotes, createNote, deleteNote } from "../../services/noteService";
import type { DeleteNoteResponse } from "../../services/noteService";
import type { Note, NoteTag } from "../../types/note";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import css from "./App.module.css";

const PER_PAGE = 12;

interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

const App: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedSearchTerm = useDebouncedValue(searchTerm, 500);

  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<NotesResponse, Error>({
    queryKey: ["notes", page, debouncedSearchTerm],
    queryFn: () =>
      fetchNotes({ page, perPage: PER_PAGE, search: debouncedSearchTerm }),
    placeholderData: keepPreviousData,
  });

  const deleteMutation = useMutation<DeleteNoteResponse, Error, string>({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const createMutation = useMutation<
    Note,
    Error,
    { title: string; content: string; tag: NoteTag }
  >({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      closeModal();
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearchChange = (value: string) => {
    setPage(1);
    setSearchTerm(value);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleCreateNote = (
    values: { title: string; content: string; tag: NoteTag },
    { resetForm }: { resetForm: () => void }
  ) => {
    createMutation.mutate(values, {
      onSuccess: () => resetForm(),
    });
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchTerm} onChange={handleSearchChange} />
        {data && data.totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={data.totalPages}
            onPageChange={handlePageChange}
          />
        )}
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>

      {isLoading && <Loader />}
      {isError && (
        <ErrorMessage message={error?.message || "Error loading notes"} />
      )}

      {data && data.notes.length > 0 && (
        <NoteList notes={data.notes} onDelete={handleDelete} />
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <NoteForm
          initialValues={{ title: "", content: "", tag: "Todo" }}
          onSubmit={handleCreateNote}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
};

export default App;
