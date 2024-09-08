import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
  NavigationContainer,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabLayout from "./(tabs)/_layout";
import NotFoundScreen from "./+not-found";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import Auth from "./auth";
import {
  AnimatedDialogProvider,
  BottomSheetProvider,
  DrawerProvider,
  JustDialogProvider,
  ThemeDynamicProvider,
  useDynamicTheme,
} from "@/context";
import { SnackbarProvider } from "@/context/SnackBarContext";
import CreateShop from "./models/CreateShop";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

const RootLayout: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });
    return unsubscribe;
  }, [initializing]);

  useEffect(() => {
    if (fontsLoaded && !initializing) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, initializing]);

  if (!fontsLoaded || initializing) {
    return null; // Loading state
  }

  return (
    <ThemeDynamicProvider>
      <MainLayout user={user} />
    </ThemeDynamicProvider>
  );
};

interface MainLayoutProps {
  user: User | null;
}

const MainLayout: React.FC<MainLayoutProps> = ({ user }) => {
  const colorScheme = useColorScheme();
  const { theme } = useDynamicTheme();

  return (
    <PaperProvider theme={theme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <SnackbarProvider>
            <BottomSheetProvider>
              <DrawerProvider>
                <AnimatedDialogProvider>
                  <JustDialogProvider>
                    <NavigationContainer independent>
                      <Stack.Navigator screenOptions={{ animation: "ios" }}>
                        {user ? (
                          <>
                            <Stack.Screen
                              name="(tabs)"
                              options={{ headerShown: false }}
                              component={TabLayout}
                            />
                            <Stack.Screen
                              name="CreateShop"
                              options={{
                                headerShown: false,
                              }}
                              component={CreateShop}
                            />
                            <Stack.Screen
                              name="+not-found"
                              component={NotFoundScreen}
                            />
                          </>
                        ) : (
                          <Stack.Screen
                            name="AuthScreen"
                            component={Auth}
                            options={{ headerShown: false }}
                          />
                        )}
                      </Stack.Navigator>
                    </NavigationContainer>
                  </JustDialogProvider>
                </AnimatedDialogProvider>
              </DrawerProvider>
            </BottomSheetProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </PaperProvider>
  );
};

export default RootLayout;
