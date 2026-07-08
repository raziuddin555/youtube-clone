// components/comments/CommentForm.jsx — FE-06
// Works for both "add new" and "edit existing" modes.
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";

function CommentForm({ initialText = "", onSubmit, submitLabel = "Comment", onCancel }) {
  const { isAuthed, user } = useAuth();
  const [text, setText] = useState(initialText);
  const [submitting, setSubmitting] = useState(false);

  // If initialText changes (edit mode reset), sync it
  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  const initials = user?.username?.[0]?.toUpperCase() || "U";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit(text.trim());
      setText("");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthed) {
    return (
      <div className="comment-form comment-form--guest">
        <p>
          <Link to="/login" className="cf-signin-link">Sign in</Link> to leave a comment.
        </p>
      </div>
    );
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <div className="cf-row">
        <div className="cf-avatar">{initials}</div>
        <div className="cf-body">
          <textarea
            className="cf-textarea"
            placeholder="Add a comment…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={2}
            disabled={submitting}
          />
          <div className="cf-actions">
            {onCancel && (
              <button
                type="button"
                className="cf-btn cf-btn--ghost"
                onClick={onCancel}
                disabled={submitting}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="cf-btn cf-btn--primary"
              disabled={!text.trim() || submitting}
            >
              {submitting ? "Saving…" : submitLabel}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default CommentForm;
