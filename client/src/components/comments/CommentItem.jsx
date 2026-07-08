// components/comments/CommentItem.jsx — FE-06
import { useState } from "react";
import CommentForm from "./CommentForm.jsx";
import { formatDate } from "../../utils/formatViews.js";

function CommentItem({ comment, isOwner, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const initials = comment.user?.username?.[0]?.toUpperCase() || "U";

  const handleEditSubmit = async (text) => {
    await onEdit(comment._id, text);
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this comment?")) return;
    setDeleting(true);
    try {
      await onDelete(comment._id);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="comment-item">
      <div className="ci-avatar">{initials}</div>
      <div className="ci-body">
        <div className="ci-meta">
          <span className="ci-username">@{comment.user?.username || "user"}</span>
          <span className="ci-date">{formatDate(comment.createdAt)}</span>
        </div>

        {editing ? (
          <CommentForm
            initialText={comment.text}
            onSubmit={handleEditSubmit}
            submitLabel="Save"
            onCancel={() => setEditing(false)}
          />
        ) : (
          <p className="ci-text">{comment.text}</p>
        )}

        {isOwner && !editing && (
          <div className="ci-actions">
            <button
              className="ci-action-btn"
              onClick={() => setEditing(true)}
              aria-label="Edit comment"
            >
              Edit
            </button>
            <button
              className="ci-action-btn ci-action-btn--delete"
              onClick={handleDelete}
              disabled={deleting}
              aria-label="Delete comment"
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentItem;
