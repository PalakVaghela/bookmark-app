import BookmarkCard from "@/components/dashboard/bookmark-card";
import type { Bookmark } from "@/types/bookmark";

type BookmarkListProps = {
  bookmarks: Bookmark[];
  emptyMessage: string;
  editingId: string | null;
  onEdit: (id: string) => void;
  onCancelEdit: () => void;
  updateAction: (formData: FormData) => void;
  deleteAction: (formData: FormData) => void;
  updateError?: string;
  deleteError?: string;
};

export default function BookmarkList({
  bookmarks,
  emptyMessage,
  editingId,
  onEdit,
  onCancelEdit,
  updateAction,
  deleteAction,
  updateError,
  deleteError,
}: BookmarkListProps) {
  return (
    <div className="mt-8 flex w-full max-w-md flex-col gap-3">
      <h2 className="text-xl font-semibold">Your bookmarks</h2>

      {updateError ? (
        <p className="text-sm text-red-600">{updateError}</p>
      ) : null}

      {deleteError ? (
        <p className="text-sm text-red-600">{deleteError}</p>
      ) : null}

      {bookmarks.length === 0 ? (
        <p className="text-sm text-gray-500">{emptyMessage}</p>
      ) : (
        bookmarks.map((bookmark) => (
          <BookmarkCard
            key={bookmark.id}
            bookmark={bookmark}
            editingId={editingId}
            onEdit={onEdit}
            onCancelEdit={onCancelEdit}
            updateAction={updateAction}
            deleteAction={deleteAction}
          />
        ))
      )}
    </div>
  );
}
