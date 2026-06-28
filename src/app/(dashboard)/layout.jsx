"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../providers/AuthProvider";
import { 
  FiGrid, FiPlusCircle, FiFolder, FiFileText, FiUser, 
  FiUsers, FiCheckSquare, FiDollarSign, FiLogOut, FiMenu, FiX 
} from "react-icons/fi";

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const role = user?.role || "Collaborator";

  const menuItems = {
    Founder: [
      { name: "Overview", path: "/dashboard", icon: <FiGrid /> },
      { name: "My Startup", path: "/dashboard/my-startup", icon: <FiFolder /> },
      { name: "Add Opportunity", path: "/dashboard/add-opportunity", icon: <FiPlusCircle /> },
      { name: "Manage Opportunities", path: "/dashboard/manage-opportunities", icon: <FiFileText /> },
      { name: "Applications", path: "/dashboard/applications", icon: <FiCheckSquare /> },
      
    ],
    Collaborator: [
      { name: "Overview", path: "/dashboard", icon: <FiGrid /> },
      { name: "My Applications", path: "/dashboard/my-applications", icon: <FiFileText /> },
      { name: "Profile", path: "/dashboard/profile", icon: <FiUser /> },
    ],

    admin: [
      { name: "Overview", path: "/dashboard", icon: <FiGrid /> },
      { name: "Manage Users", path: "/dashboard/admin/user", icon: <FiUsers /> },
      { name: "Manage Startups", path: "/dashboard/admin/startups", icon: <FiFolder /> },
      { name: "Transactions", path: "/dashboard/admin/transactions", icon: <FiDollarSign /> },

    ],
  };

  const currentMenu = menuItems[role] || menuItems["Collaborator"];

  const handleLogoutClick = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex">
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-100 p-6 justify-between sticky top-0 h-screen z-20">
        <div className="space-y-8">
          <div className="px-2">
            <Link href="/" className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
              StartupForge
            </Link>
            <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">{role} Panel</p>
          </div>

          <nav className="space-y-1.5">
            {currentMenu.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 group ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                  }`}
                >
                  <span className={`text-lg ${isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600"}`}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <img
              src={user?.image || "https://i.ibb.co/1GZvK7K/user-avatar.png"}
              alt={user?.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
            />
            <div className="truncate max-w-[160px]">
              <p className="text-sm font-semibold text-slate-800 truncate">{user?.name || "User"}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <FiLogOut className="text-lg" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="lg:hidden flex items-center justify-between bg-white border-b border-slate-100 px-6 py-4 sticky top-0 z-30">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            StartupForge
          </Link>
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
          >
            {isMobileOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
          </button>
        </header>

        {isMobileOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
            <aside className="relative flex flex-col w-72 bg-white h-full p-6 justify-between shadow-2xl animate-in slide-in-from-left duration-200">
              <div className="space-y-8">
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    StartupForge
                  </span>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5 uppercase tracking-wider">{role} Panel</p>
                </div>
                <nav className="space-y-1.5">
                  {currentMenu.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                      <Link
                        key={item.name}
                        href={item.path}
                        onClick={() => setIsMobileOpen(false)}
                        className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                          isActive
                            ? "bg-blue-600 text-white shadow-md"
                            : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                        }`}
                      >
                        <span className="text-lg">{item.icon}</span>
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div className="flex items-center gap-3 px-2">
                  <img
                    src={user?.image || "https://i.ibb.co/1GZvK7K/user-avatar.png"}
                    alt={user?.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="truncate max-w-[160px]">
                    <p className="text-sm font-semibold text-slate-800 truncate">{user?.name || "User"}</p>
                    <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsMobileOpen(false);
                    handleLogoutClick();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <FiLogOut className="text-lg" />
                  Logout
                </button>
              </div>
            </aside>
          </div>
        )}

        <main className="flex-1 p-6 lg:p-10 max-w-7xl w-full mx-auto overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}