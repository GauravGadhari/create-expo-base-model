import { StyleSheet, View } from 'react-native';
import { Paragraph, Title } from 'react-native-paper';

export default function CallsScreen() {
  return (
    <View style={styles.container}>
      <Title>No Calls Yet...</Title>
      <Paragraph>This feature will come sooner...</Paragraph>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
