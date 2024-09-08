import React, { useEffect, useState } from "react";
import { ShopView } from "@/components/Shop";
import { ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { shopDetails } from "@/assets/data/ShopDetails";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebaseConfig";
import UserShort from "@/components/helpers/UserShort";
import { useNavigation } from "@react-navigation/native";

const IndexScreen = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;

      if (user) {
        try {
          // Fetch user data from Firestore
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserData(docSnap.data()); // Set user data from Firestore
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        } finally {
          setLoading(false); // Stop loading indicator
        }
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }
  

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      {userData && (
        <UserShort
          user={userData}
          onPress={() => navigation.navigate("CreateShop")}
        />
      )}
      <ShopView shop={shopDetails.shop} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default IndexScreen;
