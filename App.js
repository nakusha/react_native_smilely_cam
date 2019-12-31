import React from 'react';
import { ActivityIndicator, Dimensions } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from "expo-camera";
import styled from "styled-components";

const {width, height} = Dimensions.get("window");

const CenterView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: cornflowerblue; 
`;

const Text = styled.Text`
  color: white;
  font-size:22px;
`;

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
        <CenterView>
          <Camera 
            style={{ 
              width: width - 40, 
              height: height / 1.5,
              borderRadius: 15,
              overflow: "hidden"
            }}
            type={Camera.Constants.Type.front}
          />
        </CenterView>
      );
    } else if ( hasPermisson === false ){
      return (
        <CenterView>
          <Text>This App hasn't Camra Permissions</Text>
        </CenterView>
      );
    } else {
      return (
        <CenterView>
          <ActivityIndicator/>
        </CenterView>
      );
    }
  }
}