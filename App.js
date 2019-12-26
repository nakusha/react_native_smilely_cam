import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Permissions } from "expo-permissions";
import { Camera } from "expo-camera";

export default class App extends React.Component {
  state = {
    hasPermisson: null
  };

  componentDidMount = async () => {
    const { status } = await Permissions.getAsync(Permissions.CAMERA);
    console.log(status);
  };

  render(){
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
