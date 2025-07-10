"use client";

import { ReactNode, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { RoleBased } from "./RoleBased";
import { motion } from "framer-motion";

export interface NavItem {
  title: string;
  href: string;
  icon: ReactNode;
  isDev?: boolean;
  allowedRoles?: string[];
}

const PageNav = memo(
  ({ navItems, children }: { navItems: NavItem[]; children?: ReactNode }) => {
    const pathname = usePathname();

    return (
      <nav className="bg-white/80 backdrop-blur-md z-10 w-full sticky top-0 border-b border-gray-200/50 shadow-sm">
        <div className="mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              {children}
              <div className="flex items-center space-x-2">
                {navItems.map((item, index) => {
                  // Skip development-only items in production
                  if (item.isDev && process.env.NODE_ENV !== "development") {
                    return null;
                  }

                  const isActive = pathname === item.href;

                  const linkElement = (
                    <Link
                      key={`nav-item-${index}`}
                      href={item.href}
                      className={cn(
                        "relative flex items-center h-10 px-4 text-sm font-medium rounded-lg transition-all duration-200 group",
                        isActive
                          ? "text-blue-600 bg-blue-50/80 shadow-sm"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/80"
                      )}
                    >
                      <span
                        className={cn(
                          "mr-2.5 transition-colors duration-200",
                          isActive
                            ? "text-blue-600"
                            : "text-gray-400 group-hover:text-gray-600"
                        )}
                      >
                        {item.icon}
                      </span>
                      <span className="tracking-wide">{item.title}</span>

                      {isActive && (
                        <motion.div
                          className="absolute inset-0 bg-blue-50/20 rounded-lg border border-blue-200/50"
                          layoutId="activeNavIndicator"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{
                            duration: 0.2,
                            ease: "easeOut",
                          }}
                        />
                      )}
                    </Link>
                  );

                  return item.allowedRoles ? (
                    <RoleBased
                      key={`nav-role-${index}`}
                      allowedRoles={item.allowedRoles}
                    >
                      {linkElement}
                    </RoleBased>
                  ) : (
                    linkElement
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }
);

PageNav.displayName = "PageNav";

export default PageNav;
