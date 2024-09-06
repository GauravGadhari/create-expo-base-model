import React, { useRef, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Platform,
  ScrollViewProps
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  ScrollView,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';

interface LightScrollViewProps extends ScrollViewProps {
  children: React.ReactNode;
  style?: object;
}

const LightScrollView: React.FC<LightScrollViewProps> = ({ children, style, ...props }) => {
  const translateY = useSharedValue(0);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const screenHeight = Dimensions.get('window').height;
  const scrollViewRef = useRef<ScrollView>(null);

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startY: number }
  >({
    onStart: (_, context) => {
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      translateY.value = context.startY + event.translationY;
    },
    onEnd: () => {
      translateY.value = withSpring(0, {
        damping: 10,
        stiffness: 150,
      });
      runOnJS(setScrollEnabled)(true);
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize } = event.nativeEvent;
    const isAtTop = contentOffset.y <= 0;
    const isAtBottom = contentOffset.y >= contentSize.height - screenHeight;

    if (isAtTop || isAtBottom) {
      if (scrollEnabled) {
        setScrollEnabled(false);
      }
    } else {
      if (!scrollEnabled) {
        setScrollEnabled(true);
      }
    }
  };

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.container, style]}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          scrollEventThrottle={16}
          bounces={Platform.OS === 'ios'}
          scrollEnabled={scrollEnabled}
          onScroll={handleScroll}
          bouncesZoom
          {...props}
        >
          <Animated.View style={animatedStyle}>
            {children}
          </Animated.View>
        </ScrollView>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
});

export default LightScrollView;
