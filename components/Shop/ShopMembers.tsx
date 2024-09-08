import React from "react";
import { View, StyleSheet } from "react-native";
import { Avatar, Caption, List, TouchableRipple } from "react-native-paper";

interface Member {
  name: string;
  role: string;
  avatar: string;
}

interface ShopMembersProps {
  members: Member[];
}

const ShopMembers: React.FC<ShopMembersProps> = ({ members }) => {
  return (
    <View>
      <View style={styles.listSubheader}>
        <List.Subheader>Members</List.Subheader>
        <Caption>View all</Caption>
      </View>

      {members.map((member, index) => (
        <List.Item
          key={index}
          title={member.name}
          description={member.role}
          titleNumberOfLines={1}
          descriptionNumberOfLines={1}
          left={(props) => (
            <TouchableRipple onPress={() => console.log("Yap")}>
              <Avatar.Image
                size={50}
                source={{
                  uri: member.avatar,
                }}
                {...props}
              />
            </TouchableRipple>
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
});

export default ShopMembers;
