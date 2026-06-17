import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAdmin } from "@/context/AdminContext";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  Code2,
  ChevronDown,
  ChevronsRight,
  Bell,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
}

/* ─── Sidebar Navigation Item ─── */
const SidebarOption = ({
  Icon,
  title,
  isActive,
  onClick,
  open,
  notifs,
}: {
  Icon: React.ElementType;
  title: string;
  isActive: boolean;
  onClick: () => void;
  open: boolean;
  notifs?: number;
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex h-11 w-full items-center rounded-lg transition-all duration-200",
        isActive
          ? "bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 shadow-sm border-l-[3px] border-blue-500"
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
      )}
    >
      <div className="grid h-full w-12 shrink-0 place-content-center">
        <Icon className="h-[18px] w-[18px]" />
      </div>

      {open && (
        <span className="text-sm font-medium truncate transition-opacity duration-200">
          {title}
        </span>
      )}

      {notifs != null && notifs > 0 && open && (
        <span className="absolute right-3 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-500 dark:bg-blue-600 px-1.5 text-[10px] text-white font-semibold">
          {notifs}
        </span>
      )}

      {notifs != null && notifs > 0 && !open && (
        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500" />
      )}
    </button>
  );
};

/* ─── Sidebar Title / Brand ─── */
const SidebarTitle = ({ open }: { open: boolean }) => {
  return (
    <div className="mb-5 border-b border-gray-200 dark:border-gray-800 pb-4">
      <div className="flex cursor-pointer items-center justify-between rounded-lg p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
        <div className="flex items-center gap-3">
          {/* Firanta Logo — same as homepage */}
          <div className="size-10 shrink-0 rounded-lg bg-gray-900 dark:bg-gray-800 flex items-center justify-center overflow-hidden shadow-sm">
            <img
              src="https://i.ibb.co.com/jv0RgTpF/logobrandv1.png"
              alt="Firanta Logo"
              className="w-8 h-8 object-contain"
              style={{ mixBlendMode: "screen" }}
            />
          </div>
          {open && (
            <div className="transition-opacity duration-200">
              <span className="block text-sm font-bold text-gray-900 dark:text-gray-100">
                Firanta Store
              </span>
              <span className="block text-xs text-gray-500 dark:text-gray-400">
                Admin Panel
              </span>
            </div>
          )}
        </div>
        {open && (
          <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />
        )}
      </div>
    </div>
  );
};

/* ─── Sidebar Toggle ─── */
const SidebarToggle = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) => {
  return (
    <button
      onClick={() => setOpen(!open)}
      className="absolute bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-800 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
    >
      <div className="flex items-center p-3">
        <div className="grid size-10 shrink-0 place-content-center">
          <ChevronsRight
            className={cn(
              "h-4 w-4 transition-transform duration-300 text-gray-500 dark:text-gray-400",
              open && "rotate-180"
            )}
          />
        </div>
        {open && (
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-opacity duration-200">
            Tutup
          </span>
        )}
      </div>
    </button>
  );
};

/* ─── Main AdminLayout ─── */
export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { logout, adminUser } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
    { label: "Pesanan", icon: ShoppingCart, href: "/admin/orders" },
    { label: "Template", icon: Package, href: "/admin/templates" },
    { label: "Portofolio", icon: Code2, href: "/admin/samples" },
    { label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/admin/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div
      className="flex min-h-screen w-full"
      style={{
        /* Override dark-by-default CSS vars for admin area */
        "--background": "0 0% 97%",
        "--foreground": "224 10% 15%",
        "--card": "0 0% 100%",
        "--card-foreground": "224 10% 15%",
        "--popover": "0 0% 100%",
        "--popover-foreground": "224 10% 15%",
        "--primary": "220 70% 55%",
        "--primary-foreground": "0 0% 100%",
        "--secondary": "220 10% 95%",
        "--secondary-foreground": "224 10% 15%",
        "--muted": "220 10% 95%",
        "--muted-foreground": "220 5% 45%",
        "--accent": "220 10% 93%",
        "--accent-foreground": "224 10% 15%",
        "--border": "220 13% 90%",
        "--input": "220 13% 90%",
        "--ring": "220 70% 55%",
        "--destructive": "0 84% 60%",
        "--destructive-foreground": "0 0% 100%",
      } as React.CSSProperties}
    >
      <div className="flex w-full bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        {/* ═══ Sidebar ═══ */}
        <nav
          className={cn(
            "sticky top-0 h-screen shrink-0 border-r transition-all duration-300 ease-in-out",
            sidebarOpen ? "w-64" : "w-16",
            "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-2 shadow-sm"
          )}
        >
          <SidebarTitle open={sidebarOpen} />

          {/* Main nav */}
          <div className="space-y-1 mb-6">
            {menuItems.map((item) => (
              <SidebarOption
                key={item.href}
                Icon={item.icon}
                title={item.label}
                isActive={location.pathname === item.href}
                onClick={() => navigate(item.href)}
                open={sidebarOpen}
                notifs={
                  item.href === "/admin/orders" ? undefined : undefined
                }
              />
            ))}
          </div>

          {/* Account section */}
          {sidebarOpen && (
            <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-1">
              <div className="px-3 py-2 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Akun
              </div>
              <SidebarOption
                Icon={Settings}
                title="Pengaturan"
                isActive={location.pathname === "/admin/settings"}
                onClick={() => navigate("/admin/settings")}
                open={sidebarOpen}
              />
              <SidebarOption
                Icon={ExternalLink}
                title="Lihat Website"
                isActive={false}
                onClick={() => window.open("/", "_blank")}
                open={sidebarOpen}
              />
              <SidebarOption
                Icon={HelpCircle}
                title="Bantuan"
                isActive={false}
                onClick={() => {}}
                open={sidebarOpen}
              />
            </div>
          )}

          {/* Collapsed: show settings & logout as icons only */}
          {!sidebarOpen && (
            <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-1">
              <SidebarOption
                Icon={Settings}
                title="Pengaturan"
                isActive={location.pathname === "/admin/settings"}
                onClick={() => navigate("/admin/settings")}
                open={false}
              />
              <SidebarOption
                Icon={ExternalLink}
                title="Lihat Website"
                isActive={false}
                onClick={() => window.open("/", "_blank")}
                open={false}
              />
            </div>
          )}

          {/* Logout - above toggle */}
          <div className="absolute bottom-14 left-0 right-0 px-2">
            <button
              onClick={handleLogout}
              className={cn(
                "flex h-11 w-full items-center rounded-lg transition-all duration-200",
                "text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700"
              )}
            >
              <div className="grid h-full w-12 shrink-0 place-content-center">
                <LogOut className="h-[18px] w-[18px]" />
              </div>
              {sidebarOpen && (
                <span className="text-sm font-medium">Logout</span>
              )}
            </button>
          </div>

          <SidebarToggle open={sidebarOpen} setOpen={setSidebarOpen} />
        </nav>

        {/* ═══ Main Content Area ═══ */}
        <div className="flex-1 overflow-auto">
          {/* Top Bar */}
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-6 py-3">
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Admin Panel
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {/* Notification bell */}
              <button className="relative p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900" />
              </button>

              {/* Admin avatar */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {adminUser?.name?.charAt(0)?.toUpperCase() || adminUser?.email?.charAt(0)?.toUpperCase() || "A"}
                </div>
                {sidebarOpen && (
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
                    {adminUser?.name || adminUser?.email?.split("@")[0] || "Admin"}
                  </span>
                )}
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
