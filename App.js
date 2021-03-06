import React from 'react';
import { ActivityIndicator, Dimensions, TouchableOpacity, Platform } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from "expo-camera";
import styled from "styled-components";
import { MaterialIcons } from "@expo/vector-icons";
import * as FaceDetector from 'expo-face-detector';
import * as MediaLibrary from 'expo-media-library';

const {width, height} = Dimensions.get("window");
const ALBUM_NAME = "Smiley Cam";

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
  constructor(props){
    super(props);
    this.state = {
      hasPermisson: null,
      cameraType: Camera.Constants.Type.front,
      smileDetected: false
    };
    this.cameraRef = React.createRef();
  }

  componentDidMount = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status === "granted") {
      this.setState({ hasPermisson: true });
    } else {
      this.setState({ hasPermisson: false });
    }
  };

  render(){
    const { hasPermisson, cameraType, smileDetected } = this.state;

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
            onFacesDetected={smileDetected ? null : this.onFacesDetected}
            faceDetectorSettings={{
              detectLandmarks:FaceDetector.Constants.Landmarks.all,
              runClassifications:FaceDetector.Constants.Classifications.all
            }}
            ref={this.cameraRef}
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

  onFacesDetected = ({faces}) => {
    const face = faces[0];
    if (face) {
      if (face.smilingProbability > 0.8){
        this.setState({
          smileDetected: true
        })
        this.takePhoto();
      }
    }
  }

  takePhoto = async () => {
    try{
      if (this.cameraRef.current){
        let {uri} = await this.cameraRef.current.takePictureAsync({
          quality:1
        });
        if (uri) {
          this.savePhoto(uri)
        }
      }
    }catch(error){
      alert(error);
      setTimeout(() => {
        this.setState({
          smileDetected: false
        })  
      }, (2000));
      
    }
  }

  savePhoto = async (uri) => {
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status === "granted") {
        const asset = await MediaLibrary.createAssetAsync(uri);
        let album = await MediaLibrary.getAlbumAsync(ALBUM_NAME);
        if (album === null) {
          album = await MediaLibrary.createAlbumAsync(ALBUM_NAME, asset);
        } else { 
          await MediaLibrary.addAssetsToAlbumAsync([asset], album.id);
        }
        this.setState({
          smileDetected: false
        })
      } else {
        this.setState({hasPermisson: false});
      }
    }catch{

    }finally{

    }
  }
}