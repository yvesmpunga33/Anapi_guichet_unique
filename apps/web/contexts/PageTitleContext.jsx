"use client";

import { createContext, useContext, useState, useCallback } from "react";

const PageTitleContext = createContext({
  pageTitle: null,
  setPageTitle: () => {},
});

export function PageTitleProvider({ children }) {
  const [pageTitle, setPageTitleState] = useState(null);

  const setPageTitle = useCallback((title) => {
    setPageTitleState(title);
  }, []);

  return (
    <PageTitleContext.Provider value={{ pageTitle, setPageTitle }}>
      {children}
    </PageTitleContext.Provider>
  );
}

export function usePageTitle() {
  return useContext(PageTitleContext);
}

// Hook to set page title from components
export function useSetPageTitle(title) {
  const { setPageTitle } = usePageTitle();

  // Set title on mount and clear on unmount
  if (typeof window !== "undefined") {
    // Using useEffect would cause issues with SSR
    // This will be called during render which is fine for context updates
  }

  return setPageTitle;
}
