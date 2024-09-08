import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  Appbar,
  Button,
  Paragraph,
  TextInput,
  Title,
  useTheme,
  SegmentedButtons,
  HelperText,
} from "react-native-paper";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { useSnackbar } from "@/context/SnackBarContext";

// Firebase Initialization
const db = getFirestore();
const auth = getAuth();
const storage = getStorage();

// Type for form errors
interface FormErrors {
  fname?: string;
  email?: string;
  password?: string;
  age?: string;
}

const SignUp: React.FC = () => {
  const theme = useTheme();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [fname, setFname] = useState<string>("");
  const [lname, setLname] = useState<string>(""); // Optional last name
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [profession, setProfession] = useState<string>("student");
  const [age, setAge] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const { setSnackbarText, setSnackbarVisible, customStop } = useSnackbar(); // Use the Snackbar context

  // Handle Profile Picture Picker
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  // Validation Functions
  const validateFields = (): boolean => {
    const errorObj: FormErrors = {};

    if (fname.length < 3)
      errorObj.fname = "First name must be at least 3 characters long.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      errorObj.email = "Please enter a valid email address.";
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(password))
      errorObj.password =
        "Password must be at least 6 characters, include one letter and one number.";
    if (!age || isNaN(Number(age)) || Number(age) <= 0)
      errorObj.age = "Please enter a valid age.";

    setErrors(errorObj);

    return Object.keys(errorObj).length === 0;
  };

  // Upload Profile Picture to Firebase Storage
  const uploadProfilePicture = async (uri: string, uid: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    // Reference to the user's profile picture
    const storageRef = ref(storage, `users/${uid}/profilePicture.jpg`);
    await uploadBytes(storageRef, blob);

    // Get the public download URL
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  // Handle Sign Up
  const handleSignUp = async () => {
    if (!validateFields()) return;

    setLoading(true);
    setSnackbarText("Creating your profile...");
    setSnackbarVisible(true); // Show Snackbar until the process is done

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      let profilePictureURL: string | null = null;
      if (profilePicture) {
        setSnackbarText("Updating your profile picture...");
        profilePictureURL = await uploadProfilePicture(
          profilePicture,
          user.uid
        );
      }

      // Add user details to Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName: fname,
        lastName: lname || null, // Last name optional
        email,
        profession,
        age: Number(age),
        profilePicture: profilePictureURL,
      });

      // Clear form fields after success
      setFname("");
      setLname("");
      setEmail("");
      setPassword("");
      setAge("");
      setProfilePicture(null);

      setSnackbarText("User successfully signed up!");
      setTimeout(() => customStop(), 2000); // Hide the Snackbar after 2 seconds
    } catch (error: any) {
      setSnackbarText("Error signing up: " + error.message);
      setTimeout(() => customStop(), 2000); // Hide the Snackbar after showing the error
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Appbar.Header elevated>
        <Appbar.Content title="Sign Up" />
      </Appbar.Header>
      <ScrollView style={{ backgroundColor: theme.colors.background, flex: 1 }}>
        <View style={styles.container}>
          <Title style={{ textAlign: "center" }}>Create Your Account</Title>
          <Paragraph style={{ textAlign: "center" }}>
            Fill out the details to create a new account.
          </Paragraph>

          {profilePicture ? (
            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
              <Image source={{ uri: profilePicture }} style={styles.image} />
            </TouchableOpacity>
          ) : (
            <Button mode="outlined" onPress={pickImage}>
              Pick Profile Picture
            </Button>
          )}

          <TextInput
            label="First Name"
            value={fname}
            onChangeText={(text) => setFname(text)}
            mode="outlined"
            error={!!errors.fname}
          />
          {errors.fname && (
            <HelperText type="error" visible={!!errors.fname}>
              {errors.fname}
            </HelperText>
          )}

          <TextInput
            label="Last Name (Optional)"
            value={lname}
            onChangeText={(text) => setLname(text)}
            mode="outlined"
          />

          <TextInput
            label="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address"
            mode="outlined"
            error={!!errors.email}
          />
          {errors.email && (
            <HelperText type="error" visible={!!errors.email}>
              {errors.email}
            </HelperText>
          )}

          <TextInput
            label="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
            mode="outlined"
            error={!!errors.password}
          />
          {errors.password && (
            <HelperText type="error" visible={!!errors.password}>
              {errors.password}
            </HelperText>
          )}

          <TextInput
            label="Age"
            value={age}
            onChangeText={(text) => setAge(text)}
            keyboardType="numeric"
            mode="outlined"
            error={!!errors.age}
          />
          {errors.age && (
            <HelperText type="error" visible={!!errors.age}>
              {errors.age}
            </HelperText>
          )}

          <SegmentedButtons
            value={profession}
            onValueChange={setProfession}
            buttons={[
              { value: "student", label: "Student" },
              { value: "employee", label: "Employee" },
              { value: "other", label: "Other" },
            ]}
            style={styles.segmentedButton}
          />

          <Button
            mode="contained"
            loading={loading}
            onPress={handleSignUp}
            style={styles.button}
          >
            Sign Up
          </Button>
        </View>
      </ScrollView>
    </>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    gap: 3,
    padding: 16,
    flexDirection: "column",
  },
  button: {
    marginTop: 16,
  },
  segmentedButton: {
    marginVertical: 16,
  },
  imagePicker: {
    alignItems: "center",
    marginVertical: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});
