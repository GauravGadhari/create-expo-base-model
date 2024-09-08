import React from "react";
import { ScrollView, StyleSheet } from "react-native";

const IndexScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    paddingBottom: 80,
  },
});

export default IndexScreen;
