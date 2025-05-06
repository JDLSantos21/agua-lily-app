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
      <nav className="bg-white z-10 w-full sticky top-0 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14">
            <div className="flex items-center space-x-4">
              {children}
              <div className="flex space-x-1">
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
                        "relative flex items-center h-14 px-3 text-sm transition-colors",
                        isActive
                          ? "text-blue-600"
                          : "text-gray-500 hover:text-gray-800"
                      )}
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.title}

                      {isActive && (
                        <motion.div
                          className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"
                          layoutId="activeNavIndicator"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{
                            duration: 0.3,
                            ease: "easeInOut",
                            bounce: 0.2,
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
