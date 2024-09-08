import React from "react";
import { View, StyleSheet, Image, ScrollView } from "react-native";
import { Caption, Title, Card, Button } from "react-native-paper";
import useImageColors from "../helpers/ImageColorExtracter"; // Ensure correct path

interface SmallShopItemProps {
  banner: string;
  title: string;
  description: string;
  tags?: string[];
}

const SmallShopItem: React.FC<SmallShopItemProps> = ({
  banner,
  title,
  description,
  tags = [],
}) => {
  const imageColors = useImageColors({ imageUri: banner });

  return (
    <Card style={styles.card}>
      <Card.Cover
        source={{ uri: banner }}
        style={styles.banner}
      />
      <Card.Content>
        <Title style={styles.title}>{title}</Title>
        <ScrollView style={styles.descriptionContainer}>
          <Caption style={styles.description} numberOfLines={2}>
            {description}
          </Caption>
        </ScrollView>
        <View style={styles.tagsContainer}>
          {tags.map((tag, index) => (
            <Caption key={index} style={styles.tag}>
              {tag}
            </Caption>
          ))}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: "hidden",
    maxWidth: 250,
  },
  banner: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  title: {
    textAlign: "center",
  },
  descriptionContainer: {
    paddingVertical: 2,
  },
  description: {
    textAlign: "center",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  tag: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 5,
  },
});

export default SmallShopItem;
