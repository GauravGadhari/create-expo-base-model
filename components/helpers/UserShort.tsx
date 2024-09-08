import React from "react";
import { List, Avatar, IconButton } from "react-native-paper";

interface UserShortProps {
  user: {
    firstName: string;
    lastName?: string | null;
    email: string;
    profession: string;
    age: number;
    profilePicture?: string | null;
  };
  onPress: () => void;
}

const UserShort: React.FC<UserShortProps> = ({ user, onPress }) => {
  const displayName = user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.firstName;

  return (
    <List.Item
      title={displayName || "No Name"}
      description={user.email}
      left={(props) =>
        user.profilePicture ? (
          <Avatar.Image {...props} size={40} source={{ uri: user.profilePicture }} />
        ) : (
          <Avatar.Text {...props} size={40} label={user.firstName?.charAt(0) || "U"} />
        )
      }
      // right={(props) => <IconButton {...props} icon="chevron-right" />}
      onPress={onPress}
    />
  );
};

export default UserShort;
