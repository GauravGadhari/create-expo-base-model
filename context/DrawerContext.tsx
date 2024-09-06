import React, {
  createContext,
  useState,
  useContext,
  useRef,
  ReactNode,
  FC,
} from "react";
import {
  StyleSheet,
  Animated,
  TouchableOpacity,
  View,
  Dimensions,
  Modal,
} from "react-native";
import { useTheme } from "react-native-paper";

interface DrawerContextType {
  openDrawer: (renderContent: () => ReactNode, drawerContentResize?: number) => void;
  closeDrawer: () => void;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

interface DrawerProviderProps {
  children: ReactNode;
}

export const DrawerProvider: FC<DrawerProviderProps> = ({ children }) => {
  const theme = useTheme();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerContent, setDrawerContent] = useState<() => ReactNode>(() => () => null);
  const [modalVisible, setModalVisible] = useState(false);

  const screenWidth = Dimensions.get("window").width;
  const drawerWidth = screenWidth * 0.85; // Drawer width is 85% of the screen

  const drawerTranslateX = useRef(new Animated.Value(-drawerWidth)).current;
  const contentScale = useRef(new Animated.Value(1)).current;
  const contentTranslateX = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const openDrawer = (renderContent: () => ReactNode, drawerContentResize = 0.7) => {
    setDrawerContent(() => renderContent);
    setDrawerVisible(true);
    setModalVisible(true); // Show modal when drawer opens
    Animated.parallel([
      Animated.timing(drawerTranslateX, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(contentScale, {
        toValue: drawerContentResize,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslateX, {
        toValue: drawerWidth * 0.4,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeDrawer = () => {
    Animated.parallel([
      Animated.timing(drawerTranslateX, {
        toValue: -drawerWidth,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(contentScale, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslateX, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setDrawerVisible(false);
      setModalVisible(false); // Hide modal when drawer closes
    });
  };

  return (
    <DrawerContext.Provider value={{ openDrawer, closeDrawer }}>
      <Modal
        transparent
        visible={modalVisible}
        animationType="none"
        onRequestClose={closeDrawer}
        statusBarTranslucent
      >
        <View style={styles.modalBackground}>
          <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
            <TouchableOpacity
              style={StyleSheet.absoluteFillObject}
              activeOpacity={1}
              onPress={closeDrawer}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.drawer,
              { transform: [{ translateX: drawerTranslateX }] },
              { backgroundColor: theme.colors.background },
            ]}
          >
            {drawerContent()}
          </Animated.View>
        </View>
      </Modal>

      <Animated.View
        style={[
          styles.mainContent,
          {
            transform: [
              { scale: contentScale },
              { translateX: contentTranslateX },
            ],
          },
        ]}
      >
        {children}
      </Animated.View>
    </DrawerContext.Provider>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1,
  },
  drawer: {
    position: "absolute",
    left: 0,
    width: "85%",
    height: "100%",
    zIndex: 2,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  mainContent: {
    flex: 1,
    zIndex: 0,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start", // Align content to start to fit drawer
  },
});

export const useDrawer = (): DrawerContextType => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error("useDrawer must be used within a DrawerProvider");
  }
  return context;
};

export default DrawerContext;
