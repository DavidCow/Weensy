import React, {PureComponent} from 'react';
import Video from 'react-native-video';
import {
    StyleSheet, 
    Text, 
    View,
    Dimensions,
    TouchableOpacity,
    NativeModules,
  } from 'react-native';
import NavigationService from '../../../NavigationService';

  var ImagePicker = NativeModules.ImageCropPicker;

/**
 * Display one single video
 */
export default class VideoSingleForFeed extends PureComponent {
    constructor(props) {
      super(props);
      this.onPress = this.onPress.bind(this);
      this.state = {
          image: null,
          images: null
      };
    }
    
    pickSingle(cropit, circular=false, mediaType) {
      ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: cropit,
        cropperCircleOverlay: circular,
        compressImageMaxWidth: 400,
        compressImageMaxHeight: 400,
        compressImageQuality: 0.5,
        compressVideoPreset: 'MediumQuality',
        includeExif: true,
        mediaType: 'video'
      }).then(image => {
        console.log('RECEIVED video', image);
        this.setState({
          image: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
          images: null
        });
        NavigationService.navigate('EditVideoPage', {userName : 'user1'});
      }).catch(e => {
        console.log(e);
        Alert.alert(e.message ? e.message : e);
      });
    }

    componentWillMount() {
      this.setState({
        isVideoPaused : true
      });
    }

    onPress() {
      this.setState({ 
        isVideoPaused: false 
      }, () => {
        this.player.seek(0);
      })
    }
  
    render() {
      return (
        <TouchableOpacity
          style={styles.button}
          onPress={this.onPress}> 
                <View style={styles.box}>
                    <Video source={{uri : this.props.singleDownloadUrl}}  // Can be a URL or a local file.
                          ref={(ref) => {
                            this.player = ref
                          }}                                              // Store reference
                          onBuffer={this.onBuffer}                        // Callback when remote video is buffering
                          onError={this.videoError}                       // Callback when video cannot be loaded
                          style={styles.backgroundVideo} 
                          repeat={false}
                          paused={this.state.isVideoPaused} 
                          />
                             <TouchableOpacity
                              style={styles.button}
                              onPress={() => this.pickSingle(false)}>
                                  <Text stylel={styles.createButton}>Create Weensy</Text> 
                            </TouchableOpacity>
                </View>
        </TouchableOpacity>
          
      );
    }
  }

  const styles = StyleSheet.create({
    box: {
      margin: 2,
      width: Dimensions.get('window').width / 1 -6,     // Change number "2" - 6 to change element number for one row
      height: Dimensions.get('window').height,          // Set to Screenheight
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000000'
    },
    backgroundVideo: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
    createButton: {
      position: 'absolute',
      left: Dimensions.get('window').width * 0.7,
      top: Dimensions.get('window').height * 0.8,
      bottom: 0,
      right: 0
    }
  });