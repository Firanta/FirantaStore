import React, { useEffect, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import {
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  DollarSign,
  Activity,
  Bell,
  Code2,
} from "lucide-react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

/* ─── Types ─── */
interface Order {
  id: string;
  templateName: string;
  userId: string;
  price: number;
  status: "pending" | "completed" | "cancelled" | "failed";
  createdAt: any;
  category?: string;
  option?: string;
  paymentStatus?: string;
  updatedAt?: any;
}

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  completedOrders: number;
  pendingOrders: number;
  totalTemplates: number;
  totalUsers: number;
  totalSamples: number;
  recentOrders: Order[];
}

/* ─── Stat Card Component ─── */
const StatCard = ({
  icon: Icon,
  label,
  value,
  subtitle,
  iconBg,
  iconColor,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtitle?: string;
  iconBg: string;
  iconColor: string;
}) => (
  <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2.5 rounded-lg ${iconBg}`}>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>
      <TrendingUp className="h-4 w-4 text-green-500" />
    </div>
    <h3 className="font-medium text-gray-600 dark:text-gray-400 text-sm mb-1">{label}</h3>
    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
    {subtitle && (
      <p className="text-xs text-green-600 dark:text-green-400 mt-1">{subtitle}</p>
    )}
  </div>
);

/* ─── Loading Skeleton ─── */
const StatSkeleton = () => (
  <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-700" />
      <div className="h-4 w-4 rounded bg-gray-200 dark:bg-gray-700" />
    </div>
    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
    <div className="h-7 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
  </div>
);

/* ─── Activity Item ─── */
const getActivityIcon = (status: string) => {
  switch (status) {
    case "completed":
      return { icon: CheckCircle, color: "green" };
    case "pending":
      return { icon: Clock, color: "orange" };
    case "cancelled":
    case "failed":
      return { icon: Activity, color: "red" };
    default:
      return { icon: Bell, color: "blue" };
  }
};

const getActivityColorClasses = (color: string) => {
  switch (color) {
    case "green":
      return {
        bg: "bg-green-50 dark:bg-green-900/20",
        text: "text-green-600 dark:text-green-400",
      };
    case "orange":
      return {
        bg: "bg-orange-50 dark:bg-orange-900/20",
        text: "text-orange-600 dark:text-orange-400",
      };
    case "red":
      return {
        bg: "bg-red-50 dark:bg-red-900/20",
        text: "text-red-600 dark:text-red-400",
      };
    default:
      return {
        bg: "bg-blue-50 dark:bg-blue-900/20",
        text: "text-blue-600 dark:text-blue-400",
      };
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "completed":
      return "Pesanan selesai";
    case "pending":
      return "Pesanan baru (pending)";
    case "cancelled":
      return "Pesanan dibatalkan";
    case "failed":
      return "Pesanan gagal";
    default:
      return "Aktivitas";
  }
};

const formatTimeAgo = (timestamp: any): string => {
  if (!timestamp) return "-";
  try {
    const date = timestamp.toDate?.() ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return "Baru saja";
    if (diffMin < 60) return `${diffMin} menit lalu`;
    if (diffHr < 24) return `${diffHr} jam lalu`;
    if (diffDay < 7) return `${diffDay} hari lalu`;
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  } catch {
    return "-";
  }
};

/* ─── Main Dashboard ─── */
const withTimeout = <T,>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), timeoutMs)
    ),
  ]);
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    completedOrders: 0,
    pendingOrders: 0,
    totalTemplates: 0,
    totalUsers: 0,
    totalSamples: 0,
    recentOrders: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const timeoutDuration = 5000; // 5 seconds timeout per query

        // 1. Fetch all orders
        let allOrders: Order[] = [];
        try {
          const ordersSnapshot = await withTimeout(
            getDocs(collection(db, "orders")),
            timeoutDuration
          );
          allOrders = ordersSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Order[];
        } catch (err) {
          console.error("[AdminDashboard] Error fetching all orders:", err);
        }

        // Calculate stats
        const completed = allOrders.filter((o) => o.status === "completed").length;
        const pending = allOrders.filter((o) => o.status === "pending").length;
        const revenue = allOrders.reduce((sum, o) => {
          return o.status === "completed" ? sum + (o.price || 0) : sum;
        }, 0);

        // 2. Get recent orders (sorted by createdAt)
        let recentOrders: Order[] = [];
        try {
          const recentOrdersQuery = query(
            collection(db, "orders"),
            orderBy("createdAt", "desc"),
            limit(6)
          );
          const recentSnapshot = await withTimeout(
            getDocs(recentOrdersQuery),
            timeoutDuration
          );
          recentOrders = recentSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Order[];
        } catch (err) {
          console.error("[AdminDashboard] Error fetching recent orders:", err);
        }

        // 3. Count templates
        let totalTemplates = 0;
        try {
          const templatesSnapshot = await withTimeout(
            getDocs(collection(db, "templates")),
            timeoutDuration
          );
          totalTemplates = templatesSnapshot.size;
        } catch (err) {
          console.error("[AdminDashboard] Error fetching templates:", err);
        }

        // 4. Count users
        let totalUsers = 0;
        try {
          const usersSnapshot = await withTimeout(
            getDocs(collection(db, "users")),
            timeoutDuration
          );
          totalUsers = usersSnapshot.size;
        } catch (err) {
          console.error("[AdminDashboard] Error fetching users:", err);
        }

        // 5. Count samples/portfolio
        let totalSamples = 0;
        try {
          const samplesSnapshot = await withTimeout(
            getDocs(collection(db, "samples")),
            timeoutDuration
          );
          totalSamples = samplesSnapshot.size;
        } catch (err) {
          console.error("[AdminDashboard] Error fetching samples:", err);
        }

        setStats({
          totalOrders: allOrders.length,
          totalRevenue: revenue,
          completedOrders: completed,
          pendingOrders: pending,
          totalTemplates,
          totalUsers,
          totalSamples,
          recentOrders,
        });
      } catch (error) {
        console.error("General error in fetchStats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Selamat datang kembali di panel admin Firanta
          </p>
        </div>

        {/* Stats Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <StatSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <StatCard
              icon={ShoppingCart}
              label="Total Pesanan"
              value={stats.totalOrders}
              iconBg="bg-blue-50 dark:bg-blue-900/20"
              iconColor="text-blue-600 dark:text-blue-400"
            />
            <StatCard
              icon={DollarSign}
              label="Pendapatan"
              value={`Rp ${(stats.totalRevenue / 1000).toFixed(0)}K`}
              subtitle="Dari pesanan selesai"
              iconBg="bg-green-50 dark:bg-green-900/20"
              iconColor="text-green-600 dark:text-green-400"
            />
            <StatCard
              icon={CheckCircle}
              label="Pesanan Selesai"
              value={stats.completedOrders}
              iconBg="bg-emerald-50 dark:bg-emerald-900/20"
              iconColor="text-emerald-600 dark:text-emerald-400"
            />
            <StatCard
              icon={Clock}
              label="Pesanan Pending"
              value={stats.pendingOrders}
              iconBg="bg-orange-50 dark:bg-orange-900/20"
              iconColor="text-orange-600 dark:text-orange-400"
            />
            <StatCard
              icon={Package}
              label="Total Template"
              value={stats.totalTemplates}
              iconBg="bg-purple-50 dark:bg-purple-900/20"
              iconColor="text-purple-600 dark:text-purple-400"
            />
            <StatCard
              icon={Users}
              label="Total Pengguna"
              value={stats.totalUsers}
              iconBg="bg-pink-50 dark:bg-pink-900/20"
              iconColor="text-pink-600 dark:text-pink-400"
            />
          </div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Aktivitas Terbaru
                </h3>
                <button
                  onClick={() => {
                    /* navigate to orders page */
                  }}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                >
                  Lihat semua
                </button>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 animate-pulse">
                      <div className="h-9 w-9 rounded-lg bg-gray-200 dark:bg-gray-700" />
                      <div className="flex-1">
                        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
                        <div className="h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
                      </div>
                      <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                  ))}
                </div>
              ) : stats.recentOrders.length > 0 ? (
                <div className="space-y-1">
                  {stats.recentOrders.map((order) => {
                    const { icon: ActivityIcon, color } = getActivityIcon(order.status);
                    const colorClasses = getActivityColorClasses(color);

                    return (
                      <div
                        key={order.id}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                      >
                        <div className={`p-2 rounded-lg ${colorClasses.bg}`}>
                          <ActivityIcon className={`h-4 w-4 ${colorClasses.text}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            {getStatusLabel(order.status)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {order.templateName} — Rp{" "}
                            {(order.price || 0).toLocaleString("id-ID")}
                          </p>
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                          {formatTimeAgo(order.createdAt)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <ShoppingCart className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Belum ada aktivitas</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats + Top Templates */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Ringkasan Cepat
              </h3>
              <div className="space-y-4">
                {/* Completion Rate */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Tingkat Penyelesaian</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {stats.totalOrders > 0
                        ? Math.round((stats.completedOrders / stats.totalOrders) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          stats.totalOrders > 0
                            ? Math.round((stats.completedOrders / stats.totalOrders) * 100)
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Pending Rate */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Pesanan Pending</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {stats.totalOrders > 0
                        ? Math.round((stats.pendingOrders / stats.totalOrders) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          stats.totalOrders > 0
                            ? Math.round((stats.pendingOrders / stats.totalOrders) * 100)
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Average Order Value */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Rata-rata Order</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Rp{" "}
                      {stats.completedOrders > 0
                        ? Math.round(stats.totalRevenue / stats.completedOrders).toLocaleString("id-ID")
                        : 0}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: "65%" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Inventory Overview */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Inventaris
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-md bg-purple-50 dark:bg-purple-900/20">
                      <Package className="h-4 w-4 text-purple-500" />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Template</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {stats.totalTemplates}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-900/20">
                      <Code2 className="h-4 w-4 text-blue-500" />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Portofolio</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {stats.totalSamples}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-md bg-pink-50 dark:bg-pink-900/20">
                      <Users className="h-4 w-4 text-pink-500" />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Pengguna</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {stats.totalUsers}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
