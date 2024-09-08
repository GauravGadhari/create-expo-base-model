import React, { useState } from "react";
import { View, StyleSheet, Image, Alert, ScrollView } from "react-native";
import {
  Button,
  Caption,
  TextInput as PaperTextInput,
  useTheme,
  SegmentedButtons,
  Appbar,
  Menu,
  Divider,
  HelperText,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useSnackbar } from "@/context/SnackBarContext";
import { auth, db, storage } from "@/firebaseConfig";

const MAX_BIO_LENGTH = 700;
const MAX_TITLE_LENGTH = 100;

const uploadBannerImage = async (
  uri: string,
  userId: string,
  shopId: string
) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(
      storage,
      `shops/${userId}/${shopId}/bannerImage.jpg`
    );
    await uploadBytes(storageRef, blob);

    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading banner image:", error);
    throw error;
  }
};

const CreateShop: React.FC = () => {
  const theme = useTheme();
  const { setSnackbarText, setSnackbarVisible, customStop } = useSnackbar();
  const [form, setForm] = useState({
    type: "online",
    banner: null,
    bio: "",
    title: "",
    links: [{ label: "", icon: "link", url: "" }],
  });
  const userId = auth.currentUser?.uid;
  const [activeLinkIndex, setActiveLinkIndex] = useState<number | null>(null);
  const [errors, setErrors] = useState({
    banner: false,
    title: false,
    bio: false,
  });

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setForm((prev) => ({ ...prev, banner: result.assets[0].uri }));
    }
  };

  const validateForm = () => {
    const newErrors = { banner: false, title: false, bio: false };
    let isValid = true;

    if (!form.banner) {
      newErrors.banner = true;
      isValid = false;
    }

    if (form.title.trim() === "") {
      newErrors.title = true;
      isValid = false;
    }

    if (form.bio.trim() === "") {
      newErrors.bio = true;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSnackbarText("Saving shop details...");
    setSnackbarVisible(true);

    try {
      const shopId = `${userId}_${Date.now()}`;
      const shopRef = doc(db, "shops", shopId);

      let bannerURL = null;
      if (form.banner) {
        setSnackbarText("Uploading banner image...");
        bannerURL = await uploadBannerImage(form.banner, userId, shopId);
      }

      await setDoc(shopRef, {
        type: form.type,
        banner: bannerURL,
        bio: form.bio,
        title: form.title,
        userId,
        quick_links: form.links,
        createdAt: serverTimestamp(),
      });

      setForm({
        type: "online",
        banner: null,
        bio: "",
        title: "",
        links: [{ icon: "link", url: "", label: "" }],
      });
      setSnackbarText("Shop details saved successfully!");
      setTimeout(() => customStop(), 2000);
    } catch (error: any) {
      setSnackbarText(`Error saving shop details: ${error.message}`);
      console.log(error);
      setTimeout(() => customStop(), 2000);
    }
  };

  const handleRemoveLink = (index: number) => {
    setForm((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }));
  };

  const handleAddLink = () => {
    setForm((prev) => ({
      ...prev,
      links: [...prev.links, { icon: "link", url: "", label: "" }],
    }));
  };

  const handleUrlChange = (text: string, index: number) => {
    let icon = "link"; // Default icon

    if (
      text.startsWith("https://github.com") ||
      text.startsWith("http://github.com")
    ) {
      icon = "github";
    } else if (
      text.startsWith("https://www.instagram.com") ||
      text.startsWith("http://instagram.com") ||
      text.startsWith("https://instagram.com")
    ) {
      icon = "instagram";
    } else if (
      text.startsWith("https://www.youtube.com") ||
      text.startsWith("http://youtube.com") ||
      text.startsWith("https://youtu.be")
    ) {
      icon = "youtube";
    } else if (
      text.startsWith("https://play.google.com") ||
      text.startsWith("http://play.google.com")
    ) {
      icon = "google-play";
    } else if (
      text.startsWith("https://twitter.com") ||
      text.startsWith("http://twitter.com")
    ) {
      icon = "twitter";
    } else if (
      text.startsWith("https://www.facebook.com") ||
      text.startsWith("http://facebook.com") ||
      text.startsWith("https://fb.com") ||
      text.startsWith("http://fb.com")
    ) {
      icon = "facebook";
    } else if (
      text.startsWith("https://www.linkedin.com") ||
      text.startsWith("http://linkedin.com")
    ) {
      icon = "linkedin";
    } else if (
      text.startsWith("https://www.reddit.com") ||
      text.startsWith("http://reddit.com")
    ) {
      icon = "reddit";
    } else if (
      text.startsWith("https://www.tiktok.com") ||
      text.startsWith("http://tiktok.com")
    ) {
      icon = "tiktok";
    } else if (
      text.startsWith("https://www.pinterest.com") ||
      text.startsWith("http://pinterest.com")
    ) {
      icon = "pinterest";
    } else if (
      text.startsWith("https://www.snapchat.com") ||
      text.startsWith("http://snapchat.com")
    ) {
      icon = "snapchat";
    } else if (
      text.startsWith("https://medium.com") ||
      text.startsWith("http://medium.com")
    ) {
      icon = "medium";
    } else if (
      text.startsWith("https://dribbble.com") ||
      text.startsWith("http://dribbble.com")
    ) {
      icon = "dribbble";
    } else if (
      text.startsWith("https://www.behance.net") ||
      text.startsWith("http://behance.net")
    ) {
      icon = "behance";
    } else if (
      text.startsWith("https://discord.com") ||
      text.startsWith("http://discord.com") ||
      text.startsWith("https://discord.gg")
    ) {
      icon = "discord";
    } else if (
      text.startsWith("https://www.twitch.tv") ||
      text.startsWith("http://twitch.tv")
    ) {
      icon = "twitch";
    } else if (
      text.startsWith("https://www.spotify.com") ||
      text.startsWith("http://spotify.com")
    ) {
      icon = "spotify";
    } else if (
      text.startsWith("https://www.vimeo.com") ||
      text.startsWith("http://vimeo.com")
    ) {
      icon = "vimeo";
    } else if (
      text.startsWith("https://www.soundcloud.com") ||
      text.startsWith("http://soundcloud.com")
    ) {
      icon = "soundcloud";
    } else if (
      text.startsWith("https://www.paypal.com") ||
      text.startsWith("http://paypal.com")
    ) {
      icon = "paypal";
    } else if (
      text.startsWith("https://www.amazon.com") ||
      text.startsWith("http://amazon.com")
    ) {
      icon = "amazon";
    }

    setForm((prev) => {
      const newLinks = [...prev.links];
      newLinks[index] = { ...newLinks[index], url: text, icon, label: icon };
      return { ...prev, links: newLinks };
    });
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header>
        <Appbar.Content title="Create Shop" />
      </Appbar.Header>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps
      >
        <Caption style={styles.sectionTitle}>Shop Type</Caption>
        <SegmentedButtons
          value={form.type}
          onValueChange={(value) =>
            setForm((prev) => ({ ...prev, type: value }))
          }
          style={styles.pHori}
          buttons={[
            { value: "online", label: "Online", icon: "web" },
            {
              value: "offline",
              label: "Offline",
              disabled: true,
              icon: "web-cancel",
            },
          ]}
        />

        <Caption style={styles.sectionTitle}>Resources</Caption>
        {form.banner && (
          <Image source={{ uri: form.banner }} style={styles.bannerImage} />
        )}
        <Button
          mode="contained"
          onPress={handleImagePick}
          style={styles.button}
        >
          {form.banner ? "Change Banner Image" : "Upload Banner Image"}
        </Button>
        {errors.banner && (
          <HelperText type="error">Banner image is required.</HelperText>
        )}

        <Caption style={styles.sectionTitle}>Textual Details</Caption>

        <PaperTextInput
          label={`Title (max ${MAX_TITLE_LENGTH} characters)`}
          maxLength={MAX_TITLE_LENGTH}
          value={form.title}
          onChangeText={(text) => setForm((prev) => ({ ...prev, title: text }))}
          error={errors.title}
        />
        {errors.title && (
          <HelperText type="error">Title is required.</HelperText>
        )}

        <PaperTextInput
          label={`Bio (max ${MAX_BIO_LENGTH} characters)`}
          multiline
          maxLength={MAX_BIO_LENGTH}
          value={form.bio}
          onChangeText={(text) => setForm((prev) => ({ ...prev, bio: text }))}
          style={styles.textInput}
          error={errors.bio}
        />
        {errors.bio && <HelperText type="error">Bio is required.</HelperText>}

        <Divider />

        <Caption style={styles.sectionTitle}>Links {"(Optional)"}</Caption>

        <View style={styles.linkRow}>
          {form.links.map((link, index) => (
            <PaperTextInput
              label="URL"
              value={link.url}
              onChangeText={(text) => handleUrlChange(text, index)}
              left={
                <PaperTextInput.Icon
                  icon={link.icon}
                  onPress={() => {
                    setActiveLinkIndex(index);
                  }}
                />
              }
              right={
                <PaperTextInput.Icon
                  icon="close"
                  onPress={() => {
                    handleRemoveLink(index);
                  }}
                />
              }
            />
          ))}
        </View>

        <Button icon="plus" onPress={handleAddLink} style={styles.button}>
          Add Link
        </Button>

        <Button mode="contained" onPress={handleSave} style={styles.button}>
          Save Shop Details
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  pHori: { paddingHorizontal: 10 },
  button: { margin: 8 },
  bannerImage: { width: "100%", height: 200, marginTop: 8 },
  textInput: { height: 200, marginVertical: 8 },
  sectionTitle: { padding: 16, fontSize: 18, fontWeight: "bold" },
  linkRow: { marginVertical: 8 },
});

export default CreateShop;
