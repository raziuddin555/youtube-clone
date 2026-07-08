// components/layout/Layout.jsx
import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (query) => {
    const params = new URLSearchParams(location.pathname === "/" ? location.search : "");
    if (query) params.set("search", query);
    else params.delete("search");
    params.delete("category");
    navigate({ pathname: "/", search: params.toString() }, { replace: true });
  };

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="yt-app">
      <Header onToggleSidebar={toggleSidebar} onSearch={handleSearch} />
      <div className="yt-body">
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        <main className={`yt-main${sidebarOpen ? " yt-main--sidebar-open" : ""}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
