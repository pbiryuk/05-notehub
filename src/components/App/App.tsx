import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { fetchNotes } from "../../services/noteService";
import type { Note } from "../../types/note";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import css from "./App.module.css";

const PER_PAGE = 12;

interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

export default function App() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedSearchTerm = useDebouncedValue(searchTerm, 500);

  const { data, isLoading, isError, error } = useQuery<NotesResponse, Error>({
    queryKey: ["notes", page, debouncedSearchTerm],
    queryFn: () =>
      fetchNotes({ page, perPage: PER_PAGE, search: debouncedSearchTerm }),
    placeholderData: keepPreviousData,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearchChange = (value: string) => {
    setPage(1);
    setSearchTerm(value);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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

      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}

      {isModalOpen && (
        <Modal isOpen={true} onClose={closeModal}>
          <NoteForm
            initialValues={{ title: "", content: "", tag: "Todo" }}
            onCancel={closeModal}
          />
        </Modal>
      )}
    </div>
  );
}
