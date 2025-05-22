
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

// Admin Components
import AdminSidebar from "../admin/adminProfile/AdminSidebar";
import AdminNavbar from "../admin/adminProfile/AdminNavbar";

// User Components
import UserNavbar from "../user/navbar/UserNavbar";
import Footer from "../user/footer/Footer";

const Layout = () => {
  const { role } = useSelector((state) => state.auth);

  // Show appropriate layout based on role
  if (role === "admin") {
    return (
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <aside className="w-48 bg-gray-800 text-white fixed min-h-screen">
          <AdminSidebar />
        </aside>

        {/* Main content area */}
        <div className="flex-1 flex flex-col ">
          {/* Top Navbar */}
          <div className="bg-gray-900 text-white p-4 sticky top-0">
            <AdminNavbar />
          </div>
          {/* Outlet renders admin protected routes */}
          <main className="flex-1 ml-52 p-4 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    );
  }

  // 🧑‍💼 Default: User layout for 'user' or unknown roles
  return (
    <div className="min-h-screen flex flex-col">
      {/* User Navbar */}
      <UserNavbar />

      {/* Main Content Area */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;