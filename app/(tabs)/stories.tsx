import React from "react";
import { StyleSheet, View } from "react-native";
import { Paragraph, Searchbar, Title, Button, Snackbar } from "react-native-paper";
import { getAuth, signOut } from "firebase/auth";

export default function StoriesScreen() {
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setSnackbarMessage("Logged out successfully!");
      setSnackbarVisible(true);
    } catch (error) {
      setSnackbarMessage("Error logging out: " + error.message);
      setSnackbarVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Searchbar placeholder="Search There..." />
      <Title>No Stories Yet...</Title>
      <Paragraph>This feature will come sooner...</Paragraph>
      <Button mode="contained" onPress={handleLogout} style={styles.button}>
        Logout
      </Button>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={Snackbar.DURATION_SHORT}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  button: {
    marginTop: 16,
  },
});
