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
  PanResponder,
  TouchableOpacity,
  Modal,
  BackHandler,
  GestureResponderHandlers,
} from "react-native";
import { useTheme } from "react-native-paper";

interface BottomSheetContextType {
  showBottomSheet: (renderContent: () => ReactNode) => void;
  handleClose: () => boolean;
}

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(
  undefined
);

interface BottomSheetProviderProps {
  children: ReactNode;
}

export const BottomSheetProvider: FC<BottomSheetProviderProps> = ({
  children,
}) => {
  const theme = useTheme();
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [bottomSheetContent, setBottomSheetContent] = useState<() => ReactNode>(
    () => () => null
  );

  const bottomSheetHeight = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (bottomSheetVisible) {
      BackHandler.addEventListener("hardwareBackPress", handleClose);
    } else {
      BackHandler.removeEventListener("hardwareBackPress", handleClose);
    }

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleClose);
    };
  }, [bottomSheetVisible]);

  useEffect(() => {
    Animated.timing(overlayOpacity, {
      toValue: bottomSheetVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [bottomSheetVisible]);

  useEffect(() => {
    Animated.spring(bottomSheetHeight, {
      toValue: bottomSheetVisible ? 1 : 0,
      friction: 7,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [bottomSheetVisible]);

  const showBottomSheet = (renderContent: () => ReactNode) => {
    setBottomSheetContent(() => renderContent);
    setBottomSheetVisible(true);
  };

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(bottomSheetHeight, {
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
      setBottomSheetVisible(false);
    });
    return true;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        if (gestureState.dy > 0) {
          bottomSheetHeight.setValue(1 - gestureState.dy / 300);
        }
      },
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dy > 150) {
          handleClose();
        } else {
          Animated.spring(bottomSheetHeight, {
            toValue: 1,
            friction: 5,
            tension: 100,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <BottomSheetContext.Provider
      value={{
        showBottomSheet,
        handleClose,
      }}
    >
      {children}
      <Modal
        transparent
        statusBarTranslucent
        visible={bottomSheetVisible}
        animationType="fade"
        onRequestClose={handleClose}
      >
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            onPress={handleClose}
          />
          <Animated.View
            {...(panResponder.panHandlers as GestureResponderHandlers)}
            style={[
              styles.bottomSheetContainer,
              {
                transform: [
                  {
                    translateY: bottomSheetHeight.interpolate({
                      inputRange: [0, 1],
                      outputRange: [300, 0],
                    }),
                  },
                ],
                backgroundColor: theme.colors.background,
              },
            ]}
          >
            {bottomSheetContent()}
          </Animated.View>
        </Animated.View>
      </Modal>
    </BottomSheetContext.Provider>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  bottomSheetContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
});

export const useBottomSheet = (): BottomSheetContextType => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error("useBottomSheet must be used within a BottomSheetProvider");
  }
  return context;
};

export default BottomSheetContext;
