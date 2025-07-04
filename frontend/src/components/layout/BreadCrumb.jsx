// frontend/src/components/layout/BreadCrumb.jsx

import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const BreadCrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const formatBreadcrumbName = (name) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getBreadcrumbPath = (index) => {
    return "/" + pathnames.slice(0, index + 1).join("/");
  };

  if (pathnames.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm mb-6">
      <Link
        to="/"
        className="flex items-center text-gray-400 hover:text-white transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>

      {pathnames.map((name, index) => {
        const routeTo = getBreadcrumbPath(index);
        const isLast = index === pathnames.length - 1;

        return (
          <React.Fragment key={name}>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            {isLast ? (
              <span className="text-white font-medium">
                {formatBreadcrumbName(name)}
              </span>
            ) : (
              <Link
                to={routeTo}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {formatBreadcrumbName(name)}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
