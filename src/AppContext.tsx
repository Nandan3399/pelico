import React, { createContext, useContext, useReducer } from "react";
import { Repo } from "./app/interfaces/repo";

interface AppState {
  searchResults: Repo[];
  searchQuery: string;
}

interface AppProviderProps {
  children: React.ReactNode;
}

type AppAction =
  | { type: "SET_SEARCH_RESULTS"; payload: Repo[] }
  | { type: "SET_SEARCH_QUERY"; payload: string };

const AppStateContext = createContext<AppState | undefined>(undefined);
const AppDispatchContext = createContext<React.Dispatch<AppAction> | undefined>(
  undefined
);

export const setSearchResults = (results: Repo[]): AppAction => ({
  type: "SET_SEARCH_RESULTS",
  payload: results,
});

export const setSearchQuery = (query: string): AppAction => ({
  type: "SET_SEARCH_QUERY",
  payload: query,
});

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "SET_SEARCH_RESULTS":
      return { ...state, searchResults: action.payload };
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };
    default:
      return state;
  }
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, {
    searchResults: [],
    searchQuery: "",
  });

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};

export const useAppState = (): AppState => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppProvider");
  }
  return context;
};

export const useAppDispatch = (): React.Dispatch<AppAction> => {
  const context = useContext(AppDispatchContext);
  if (!context) {
    throw new Error("useAppDispatch must be used within an AppProvider");
  }
  return context;
};
