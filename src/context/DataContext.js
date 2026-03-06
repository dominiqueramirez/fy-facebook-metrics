import React, { createContext, useContext, useReducer, useCallback } from "react";
import { parseZip, mergeData } from "../utils/parseData";

const DataContext = createContext();

const initialState = {
  posts: [],
  loading: false,
  error: null,
  filesLoaded: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "LOAD_START":
      return { ...state, loading: true, error: null };
    case "LOAD_SUCCESS":
      return {
        ...state,
        loading: false,
        posts: action.posts,
        filesLoaded: [...state.filesLoaded, ...action.fileNames],
      };
    case "LOAD_ERROR":
      return { ...state, loading: false, error: action.error };
    case "CLEAR":
      return initialState;
    default:
      return state;
  }
}

export function DataProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadFiles = useCallback(
    async (fileList) => {
      dispatch({ type: "LOAD_START" });
      try {
        let merged = [...state.posts];
        const names = [];

        for (const file of fileList) {
          const buffer = await file.arrayBuffer();
          const rows = await parseZip(buffer);
          merged = mergeData(merged, rows);
          names.push(file.name);
        }

        // Sort by date ascending
        merged.sort((a, b) => (a.date || 0) - (b.date || 0));

        dispatch({ type: "LOAD_SUCCESS", posts: merged, fileNames: names });
      } catch (err) {
        dispatch({ type: "LOAD_ERROR", error: err.message });
      }
    },
    [state.posts]
  );

  const clearData = useCallback(() => dispatch({ type: "CLEAR" }), []);

  return (
    <DataContext.Provider value={{ ...state, loadFiles, clearData }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used inside <DataProvider>");
  return ctx;
}
