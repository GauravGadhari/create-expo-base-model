import React, { createContext, useState, useContext, ReactNode } from "react";
import { Snackbar } from "react-native-paper";

// Define the types for the context
interface SnackbarContextType {
  setSnackbarText: (text: string) => void;
  setSnackbarVisible: (visible: boolean) => void;
  customStop: () => void;
}

// Create a context with default values
const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

// SnackbarProvider component to wrap your app and manage snackbar state
export const SnackbarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [snackbarDuration, setSnackbarDuration] = useState(Snackbar.DURATION_SHORT);

  // Function to handle stopping the Snackbar manually
  const customStop = () => {
    setSnackbarVisible(false);
  };

  return (
    <SnackbarContext.Provider
      value={{
        setSnackbarText: (text: string) => setSnackbarText(text),
        setSnackbarVisible: (visible: boolean) => setSnackbarVisible(visible),
        customStop,
      }}
    >
      {children}

      {/* Snackbar Component */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={snackbarDuration}
      >
        {snackbarText}
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

// Custom hook to use the SnackbarContext
export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};
