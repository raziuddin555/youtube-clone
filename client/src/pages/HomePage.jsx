// client/src/pages/HomePage.jsx
// Rubric: Home Page UI/UX (40 marks) + Search & Filter (40 marks)
// TICKET-FE-04 (grid/filter) + TICKET-FE-05 (search)
//
// Header/Sidebar are now rendered once by Layout.jsx (see App.jsx route tree),
// not here — this page is just the filter bar + video grid.
//
// search/category live in the URL (via useSearchParams) instead of local state.
// This fixes two things at once: Sidebar's category links actually work now
// (they navigate to /?category=X, and this reads that), and search results are
// shareable/survive a refresh instead of resetting.

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import FilterBar from "../components/video/FilterBar.jsx";
import VideoGrid from "../components/video/VideoGrid.jsx";
import { getVideos } from "../services/videoService.js";
import { useDebounce } from "../hooks/useDebounce.js";

function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const activeCategory = searchParams.get("category") || "";

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Debounce the search term before hitting the API. The URL itself updates
  // instantly (Layout writes it on every keystroke) — this debounce only
  // guards the network call, so typing fast doesn't fire a request per letter.
  const debouncedSearch = useDebounce(searchQuery, 400);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    const params = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (activeCategory)  params.category = activeCategory;

    getVideos(params)
      .then((res) => {
        if (!cancelled) setVideos(res.data.videos);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [debouncedSearch, activeCategory]);

  const handleCategorySelect = (cat) => {
    // Clearing search when a category is picked mirrors the original behaviour
    // (search and category filter are mutually exclusive, not combined).
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (cat) next.set("category", cat);
        else next.delete("category");
        next.delete("search");
        return next;
      },
      { replace: true }
    );
  };

  return (
    <>
      <FilterBar
        activeCategory={activeCategory || "All"}
        onSelectCategory={handleCategorySelect}
      />
      <VideoGrid videos={videos} loading={loading} error={error} />
    </>
  );
}

export default HomePage;
