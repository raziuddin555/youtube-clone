// client/src/App.jsx
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import VideoPlayerPage from "./pages/VideoPlayerPage.jsx";
import ChannelPage from "./pages/ChannelPage.jsx";
import UploadVideoPage from "./pages/UploadVideoPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import ShortsPage from "./pages/ShortsPage.jsx";
import SubscriptionsPage from "./pages/SubscriptionsPage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";
import PlaylistsPage from "./pages/PlaylistsPage.jsx";
import PlaylistDetailPage from "./pages/PlaylistDetailPage.jsx";
import WatchLaterPage from "./pages/WatchLaterPage.jsx";
import LikedVideosPage from "./pages/LikedVideosPage.jsx";
import YourVideosPage from "./pages/YourVideosPage.jsx";
import DownloadsPage from "./pages/DownloadsPage.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>
      {/* Login/Register are full-bleed auth screens — no header/sidebar by design */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Everything else shares the Layout (Header + Sidebar) so search and the
          hamburger menu work the same way on every page, not just Home. */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/video/:id" element={<VideoPlayerPage />} />
        <Route path="/channel/:id" element={<ChannelPage />} />
        {/* Shorts is browsable without an account, same as Home */}
        <Route path="/shorts" element={<ShortsPage />} />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadVideoPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload/:id"
          element={
            <ProtectedRoute>
              <UploadVideoPage />
            </ProtectedRoute>
          }
        />

        {/* Everything below is inherently personal — gated behind login,
            matching the sidebar (which hides these links when logged out). */}
        <Route
          path="/subscriptions"
          element={<ProtectedRoute><SubscriptionsPage /></ProtectedRoute>}
        />
        <Route
          path="/history"
          element={<ProtectedRoute><HistoryPage /></ProtectedRoute>}
        />
        <Route
          path="/playlists"
          element={<ProtectedRoute><PlaylistsPage /></ProtectedRoute>}
        />
        <Route
          path="/playlists/:id"
          element={<ProtectedRoute><PlaylistDetailPage /></ProtectedRoute>}
        />
        <Route
          path="/watch-later"
          element={<ProtectedRoute><WatchLaterPage /></ProtectedRoute>}
        />
        <Route
          path="/liked"
          element={<ProtectedRoute><LikedVideosPage /></ProtectedRoute>}
        />
        <Route
          path="/your-videos"
          element={<ProtectedRoute><YourVideosPage /></ProtectedRoute>}
        />
        <Route
          path="/downloads"
          element={<ProtectedRoute><DownloadsPage /></ProtectedRoute>}
        />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
