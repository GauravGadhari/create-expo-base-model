import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View, Animated, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from 'react-native-paper';

interface LightSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  trackColor?: {
    true?: string;
    false?: string;
  };
  thumbColor?: {
    true?: string;
    false?: string;
  };
}

const LightSwitch: React.FC<LightSwitchProps> = ({
  value,
  onValueChange,
  trackColor = {},
  thumbColor = {},
}) => {
  const [isEnabled, setIsEnabled] = useState(value);
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;
  const theme = useTheme();

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: value ? 1 : 0,
      friction: 3,
      useNativeDriver: false,
    }).start();

    setIsEnabled(value);
  }, [value]);

  const toggleSwitch = useCallback(() => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    onValueChange(newValue);

    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: newValue ? 1 : 0,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.parallel([
        Animated.spring(animatedValue, {
          toValue: newValue ? 0.9 : 0.1,
          friction: 3,
          useNativeDriver: false,
        }),
      ]),
    ]).start();
  }, [isEnabled, onValueChange, animatedValue]);

  const containerStyles = useMemo<ViewStyle>(() => ({
    borderWidth: 2,
    backgroundColor: isEnabled ? theme.colors.elevation.level3 : theme.colors.surface,
    borderColor: isEnabled ? 'transparent' : 'gray',
  }), [isEnabled, theme.colors]);

  const thumbStyles = useMemo<ViewStyle>(() => ({
    borderWidth: isEnabled ? 0 : 2,
    width: isEnabled ? 30 : 26,
    height: isEnabled ? 30 : 26,
    backgroundColor: isEnabled ? thumbColor.true || 'white' : thumbColor.false || 'gray',
    borderColor: isEnabled ? 'transparent' : 'gray',
    shadowColor: isEnabled ? theme.colors.shadow : 'transparent',
    shadowOffset: isEnabled ? { width: 0, height: 2 } : { width: 0, height: 0 },
    shadowOpacity: isEnabled ? 0.5 : 0,
    shadowRadius: isEnabled ? 3 : 0,
    elevation: isEnabled ? 5 : 0,
  }), [isEnabled, thumbColor, theme.colors]);

  const thumbTranslateX = useMemo(() => animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 28],
  }), [animatedValue]);

  return (
    <TouchableOpacity onPress={toggleSwitch} activeOpacity={0.8}>
      <View style={[styles.container, containerStyles]}>
        <Animated.View
          style={[
            styles.thumb,
            thumbStyles,
            { transform: [{ translateX: thumbTranslateX }] },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

LightSwitch.defaultProps = {
  trackColor: {},
  thumbColor: {},
};

const styles = StyleSheet.create({
  container: {
    width: 67,
    height: 37,
    borderRadius: 25,
    justifyContent: 'center',
    padding: 2,
    borderWidth: 1,
  },
  thumb: {
    borderRadius: 15,
    borderWidth: 1,
  },
});

export default LightSwitch;
