import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Avatar, List, Caption } from "react-native-paper";

interface Feedback {
  author: string;
  content: string;
  avatar: string;
  timeAgo: string;
}

interface FeedbackComponentProps {
  feedback: Feedback[];
}

const FeedbackComponent: React.FC<FeedbackComponentProps> = ({ feedback }) => {
  const [expandedFeedback, setExpandedFeedback] = useState<number | null>(null);

  const toggleFeedback = (index: number) => {
    setExpandedFeedback(expandedFeedback === index ? null : index);
  };

  return (
    <View>
      <View style={styles.listSubheader}>
        <List.Subheader>Feedback</List.Subheader>
        <Caption>View all</Caption>
      </View>

      {feedback.map((item, index) => (
        <List.Item
          key={index}
          title={item.author}
          onPress={() => toggleFeedback(index)}
          description={item.content}
          titleNumberOfLines={1}
          descriptionNumberOfLines={expandedFeedback === index ? null : 2}
          left={(props) => (
            <Avatar.Image
              size={50}
              source={{ uri: item.avatar }}
              {...props}
            />
          )}
          right={() => (
            <View style={styles.ratingContainer}>
              <Caption>{item.timeAgo}</Caption>
            </View>
          )}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  listSubheader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 15,
  },
  ratingContainer: {
    alignItems: "flex-end",
    paddingLeft: 5,
  },
});

export default FeedbackComponent;
