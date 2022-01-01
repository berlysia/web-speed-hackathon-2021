import React, { useEffect, useContext, createContext, useState, useMemo } from 'react';

const DocumentTitleContext = createContext({ stack: [], push: () => {}, drop: () => {} });

export function DocumentTitleContextProvider({ children }) {
  const [stack, setStack] = useState([]);
  const ctx = useMemo(
    () => ({
      push: (x) => {
        setStack((p) => [...p, x]);
      },
      drop: (x) => {
        setStack((p) => {const i = p.lastIndexOf(x); return i === -1 ? p : [...p].splice(i, 1)});
      },
    }),
    [],
  );
  useEffect(() => {
    const newTitle = stack[stack.length - 1] || "CAwitter";
    document.title = newTitle;
  }, [stack]);
  return <DocumentTitleContext.Provider value={ctx}>{children}</DocumentTitleContext.Provider>;
}

export function useDocumentTitle(title) {
  const { push, drop } = useContext(DocumentTitleContext);

  useEffect(() => {
    push(title);
    return () => drop(title);
  }, [title]);
}
