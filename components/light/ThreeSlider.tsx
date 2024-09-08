import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, StyleSheet, useWindowDimensions, useColorScheme, Dimensions } from 'react-native';
import PagerView from 'react-native-pager-view';
import { Text } from 'react-native-paper';

const ThreeOptionsSlider = ({ tabOneTitle, tabTwoTitle, tabThreeTitle, tabOneKey, tabTwoKey, tabThreeKey, onSelect, tabOneChildren, tabTwoChildren, tabThreeChildren }) => {
    const { width } = useWindowDimensions();
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const animValue = useRef(new Animated.Value(0)).current;
    const [leftProp, setLeftProp] = useState(0);
    const [middleProp, setMiddleProp] = useState(1);
    const [rightProp, setRightProp] = useState(2);

    const handlePageChange = (index) => {
        if (currentPageIndex !== index) {
            setCurrentPageIndex(index);

            Animated.timing(animValue, {
                toValue: index,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    };

    const [backgroundAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.timing(backgroundAnim, {
            toValue: currentPageIndex,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [currentPageIndex]);

    const pagerRef = useRef(null);

    const handlePress = (index) => {
        handlePageChange(index)
        setCurrentPageIndex(index);
        pagerRef.current.setPageWithoutAnimation(index); // Change the selected page without animation
    };

    return (
        <>
            <View style={styles.statsContainer}>
                <Animated.View
                    style={[
                        styles.backgroundLayerOftext,
                        { backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(204, 221, 255, 0.7)' },
                        {
                            transform: [
                                {
                                    translateX: animValue.interpolate({
                                        inputRange: [0, 1, 2],
                                        outputRange: [
                                            leftProp * (Dimensions.get('screen').width / 3),
                                            middleProp * (Dimensions.get('screen').width / 3),
                                            rightProp * (Dimensions.get('screen').width / 3),
                                        ],
                                    }),
                                },
                            ],
                        },
                    ]}
                >
                    <Text style={styles.statsText}></Text>
                    <Text style={styles.statsText}></Text>
                    <Text style={styles.statsText}></Text>
                </Animated.View>
                <Text style={styles.statsText} onPress={() => handlePress(0)}>{tabOneTitle}</Text>
                <Text style={styles.statsText} onPress={() => handlePress(1)}>{tabTwoTitle}</Text>
                <Text style={styles.statsText} onPress={() => handlePress(2)}>{tabThreeTitle}</Text>
            </View>

            <PagerView
                style={{ flex: 1 }}
                initialPage={0}
                onPageSelected={(event) => handlePageChange(event.nativeEvent.position)}
                ref={pagerRef} // Assign the ref to the PagerView
            >
                <PagerView style={styles.pagerContainer} key={tabOneKey}>
                    {tabOneChildren}
                </PagerView>
                <PagerView style={styles.pagerContainer} key={tabTwoKey}>
                    {tabTwoChildren}
                </PagerView>
                <PagerView style={styles.pagerContainer} key={tabThreeKey}>
                    {tabThreeChildren}
                </PagerView>
            </PagerView>
        </>
    );
};

const styles = StyleSheet.create({
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 15,
        overflow: 'hidden',
    },
    statsText: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingVertical: 12,
        width: Dimensions.get('screen').width / 3,
        textAlign: 'center',
    },
    backgroundLayerOftext: {
        width: Dimensions.get('screen').width / 3,
        height: '100%',
        position: 'absolute',
        borderRadius: 21,
    },
    pagerContainer: {
        flex: 1,
    },
});

export default ThreeOptionsSlider;