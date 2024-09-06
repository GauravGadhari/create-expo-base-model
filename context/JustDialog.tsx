import React, {
  createContext,
  useState,
  useContext,
  useRef,
  useEffect,
  ReactNode,
  FC,
} from "react";
import {
  StyleSheet,
  Animated,
  TouchableOpacity,
  Vibration,
  Modal,
  BackHandler,
} from "react-native";
import { useTheme } from "react-native-paper";

interface JustDialogContextType {
  showJustDialog: (renderContent: () => ReactNode) => void;
  handleDialogClose: () => boolean;
}

const JustDialogContext = createContext<JustDialogContextType | undefined>(undefined);

interface JustDialogProviderProps {
  children: ReactNode;
}

export const JustDialogProvider: FC<JustDialogProviderProps> = ({ children }) => {
  const theme = useTheme();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogContent, setDialogContent] = useState<() => ReactNode>(() => () => null);

  const dialogScale = useRef(new Animated.Value(0.7)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (dialogVisible) {
      BackHandler.addEventListener("hardwareBackPress", handleDialogClose);
    } else {
      BackHandler.removeEventListener("hardwareBackPress", handleDialogClose);
    }

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleDialogClose);
    };
  }, [dialogVisible]);

  useEffect(() => {
    Animated.timing(overlayOpacity, {
      toValue: dialogVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [dialogVisible]);

  useEffect(() => {
    Animated.spring(dialogScale, {
      toValue: dialogVisible ? 1 : 0.7,
      friction: 5,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [dialogVisible]);

  const vibrate = () => {
    Vibration.vibrate(50);
  };

  const showJustDialog = (renderContent: () => ReactNode) => {
    setDialogContent(() => renderContent);
    setDialogVisible(true);
    vibrate();
  };

  const handleDialogClose = () => {
    Animated.parallel([
      Animated.timing(dialogScale, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setDialogVisible(false);
    });
    return true;
  };

  return (
    <JustDialogContext.Provider
      value={{
        showJustDialog,
        handleDialogClose,
      }}
    >
      {children}
      <Modal
        transparent
        visible={dialogVisible}
        animationType="none"
        onRequestClose={handleDialogClose}
        statusBarTranslucent
      >
        <Animated.View
          style={[styles.dialogOverlay, { opacity: overlayOpacity }]}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            onPress={handleDialogClose}
          />
          <Animated.View
            style={[
              styles.dialogContainer,
              {
                transform: [{ scale: dialogScale }],
                backgroundColor: theme.colors.background,
              },
            ]}
          >
            {dialogContent()}
          </Animated.View>
        </Animated.View>
      </Modal>
    </JustDialogContext.Provider>
  );
};

const styles = StyleSheet.create({
  dialogOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  dialogContainer: {
    width: "80%",
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "center",
  },
});

export const useJustDialog = (): JustDialogContextType => {
  const context = useContext(JustDialogContext);
  if (!context) {
    throw new Error("useJustDialog must be used within a JustDialogProvider");
  }
  return context;
};

export default JustDialogContext;
