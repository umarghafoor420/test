"use client";
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

const GlobalLoadingOverlay = () => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (prevPath.current !== pathname) {
      setLoading(true);
      // Simulate a short delay for the spinner to be visible
      const timeout = setTimeout(() => setLoading(false), 500);
      prevPath.current = pathname;
      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line
  }, [pathname]);

  if (!loading) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-transparent pointer-events-none">
      <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-600"></div>
    </div>
  );
};

export default GlobalLoadingOverlay;
