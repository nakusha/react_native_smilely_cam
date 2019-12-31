import React from 'react';
import { ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from "expo-camera";
import styled from "styled-components";
import { MaterialIcons } from "@expo/vector-icons";

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

const IconBar = styled.View`
  margin-top:50px;
`;

export default class App extends React.Component {
  state = {
    hasPermisson: null,
    cameraType: Camera.Constants.Type.front
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
    const { hasPermisson, cameraType } = this.state;

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
            type={cameraType}
          />
          <IconBar>
            <TouchableOpacity onPress={this.switchCameraType}>
              <MaterialIcons 
                name={
                  cameraType === Camera.Constants.Type.front ? 
                  "camera-front" : "camera-rear"
                  }
                color="white"
                size={50}
              />
            </TouchableOpacity>
          </IconBar>
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

  switchCameraType = () => {
    const { cameraType } = this.state;
    if (cameraType === Camera.Constants.Type.front) {
      this.setState({
        cameraType: Camera.Constants.Type.back
      })
    } else {
      this.setState({
        cameraType: Camera.Constants.Type.front
      })
    }
  }
}