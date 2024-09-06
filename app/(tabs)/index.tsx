import React from "react";
import { Button, List, Paragraph, Text, Title } from "react-native-paper";
import { View } from "react-native";
import { LightAlert, LightScrollView, LightSwitch } from "@/components/light";
import { useBottomSheet, useDrawer, useJustDialog } from "@/context";

const IndexScreen = () => {
  const [switchValue, setSwitchValue] = React.useState(false);
  const { showJustDialog, handleDialogClose } = useJustDialog();
  const { showBottomSheet } = useBottomSheet();
  const { openDrawer } = useDrawer();

  const handleShowAnimatedDialog = () => {
    showJustDialog(() => (
      <LightAlert>
        <LightAlert.Icon />
        <LightAlert.Title text="Light" />
        <LightAlert.Content>
          <Paragraph>A billion dollar company of future but now starting, we will be listed on top of google, microsoft, meta, amazon as well as possible...</Paragraph>
        </LightAlert.Content>
        <LightAlert.Actions>
          <LightAlert.DeclineButton
            text="Cancel"
            onPress={handleDialogClose}
          />
          <LightAlert.AcceptButton text="OK" onPress={handleDialogClose} />
        </LightAlert.Actions>
      </LightAlert>
    ));
  };

  const handleShowBottomSheet = () => {
    showBottomSheet(() => (
      <>
        <List.Item
          title="Bottom Sheet Content"
          description="This is the content inside the bottom sheet."
          left={(props) => <List.Icon {...props} icon="information-outline" />}
        />
        <List.Item
          title="Bottom Sheet Content"
          description="This is the content inside the bottom sheet."
          left={(props) => <List.Icon {...props} icon="information-outline" />}
        />
        <List.Item
          title="Bottom Sheet Content"
          description="This is the content inside the bottom sheet."
          left={(props) => <List.Icon {...props} icon="information-outline" />}
        />
      </>
    ));
  };

  const handleOpenDrawer = () => {
    openDrawer(
      () => (
        <View>
          <Text>This is the drawer content!</Text>
        </View>
      ),
      0.7 // Pass a custom drawerContentResize value here
    );
  };

  return (
    <LightScrollView>
      <Title style={{ textAlign: "center", padding: 10, }}>
        Me tulsi tere aangan ki bina tel ke diya jalake to dikha.
      </Title>
      <List.Item
        title="Animated Switch"
        left={(props) => <List.Icon {...props} icon="flash" />}
        right={() => (
          <LightSwitch
            value={switchValue}
            onValueChange={() => setSwitchValue(!switchValue)}
          />
        )}
        onPress={() => setSwitchValue(!switchValue)}
      />
      <List.Item
        title="Animated Dialog"
        left={(props) => <List.Icon {...props} icon="flash" />}
        onPress={handleShowAnimatedDialog}
      />
      <List.Item
        title="Show Bottom Sheet"
        left={(props) => <List.Icon {...props} icon="chevron-up" />}
        onPress={handleShowBottomSheet}
      />
      <List.Item
        title="Open Drawer with scale resize"
        left={(props) => <List.Icon {...props} icon="gesture-tap-hold" />}
        onPress={handleOpenDrawer}
      />
    </LightScrollView>
  );
};

export default IndexScreen;
