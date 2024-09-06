import { StyleSheet, View } from 'react-native';
import { Paragraph, Searchbar, Title } from 'react-native-paper';

export default function StoriesScreen() {
  return (
    <View style={styles.container}>
      <Searchbar 
       placeholder='Search There....'
      />
      <Title>No Stories Yet...</Title>
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
