import React, { useState } from "react";
import { View, StyleSheet, Image, Alert, ScrollView } from "react-native";
import {
  Button,
  Caption,
  TextInput as PaperTextInput,
  useTheme,
  SegmentedButtons,
  Appbar,
  HelperText,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useSnackbar } from "@/context/SnackBarContext";

// Firebase Initialization
const db = getFirestore();
const storage = getStorage();

const CreateShop: React.FC = () => {
  const [value, setValue] = React.useState("online");
  const [banner, setBanner] = useState<string | null>(null);
  const theme = useTheme();
  const [bio, setBio] = useState("");
  const { setSnackbarText, setSnackbarVisible, customStop } = useSnackbar(); // Use the Snackbar context

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setBanner(result.assets[0].uri); // Adjusted to use the correct URI
    }
  };

  const uploadBannerImage = async (uri: string, shopId: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    // Reference to the shop's banner image
    const storageRef = ref(storage, `shops/${shopId}/bannerImage.jpg`);
    await uploadBytes(storageRef, blob);

    // Get the public download URL
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  const handleSave = async () => {
    if (bio.length > 700) {
      Alert.alert("Bio too long", "The bio cannot exceed 700 characters.");
      return;
    }

    setSnackbarText("Saving shop details...");
    setSnackbarVisible(true); // Show Snackbar until the process is done

    try {
      // Generate a unique shop ID (for example, using a timestamp or UUID)
      const shopId = new Date().getTime().toString(); // This is a placeholder; replace with your own method for generating unique IDs

      let bannerURL: string | null = null;
      if (banner) {
        setSnackbarText("Uploading banner image...");
        bannerURL = await uploadBannerImage(banner, shopId);
      }

      // Save shop details to Firestore
      await setDoc(doc(db, "shops", shopId), {
        type: value,
        banner: bannerURL,
        bio,
        // Assuming you have a method to get the user ID, such as from authentication
        userId: "user-id-placeholder", // Replace with actual user ID
      });

      // Clear form fields after success
      setBanner(null);
      setBio("");

      setSnackbarText("Shop details saved successfully!");
      setTimeout(() => customStop(), 2000); // Hide the Snackbar after 2 seconds
    } catch (error: any) {
      setSnackbarText("Error saving shop details: " + error.message);
      setTimeout(() => customStop(), 2000); // Hide the Snackbar after showing the error
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header>
        <Appbar.Content title="Create Shop" />
      </Appbar.Header>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Caption style={styles.sectionTitle}>Shop Type</Caption>
        <SegmentedButtons
          value={value}
          onValueChange={setValue}
          style={styles.pHori}
          buttons={[
            {
              value: "online",
              label: "Online",
              icon: "web",
            },
            {
              value: "offline",
              label: "Offline",
              disabled: true,
              icon: "web-cancel",
            },
          ]}
        />

        {banner && (
          <Image source={{ uri: banner }} style={styles.bannerImage} />
        )}
        <Button
          mode="contained"
          onPress={handleImagePick}
          style={styles.button}
        >
          {banner ? "Change Banner Image" : "Upload Banner Image"}
        </Button>

        <PaperTextInput
          label="Title (max 100 characters)"
          maxLength={100}
        />

        <PaperTextInput
          label="Bio (max 700 characters)"
          multiline
          maxLength={700}
          value={bio}
          onChangeText={setBio}
          style={styles.textInput}
        />

        <Button mode="contained" onPress={handleSave} style={styles.button}>
          Save Shop Details
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pHori: {
    paddingHorizontal: 10,
  },
  button: {
    margin: 8,
  },
  bannerImage: {
    width: "100%",
    height: 200,
    marginTop: 8,
  },
  textInput: {
    height: 200,
    marginVertical: 8,
  },
  sectionTitle: {
    padding: 16,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CreateShop;
