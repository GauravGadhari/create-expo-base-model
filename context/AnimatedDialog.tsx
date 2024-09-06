import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Vibration,
  BackHandler,
  Platform,
  Modal as RNModal,
} from "react-native";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";
import { useTheme } from "react-native-paper";

// Define types for dialog content and configuration
type DialogContent = () => ReactNode;
type DialogConfig = {
  expanded: boolean;
};

// Define the context type
type AnimatedDialogContextType = {
  showDialog: (renderContent: DialogContent, config: DialogConfig) => void;
  handleToggle: () => void;
  dialogExpanded: boolean;
};

// Create the context with default values
const AnimatedDialogContext = createContext<AnimatedDialogContextType | undefined>(undefined);

export const AnimatedDialogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const theme = useTheme();
  const [dialogs, setDialogs] = useState<{ content: DialogContent; expanded: boolean }[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);

  const dialogScale = useSharedValue(0.7);
  const dialogHeight = useSharedValue(0.45);
  const dialogWidth = useSharedValue(0.8);
  const dialogBorderRadius = useSharedValue(20); // Initial border radius
  const overlayOpacity = useSharedValue(0);

  const springConfig = {
    damping: 10,
    stiffness: 120,
    mass: 1,
    overshootClamping: false,
    restSpeedThreshold: 0.01,
    restDisplacementThreshold: 0.01,
  };

  useEffect(() => {
    const dialogVisible = dialogs.length > 0;
    setModalVisible(dialogVisible);

    if (dialogVisible) {
      const topDialog = dialogs[dialogs.length - 1];
      dialogScale.value = withSpring(1, springConfig);
      dialogHeight.value = withSpring(topDialog.expanded ? 1 : 0.45, springConfig);
      dialogWidth.value = withSpring(topDialog.expanded ? 1 : 0.8, springConfig);
      dialogBorderRadius.value = withSpring(topDialog.expanded ? 0 : 20, springConfig);
      overlayOpacity.value = withSpring(1, springConfig);
    } else {
      dialogScale.value = withSpring(0.7, springConfig);
      dialogHeight.value = withSpring(0.45, springConfig);
      dialogWidth.value = withSpring(0.8, springConfig);
      dialogBorderRadius.value = withSpring(20, springConfig);
      overlayOpacity.value = withSpring(0, springConfig);
    }
  }, [dialogs]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      return () => backHandler.remove();
    }
  }, [dialogs]);

  const handleToggle = () => {
    const newDialogs = [...dialogs];
    const topDialog = newDialogs.pop();
    if (topDialog) {
      const newExpandedState = !topDialog.expanded;
      newDialogs.push({
        ...topDialog,
        expanded: newExpandedState,
      });
      setDialogs(newDialogs);

      dialogHeight.value = withSpring(newExpandedState ? 1 : 0.45, springConfig);
      dialogWidth.value = withSpring(newExpandedState ? 1 : 0.8, springConfig);
      dialogBorderRadius.value = withSpring(newExpandedState ? 0 : 20, springConfig);
    }
  };

  const showDialog = (renderContent: DialogContent, { expanded }: DialogConfig) => {
    setDialogs(prevDialogs => [
      ...prevDialogs,
      { content: renderContent, expanded }
    ]);
    Vibration.vibrate(30);
  };

  const handleDialogClose = () => {
    const topDialog = dialogs[dialogs.length - 1];
    if (topDialog?.expanded) {
      handleToggle();
    } else {
      dialogScale.value = withSpring(0.7, springConfig);
      overlayOpacity.value = withSpring(0, springConfig);
      dialogHeight.value = withSpring(0.45, springConfig);
      dialogWidth.value = withSpring(0.8, springConfig);
      dialogBorderRadius.value = withSpring(20, springConfig);

      setTimeout(() => {
        runOnJS(() => setDialogs(prevDialogs => prevDialogs.slice(0, -1)))();
      }, 300);
    }
  };

  const handleBackPress = () => {
    if (dialogs.length > 0) {
      handleDialogClose();
      return true;
    }
    return false;
  };

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const animatedDialogStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dialogScale.value }],
    width: `${dialogWidth.value * 100}%`,
    height: `${dialogHeight.value * 100}%`,
    borderRadius: dialogBorderRadius.value,
  }));

  return (
    <AnimatedDialogContext.Provider
      value={{
        showDialog,
        handleToggle,
        dialogExpanded: dialogs.length > 0 ? dialogs[dialogs.length - 1].expanded : false,
      }}
    >
      {children}
      <RNModal
        transparent
        visible={isModalVisible}
        onRequestClose={handleBackPress}
        statusBarTranslucent
      >
        <Animated.View style={[styles.dialogOverlay, animatedOverlayStyle]}>
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            onPress={handleDialogClose}
          />
          {dialogs.map((dialog, index) => (
            <Animated.View
              key={index}
              style={[
                styles.dialogContainer,
                animatedDialogStyle,
                { backgroundColor: theme.colors.background, zIndex: dialogs.length - index },
                dialog.expanded ? styles.dialogExpanded : null,
              ]}
            >
              {dialog.content && dialog.content()}
            </Animated.View>
          ))}
        </Animated.View>
      </RNModal>
    </AnimatedDialogContext.Provider>
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
    borderRadius: 20,
    overflow: "hidden",
    alignItems: "center",
    padding: 0,
  },
  dialogExpanded: {
    borderRadius: 0,
  },
});

export const useAnimatedDialog = () => {
  const context = useContext(AnimatedDialogContext);
  if (!context) {
    throw new Error(
      "useAnimatedDialog must be used within an AnimatedDialogProvider"
    );
  }
  return context;
};
