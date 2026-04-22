"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, FolderOpen, ArrowLeft } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/articles", label: "Articles", icon: Package },
    { href: "/admin/categories", label: "Catégories", icon: FolderOpen },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin top bar */}
      <div className="bg-indigo-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm">StuffRental Admin</span>
          <span className="bg-indigo-700 text-indigo-200 text-xs px-2 py-0.5 rounded-full">Espace admin</span>
        </div>
        <Link href="/" className="text-indigo-300 hover:text-white text-xs flex items-center gap-1">
          <ArrowLeft size={12} /> Site public
        </Link>
      </div>

      <div className="flex min-h-[calc(100vh-48px)]">
        {/* Sidebar */}
        <aside className="w-56 bg-white border-r border-gray-100 pt-4 hidden md:block shrink-0">
          <nav className="flex flex-col gap-1 px-2">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === href
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Mobile tab nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex z-50">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center py-2.5 text-xs font-medium transition-colors ${
                pathname === href ? "text-indigo-600" : "text-gray-500"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </div>

        {/* Main content */}
        <main className="flex-1 p-6 pb-20 md:pb-6">{children}</main>
      </div>
    </div>
  );
}
