import React, { useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useTheme } from "react-native-paper";

type Route = {
  key: string;
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  focusedIcon: keyof typeof MaterialCommunityIcons.glyphMap;
};

type BottomNavigationProps = {
  state: {
    index: number;
    routes: Route[];
  };
  navigation: {
    emit: (event: { type: string; target: string; canPreventDefault: boolean }) => { defaultPrevented: boolean };
    navigate: (key: string) => void;
  };
  index: number;
  setIndex: (index: number) => void;
};

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  state,
  navigation,
  index,
  setIndex,
}) => {
  const theme = useTheme();

  // Shared value for tab offset
  const tabOffset = useSharedValue(index * 100); // Initialize with current tab position

  // Array to store the shared values for each tab icon scale
  const iconScales = state.routes.map(() => useSharedValue(1));

  // Update icon scales when the index changes
  useEffect(() => {
    iconScales.forEach((scale, idx) => {
      scale.value = idx === index ? withTiming(1.2, { duration: 150 }) : withTiming(1, { duration: 150 });
    });
    tabOffset.value = withTiming(index * 100); // Animate the indicator to the selected tab
  }, [index]);

  const handlePress = (route: Route, i: number) => {
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (!event.defaultPrevented) {
      navigation.navigate(route.key);
    }

    setIndex(i);
  };

  return (
    <View style={[styles.container, { backgroundColor: "transparent" }]}>
      <View
        style={[
          styles.blurContainer,
          { backgroundColor: theme.colors.elevation.level1 },
        ]}
      >
        <View style={styles.tabsContainer}>
          {state.routes.map((route, i) => {
            const label = route.title;
            const iconName = index === i ? route.focusedIcon : route.icon;
            const isFocused = index === i;

            // Animated style for the icon
            const animatedIconStyle = useAnimatedStyle(() => ({
              transform: [{ scale: iconScales[i].value }],
            }));

            return (
              <TouchableOpacity
                key={route.key}
                onPress={() => handlePress(route, i)}
                style={styles.tabButton}
              >
                <Animated.View style={animatedIconStyle}>
                  <MaterialCommunityIcons
                    name={iconName}
                    size={24}
                    color={
                      isFocused
                        ? theme.colors.onBackground
                        : theme.colors.outline
                    }
                  />
                </Animated.View>
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: isFocused
                        ? theme.colors.onBackground
                        : theme.colors.outline,
                    },
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderRadius: 20,
    width: "90%",
    alignSelf: "center",
    position: "absolute",
    bottom: 10,
    overflow: "hidden",
  },
  blurContainer: {
    padding: 10,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    flex: 1,
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default BottomNavigation;
