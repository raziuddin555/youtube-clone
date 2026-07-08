// components/video/FilterBar.jsx
// Rubric: Filter by Category (20 marks) — at least 6 filter buttons.
// "Points to be Remembered #3": at least 6 filter buttons.
// TICKET-FE-04
//
// Categories come from the shared constant so this list can never drift out
// of sync with what the backend (and UploadVideoPage) actually accept.
// Previously this had its own hardcoded list with 5 categories that don't
// exist on the backend (News/Sports/Movies/Technology/Trending) — clicking
// those always returned zero videos.

import { CATEGORIES } from "../../constants/categories.js";

const FILTER_OPTIONS = ["All", ...CATEGORIES];

function FilterBar({ activeCategory, onSelectCategory }) {
  return (
    <div className="filter-bar">
      {FILTER_OPTIONS.map((cat) => (
        <button
          key={cat}
          className={`filter-btn${activeCategory === cat ? " filter-btn--active" : ""}`}
          onClick={() => onSelectCategory(cat === "All" ? "" : cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export default FilterBar;
