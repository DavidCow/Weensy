import React, {PureComponent} from 'react';
import Video from 'react-native-video';
import {
    StyleSheet, 
    Text, 
    View,
    Dimensions,
    TouchableOpacity,
    NativeModules,
    Alert
  } from 'react-native';
import NavigationService from '../../../NavigationService';
import { getJsonListFromFirebaseStorage } from '../../../services/firebaseHelper';
import { BEATS_FILENAME, FIREBASE_VIDEO_PREFIX, FIREBASE_VIDEO_POSTFIX, FIREBASE_TEMPLATE_SOUNDS_FOLDERNAME, OGG} from '../../../../constants'

var ImagePicker = NativeModules.ImageCropPicker;

/**
 * Display one single video
 */
export default class VideoSingleForFeed extends PureComponent {
    constructor(props) {
      super(props);
      this.onPress = this.onPress.bind(this);
      this.pickSingle = this.pickSingle.bind(this);
      this.state = {
          image: null,
          images: null
      };
    }
    
    pickCamera() {
      ImagePicker.openCamera({
        mediaType: 'video',
      }).then(image => {
        console.log("Video has been recorded: " + image);
        NavigationService.navigate('EditVideoPage', {uri: image.path, width: image.width, height: image.height, mime: image.mime});
      });
    }
      
     /**
      * Get beats.json for frequencies
      */
    setSelectedBeat() {
      getJsonListFromFirebaseStorage(BEATS_FILENAME, "").then((json) => 
      this.setState({
        selectedBeat : json.beats[this.props.filename]
      }, function() {
        console.log("Selected Beat loaded and ready." + this.state.selectedBeat["frequency"]);
      }))
      .catch(err => console.log("Beat could not been accessed from Firebase storage: " + err));
    }

     /**
      * Get beats.json for frequencies
      */
     setSelectedTemplateSound() {
      //getDownloadUrlFromFirebaseStorage(GS_PATH + FIREBASE_TEMPLATE_SOUNDS_FOLDERNAME + "/" + this.props.filename).then((soundUri) => 
      var soundUri = FIREBASE_VIDEO_PREFIX + FIREBASE_TEMPLATE_SOUNDS_FOLDERNAME + this.props.filename + OGG + FIREBASE_VIDEO_POSTFIX;
      this.setState({
        templateSoundBeatUri : soundUri
      }, function() {
        console.log("Selected Beat Sound Uri loaded and ready." + this.state.templateSoundBeatUri);
      });
      
    }

    pickSingle() {
      this.setSelectedBeat();
      this.setSelectedTemplateSound();
      ImagePicker.openPicker({
        width: 300,
        height: 300,
        //cropping: cropit,
        //cropperCircleOverlay: circular,
        compressImageMaxWidth: 400,
        compressImageMaxHeight: 400,
        compressImageQuality: 0.5,
        compressVideoPreset: 'MediumQuality',
        includeExif: true,
        mediaType: 'video'
      }).then(image => {
        console.log('SUCCESSFULLY RECEIVED VIDEO', image);
        /**
         * Navigate to Processing Weensy Page (Edit Video Page)
         */
        NavigationService.navigate('EditVideoPage', {uri: image.path, width: image.width, height: image.height, mime: image.mime, selectedBeat : this.state.selectedBeat, templateSoundBeatUri : this.state.templateSoundBeatUri});
      }).catch(e => {
        console.log("Selecting Video from Gallery has not succeeded: " + e);
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
                          volume={1}
                          muted={false}
                          rate={1}
                          />
                             <TouchableOpacity
                              style={styles.button}
                              onPress={() => this.pickSingle(this.props.filename)}>
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