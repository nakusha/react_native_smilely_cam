import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from "expo-camera";

export default class App extends React.Component {
  state = {
    hasPermisson: null
  };

  componentDidMount = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status === "granted") {
      this.setState({ hasPermisson: true });
    } else {
      this.setState({ hasPermisson: false });
    }
  };

  render(){
    const { hasPermisson } = this.state;

    if ( hasPermisson === true ){
      return (
        <View>
          <Text>This App has Camra Permissions</Text>
        </View>
      );
    } else if ( hasPermisson === false ){
      return (
        <View>
          <Text>This App hasn't Camra Permissions</Text>
        </View>
      );
    } else {
      return <ActivityIndicator/>
    }
  }
}