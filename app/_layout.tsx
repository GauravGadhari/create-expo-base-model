import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { PaperProvider } from "react-native-paper";
import { useColorScheme } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabLayout from "./(tabs)/_layout";
import NotFoundScreen from "./+not-found";
import { AnimatedDialogProvider, BottomSheetProvider, DrawerProvider, JustDialogProvider, ThemeDynamicProvider, useDynamicTheme } from "@/context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeDynamicProvider>
      <MainLayout />
    </ThemeDynamicProvider>
  );
}

function MainLayout() {
  const { theme } = useDynamicTheme();
  const colorScheme = useColorScheme();

  return (
    <PaperProvider theme={theme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <BottomSheetProvider>
            <DrawerProvider>
              <AnimatedDialogProvider>
                <JustDialogProvider>
                  <NavigationContainer independent>
                    <Stack.Navigator>
                      <Stack.Screen
                        name="(tabs)"
                        options={{ headerShown: false }}
                        component={TabLayout}
                      />
                      <Stack.Screen
                        name="+not-found"
                        component={NotFoundScreen}
                      />
                    </Stack.Navigator>
                  </NavigationContainer>
                </JustDialogProvider>
              </AnimatedDialogProvider>
            </DrawerProvider>
          </BottomSheetProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </PaperProvider>
  );
}
