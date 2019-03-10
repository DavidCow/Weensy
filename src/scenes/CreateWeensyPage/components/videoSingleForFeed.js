import React, {PureComponent} from 'react';
import Video from 'react-native-video';
import {
    StyleSheet, 
    Text, 
    View,
    Dimensions,
    TouchableOpacity,
    TouchableWithoutFeedback,
    NativeModules,
    Alert
  } from 'react-native';
import NavigationService from '../../../NavigationService';
import { getJsonListFromFirebaseStorage, getFirebaseFileByUrl } from '../../../services/firebaseHelper';
import { BEATS_FILENAME, FIREBASE_VIDEO_PREFIX, FIREBASE_VIDEO_POSTFIX, FIREBASE_TEMPLATE_SOUNDS_FOLDERNAME, OGG} from '../../../../constants';
import { getStatusBarHeight } from 'react-native-status-bar-height';

var ImagePicker = NativeModules.ImageCropPicker;

/**
 * Display one single video
 */
export default class VideoSingleForFeed extends PureComponent {
    constructor(props) {
      super(props);
      this.onPress = this.onPress.bind(this);
      this.pickSingle = this.pickSingle.bind(this);
      this.onShare = this.onShare.bind(this);
      this.videoError = this.videoError.bind(this);
      this.onLoad = this.onLoad.bind(this);
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
      getFirebaseFileByUrl(BEATS_FILENAME, "").then((json) => 
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
        //width: 300,
       // height: 300,
        compressImageMaxWidth: 100,
        compressImageMaxHeight: 100,
        compressImageQuality: 0.2,
        compressVideoPreset: 'LowQuality',
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
        isVideoPaused: !this.state.isVideoPaused 
      }, () => {
        //this.player.seek(0);
      })
    }

    onShare() {
      console.log("OnShare");
    }

    videoError = (error) => {
      /**
       * 02.03.2019
       * Current Todos
       * Load all 50 videos, is the edge case correct? 50th video and ScrollView actElement correct? Check+1 -1 mechanism
       * 
       */
      console.log("VideoError: " + error.msg + error.message);
    }

    onLoad() {
      //console.log("Video loaded: " + this.props.singleDownloadUrl);
      this.player.seek(0);
    }
  
    render() {
      return (
        <TouchableWithoutFeedback
          style={styles.button}
          onPress={this.onPress}> 
                <View style={styles.box}>
                            <Video source={{uri : this.props.singleDownloadUrl}}  // Can be a URL or a local file.
                                  ref={(ref) => {
                                    this.player = ref
                                  }}                                              // Store reference
                                  onBuffer={this.onBuffer}                        // Callback when remote video is buffering
                                  onError={this.videoError}                       // Callback when video cannot be loaded
                                  onLoad={this.onLoad}
                                  style={styles.backgroundVideo} 
                                  repeat={true}
                                  paused={this.state.isVideoPaused} 
                                  volume={1}
                                  muted={false}
                                  rate={1}
                                  />
                              <TouchableWithoutFeedback
                                  style={styles.button}
                                  onPress={() => this.pickSingle(this.props.filename)} >
                                          <Text style={styles.createButton}>Create Weensy</Text> 
                              </TouchableWithoutFeedback>
                              <TouchableWithoutFeedback
                                  style={styles.button}
                                  onPress={() => console.log("Share")} >
                                          <Text style={styles.shareButton}>Share</Text> 
                              </TouchableWithoutFeedback>
                              <Text style={styles.songtitle}>Song Title - Artist</Text> 
                </View>
        </TouchableWithoutFeedback>
          
      );
    }
  }

  const styles = StyleSheet.create({
    box: {
      width: Dimensions.get('screen').width,     // Change number "2" - 6 to change element number for one row
      height: Dimensions.get('screen').height - getStatusBarHeight(),          // Set to Screenheight
      //justifyContent: 'center',
      //alignItems: 'center',
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
      left: Dimensions.get('screen').width * 0.7,
      top: (Dimensions.get('screen').height-getStatusBarHeight()) * 0.6,
      color: 'white'
    },
    shareButton: {
      position: 'absolute',
      left: Dimensions.get('screen').width * 0.7,
      top: (Dimensions.get('screen').height-getStatusBarHeight()) * 0.634,
      color: 'white'
    },
    songtitle: {
      position: 'absolute',
      left: Dimensions.get('screen').width * 0.08,
      top: (Dimensions.get('screen').height-getStatusBarHeight()) * 0.74,
      color: 'rgba(255,255,255,0.75)',
      fontSize: 15
    }
  });