import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, Linking, ScrollView } from "react-native";
import {
  Caption,
  IconButton,
  Paragraph,
  Title,
  List,
  Button,
  Divider,
  Tooltip,
} from "react-native-paper";
import { useBottomSheet } from "@/context/AnimatedBottomSheet";
import { useJustDialog } from "@/context/JustDialog";
import { LightAlert } from "../light";
import ShopMembers from "./ShopMembers";
import FeedbackComponent from "./FeedbackComponent";
import { LinearGradient } from "expo-linear-gradient";
import useImageColors from "../helpers/ImageColorExtracter"; // Ensure correct path
import { useDynamicTheme } from "@/context";

interface QuickLink {
  name: string;
  label: string;
  link: string;
}

interface Member {
  name: string;
  role: string;
  avatar: string;
}

interface Feedback {
  author: string;
  content: string;
  avatar: string;
  timeAgo: string;
}

interface Shop {
  title: string;
  bio: string;
  banner: string;
  images: { image: string[] };
  quick_links: QuickLink[];
  members?: Member[];
  feedback?: Feedback[];
  achived_tags?: string[];
}

interface ShopViewProps {
  shop: Shop;
}

const ShopView: React.FC<ShopViewProps> = ({ shop }) => {
  const [showMoreBio, setShowMoreBio] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [dominantColor, setDominantColor] = useState<string>("gray"); // State to store dominant color
  const { showBottomSheet, handleClose } = useBottomSheet();
  const { showJustDialog, handleDialogClose } = useJustDialog();
  const imageColors = useImageColors({ imageUri: shop.banner });
  const { setTheme } = useDynamicTheme();

  const bioLengthThreshold = 150;

  useEffect(() => {
    if (imageColors?.dominant) {
      setDominantColor(imageColors.dominant);
      setTheme(imageColors?.dominant);
    } else {
      console.error("No dominant color found or imageColors is undefined");
    }
  }, [imageColors]);

  const displayedIcons = showMore
    ? shop.quick_links
    : shop.quick_links.slice(0, 3);

  const toggleBio = () => setShowMoreBio(!showMoreBio);

  const openLinkAlert = (link: string) => {
    showJustDialog(() => (
      <LightAlert>
        <LightAlert.Icon />
        <LightAlert.Title text="Open Link?" />
        <LightAlert.Content>
          <Paragraph>
            Do you want to open {link} in your default browser?
          </Paragraph>
        </LightAlert.Content>
        <LightAlert.Actions>
          <LightAlert.DeclineButton text="Nope" onPress={handleDialogClose} />
          <LightAlert.AcceptButton
            text="Yes"
            onPress={() => {
              Linking.openURL(link).catch((err) =>
                console.error("Failed to open URL", err)
              );
              handleDialogClose();
            }}
          />
        </LightAlert.Actions>
      </LightAlert>
    ));
  };

  const handleShowAllLinks = () => {
    showBottomSheet(() => (
      <ScrollView>
        <Title style={styles.Title}>Quick Links</Title>
        {shop.quick_links.map((icon, index) => (
          <List.Item
            key={index}
            title={icon.label}
            description={icon.link}
            descriptionNumberOfLines={2}
            left={(props) => <List.Icon {...props} icon={icon.name} />}
            onPress={() => {
              openLinkAlert(icon.link);
              handleClose();
            }}
          />
        ))}
      </ScrollView>
    ));
  };

  console.log(dominantColor);

  return (
    <LinearGradient
      colors={[dominantColor, "transparent", "transparent"]} // Apply dominant color to gradient
      start={{ x: 0, y: 0 }} // Start from the top
      end={{ x: 0, y: 1 }}   // End at the bottom
      style={styles.container}
    >
      <Image
        source={
          shop.banner
            ? { uri: shop.banner }
            : require("@/assets/images/banner.jpg")
        }
        style={styles.ProfileImages}
      />
      <Title style={styles.Title}>{shop.title}</Title>
      <Paragraph
        style={styles.bioText}
        numberOfLines={showMoreBio ? undefined : 4}
      >
        {shop.bio}
      </Paragraph>

      {(shop.bio.length > bioLengthThreshold ||
        (shop.bio.length <= bioLengthThreshold &&
          shop.achived_tags &&
          shop.achived_tags.length > 0)) && (
        <View style={styles.TagsContainer}>
          {shop.bio.length > bioLengthThreshold && (
            <Caption style={styles.readMoreText} onPress={toggleBio}>
              {showMoreBio ? "Read Less" : "Read More"}
            </Caption>
          )}
          {shop.achived_tags &&
            shop.achived_tags.length > 0 &&
            shop.achived_tags.map((tag, index) => (
              <Caption key={index}>{tag}</Caption>
            ))}
        </View>
      )}

      <View style={styles.QuickLinks}>
        {displayedIcons.map((icon, index) => (
          <Tooltip key={index} title={icon.label}>
            <IconButton
              icon={icon.name}
              onPress={() => openLinkAlert(icon.link)}
            />
          </Tooltip>
        ))}
        {shop.quick_links.length > 3 && (
          <Button mode="text" onPress={handleShowAllLinks}>
            Show All
          </Button>
        )}
      </View>

      {shop.members && shop.members.length > 0 && (
        <>
          <Divider />
          <ShopMembers members={shop.members} />
        </>
      )}

      {shop.feedback && shop.feedback.length > 0 && (
        <>
          <Divider />
          <FeedbackComponent feedback={shop.feedback} />
        </>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ProfileImages: {
    width: "100%",
    height: 200,
  },
  Title: {
    textAlign: "center",
  },
  bioText: {
    padding: 7,
    paddingBottom: 0,
  },
  readMoreText: {
    paddingLeft: 7,
    paddingTop: 0,
  },
  QuickLinks: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  TagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
  },
});

export default ShopView;
