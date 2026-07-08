// components/comments/CommentSection.jsx — FE-06
// Full CRUD: add, list, edit (inline), delete.
import CommentForm from "./CommentForm.jsx";
import CommentItem from "./CommentItem.jsx";
import { useAuth } from "../../hooks/useAuth.js";

function CommentSection({ videoId, comments = [], onAdd, onEdit, onDelete }) {
  const { user } = useAuth();

  return (
    <div className="comment-section">
      <h3 className="cs-title">{comments.length} Comment{comments.length !== 1 ? "s" : ""}</h3>

      {/* Add comment */}
      <CommentForm
        onSubmit={(text) => onAdd(videoId, text)}
        submitLabel="Comment"
      />

      {/* Comment list */}
      <div className="cs-list">
        {comments.length === 0 ? (
          <p className="cs-empty">No comments yet. Be the first!</p>
        ) : (
          comments.map((c) => (
            <CommentItem
              key={c._id}
              comment={c}
              isOwner={user && c.user?._id === user._id}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default CommentSection;
