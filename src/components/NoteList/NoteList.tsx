import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseMutationResult } from "@tanstack/react-query";
import { deleteNote } from "../../services/noteService";
import type { Note } from "../../types/note";
import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const deleteMutation: UseMutationResult<unknown, Error, number> = useMutation(
    {
      mutationFn: deleteNote,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["notes"] });
      },
    }
  );

  if (notes.length === 0) return null;

  return (
    <ul className={css.list}>
      {notes.map(({ id, title, content, tag }) => (
        <li key={id} className={css.listItem}>
          <h2 className={css.title}>{title}</h2>
          <p className={css.content}>{content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{tag}</span>
            <button
              className={css.button}
              onClick={() => deleteMutation.mutate(id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}{" "}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
