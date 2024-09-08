import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { List, Title, Caption } from "react-native-paper";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "@/firebaseConfig";
import UserShort from "@/components/helpers/UserShort";
import { ShopView } from "@/components/Shop";
import { shopDetails } from "@/assets/data/ShopDetails";

const ThirdScreen = () => {
  const [userData, setUserData] = useState<any>(null);
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserDataAndShops = async () => {
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

          // Fetch shops created by the user
          const shopsRef = collection(db, "shops");
          const q = query(shopsRef, where("userId", "==", user.uid));
          const querySnapshot = await getDocs(q);

          const fetchedShops = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setShops(fetchedShops);
        } catch (error) {
          console.error("Error fetching data: ", error);
        } finally {
          setLoading(false); // Stop loading indicator
        }
      }
    };

    fetchUserDataAndShops();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <List.Item
        title="Create Shop"
        left={(props) => <List.Icon icon="store" {...props} />}
        right={(props) => <List.Icon icon="chevron-right" {...props} />}
        onPress={() => null} // Replace with your navigation logic
      />
      <UserShort user={userData} onPress={() => null} />
      <Title style={{ paddingLeft: 10 }}>All Shops {">"}</Title>
      {shops.length > 0 ? (
        shops.map((shop) => (
          <List.Item
            key={shop.id}
            title={shop.title}
            description={shop.bio}
            left={(props) => (
              <List.Image
                {...props}
                source={{ uri: shop.banner }}
                style={{ borderRadius: 10, marginLeft: 15 }}
              />
            )}
            // onPress={() => {/* Navigate to shop details */}}
          />
        ))
      ) : (
        <Caption>No shops created by you yet.</Caption>
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

export default ThirdScreen;
