/**
 * EDIT VIDEO PAGE
 * @format
 * @flow
 */
import React, {Component} from 'react';
import {
  StyleSheet, 
  Text, 
  View,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  CameraRoll,
  StatusBar
} from 'react-native';
import Video from 'react-native-video';
import { Slider } from 'react-native-elements';
import Sound from 'react-native-sound';
import NavigationService from './../../NavigationService';
import {calculateTimeBetweenTwoTimecodesInInt, convertSecToMS, convertMsToSec, calculateEndOfClip, convertDurationInSecToTimeCode} from './services/timecodeHelper';
import {createCommand, executeCommand, addToMergeFile} from './services/ffmpegHelper';
import { RNFFmpeg } from 'react-native-ffmpeg';
import { MP4 } from '../../../constants';


/**
 * TODO:
 * 1 PLAY only plays once
 * 2 Drag Slider
 * 3 Merge clippings PREVIEW LIKE
 * 4 Next button : Render with ffmpeg 
 * 5 Adjust pitches to frequencies
 * 6 Next button
 */
export default class EditVideoPage extends Component {
  constructor() {
    super();
    //Video bindings
    this.onLoad = this.onLoad.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onSliderChange = this.onSliderChange.bind(this);
    this.onPressPlay = this.onPressPlay.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.resetIndex = this.resetIndex.bind(this);
    this.onPressNext = this.onPressNext.bind(this);

    this.playSound = this.playSound.bind(this);
    
  }
  componentDidMount() {
    StatusBar.setHidden(true, 'slide');
  }
  componentWillMount() {
    var RNFS = require("react-native-fs");
    var rawHeight = this.props.navigation.getParam('height');
    var rawWidth = this.props.navigation.getParam('width');
    var videoHeight = 0;
    var videoWidth = 0;
    if (rawHeight > rawWidth) {
      let multiplicator = (Dimensions.get('window').height / 2) / rawHeight;
      videoHeight = Dimensions.get('window').height / 2;
      videoWidth = multiplicator * rawWidth;
    } else if (rawHeight <= rawWidth) {
      let multiplicator = Dimensions.get('window').width / rawWidth;
      videoWidth = Dimensions.get('window').width;
      videoHeight = multiplicator * rawHeight;
    }


    this.setState({
      videoHeight: videoHeight,
      videoWidth: videoWidth,
      showLoadingIndicator : false,
      rnfsdocpath : RNFS.DocumentDirectoryPath,
      value : 0.5,
      clippings : this.props.navigation.getParam('selectedBeat', null)["clippings"],
      clipIndex : 1,
      clipLastIndex : this.props.navigation.getParam('selectedBeat', null)["clippings"].length-1,
      frequency : this.props.navigation.getParam('selectedBeat', null)["frequency"],
      optionalstart : this.props.navigation.getParam('selectedBeat', null)["optionalstart"],
      optionalend : this.props.navigation.getParam('selectedBeat', null)["optionalend"],
      currentVideoUri : this.props.navigation.getParam('uri', null),
      paused : true,
      templateSoundUri : this.props.navigation.getParam('templateSoundBeatUri', null),
      templateSound : new Sound(this.props.navigation.getParam('templateSoundBeatUri', ""),
        undefined,
        error => {
          if (error) {
            console.log(error)
          }
        })
    });
    console.log("EDIT WEENSY PAGE YES!!: "+this.props.navigation.getParam('selectedBeat', null)["clippings"].length);
  }

  onLoad = (data) => {
    this.setState({ 
      duration : convertSecToMS(data.duration),
      selectedBeatPosition : (data.duration/2),            // Set slider to half and also selectedBeatPosition to half
      endOfCurrentClippingTimecode : ((convertSecToMS(data.duration)/2)+calculateTimeBetweenTwoTimecodesInInt(this.state.clippings[0], this.state.clippings[1])),
    }, function() {
     // this.player.seek(this.state.selectedBeatPosition);
      console.log("Selected beat position: "+this.state.selectedBeatPosition);
    });
  };

  onEnd = (data) => {
    //this.setState({ paused : true});
    this.resetIndex();
    console.log("videoend");
  }
  
  resetIndex() {
    this.setState({
      clipIndex : 1,
      endOfCurrentClippingTimecode : (convertSecToMS(this.state.selectedBeatPosition)+calculateTimeBetweenTwoTimecodesInInt(this.state.clippings[0], this.state.clippings[1]))
    });
  }

  onSliderChange = (value) => {
    interpolatedVideoPosition = (value*convertMsToSec(this.state.duration));
    this.player.seek(interpolatedVideoPosition);
    this.setState({ 
      value : value,
      selectedBeatPosition : interpolatedVideoPosition
    }, function() {
      this.resetIndex();
    });
  }

  onPressPlay = () => {
    console.log("Press Play selectedBeatPosition: " + this.state.selectedBeatPosition);
    this.resetIndex();
    this.player.seek(this.state.selectedBeatPosition);
    this.setState({
      paused : false
    });

    ///TODO : SOUND ONLY PLAYS ONCE, DO I HAVE TO REDOWNLOAD IT EVERYTIME? OR RESET SOMETHING
    this.playSound(this.state.templateSound);
  }

  playSound(sound) {
    sound.play(() => {
      // Release when it's done so we're not using up resources
      //sound.release();
    });
  }

  /** Video Move Progress */
  onProgress = (progressValues) => {
    var currentTime = convertSecToMS(progressValues["currentTime"]);
    if (currentTime > this.state.endOfCurrentClippingTimecode) {
      if (this.state.clipIndex==this.state.clipLastIndex+1) {
        //STOP VIDEO after last clipping end (plus 1500 ms)
        this.setState({
          paused : true
        });
        console.log("single video preview circle end");
      } else {
        //Keep calculating next current clipping end
        var nextClipIndex = (this.state.clipIndex + 1);
        if (nextClipIndex > this.state.clipLastIndex) {
          this.setState({
            endOfCurrentClippingTimecode : currentTime + 1500,
            clipIndex : nextClipIndex
          });
        } else {
          //TODO: CHANGE FREQUENCY HERE
          this.player.seek(this.state.selectedBeatPosition);
          this.setState({
            endOfCurrentClippingTimecode : (convertSecToMS(this.state.selectedBeatPosition)+calculateTimeBetweenTwoTimecodesInInt(this.state.clippings[this.state.clipIndex], this.state.clippings[this.state.clipIndex+1])),
            clipIndex : nextClipIndex
          }); 
        }
      }
    }
  }
  
  /***
   * Render video and navigate to "Share" Page
   */
  onPressNext() {
      this.setState({
        showLoadingIndicator : true
      });

      console.log("Rendering video now..");
      var RNFS = require('react-native-fs');

      //PREPARE VARIABLES FOR CLIPPINGS GENERATION
      var lastTimeCode = "00:00:00.000";
      var mergeFileTxt = "";
      var clippings = this.state.clippings;
      var TMP_VIDEO_NAME = "tmp_merge_video";

      //LOOPS THROUGH CLIPPINGS AND CREATES THE VIDEO
      for (var i=0; i < clippings.length; i++) {;
        if (i == 0) {
          lastTimeCode = clippings[clippings.length-(i+1)];
          continue;
        }
    
        //TMP NAME FOR SINGLE CLIP
        var outputFilename = TMP_VIDEO_NAME+i+MP4;

        //ADD 'file %path%' to string
        mergeFileTxt = addToMergeFile(mergeFileTxt, RNFS.DocumentDirectoryPath + "/" + outputFilename);
    
        //CALCULATE END TIMECODE of current clip calculateEndOfClip("00:00:00.123", 200) -> "00:00:00.323"
        var endOfClipTimeCode = calculateEndOfClip(convertDurationInSecToTimeCode(this.state.selectedBeatPosition), calculateTimeBetweenTwoTimecodesInInt(lastTimeCode, clippings[clippings.length-(i+1)]));
    
        //FFMPEG CMD TO CROP VIDEO
        let command = createCommand(this.state.currentVideoUri, RNFS.DocumentDirectoryPath + "/" +outputFilename, this.state.selectedBeatPosition, endOfClipTimeCode, "");
        
        executeCommand(command);

        //TODO: USE path : RNFS.DocumentDirectoryPath + "/" +outputFilename      CREATE FREQUENCY CHANGED CLIP HERE

        lastTimeCode = clippings[clippings.length-(i+1)];
      };

      //WRITE MERGEFILE
      var path = RNFS.DocumentDirectoryPath + '/tmp_mergefile.txt';
      RNFS.writeFile(path, mergeFileTxt, "utf8")  
         .then((success) => {
           console.log('FILE WRITTEN!');
         })
         .catch((err) => {
           console.log("FILE NOT WRITTEN! Error: " + err.message);
      });
      
      //FFMPEG MERGE CMD
    var command = '-f concat -safe 0 -i '+ RNFS.DocumentDirectoryPath   +'/tmp_mergefile.txt -c copy '+ RNFS.DocumentDirectoryPath   +'/merged.mp4';
    
    //MERGE -> MIX AUDIO IN -> NAVIGATE
    RNFFmpeg.execute(command).then(result => {
      command = '-y -i ' + RNFS.DocumentDirectoryPath   +'/merged.mp4 -i ' + this.state.templateSoundUri + ' -filter_complex amerge ' + RNFS.DocumentDirectoryPath   +'/mergedWithMusic.mp4';
      RNFFmpeg.execute(command).then(result => {
        CameraRoll.saveToCameraRoll(RNFS.DocumentDirectoryPath + '/mergedWithMusic.mp4', 'video').then(() => {
          NavigationService.navigate('ShareVideoPage', {params: this.props.navigation.state.params, currentVideoUri: RNFS.DocumentDirectoryPath   +'/mergedWithMusic.mp4'});
        }).catch((err) => console.log('Error: Merged File could not be saved into camera roll. Msg: ' + err));
      });
    });
 
    
  //TODOS
  ////1b(optional for now) (add intro and outro)
  ////1cchange frequency of these clippings  (research best way: frontend library VS native library)
  //ui - show progress w/ "seconds left" or "bar" or both
  //finally: consider using this algorithm for the preview
  //future: add zoom, filters, mirror
  //IMPORTANT!!!! CALIBRATE TIMING MUSIC AND VIDEO
  }

  render() {
    return (
      <View style={styles.container}>
              <TouchableOpacity onPress={this.onPressNext} style={styles.pressNextButtonTouchable}> 
                <Text style={styles.nextButton}>NEXT</Text> 
              </TouchableOpacity>
              {
              this.state.showLoadingIndicator ? 
              <ActivityIndicator /> : <View />
              }
              <View style ={styles.videoContainer}>
              <TouchableOpacity onPress={this.onPressPlay}> 
                        <View style={{ 
                            width: this.state.videoWidth,             // Change number "2" - 6 to change element number for one row
                            height: this.state.videoHeight,           // Set to Screenheight
                            backgroundColor: 'blue',
                        }}>
                         
                                    <Video source={{uri : this.state.currentVideoUri, type: this.props.navigation.getParam('mime', null)}}  // Can be a URL or a local file.
                                                      ref={(ref) => {
                                                        this.player = ref
                                                      }}                                              // Store reference
                                                      onBuffer={this.onBuffer}                        // Callback when remote video is buffering
                                                      onError={this.videoError}                       // Callback when video cannot be loaded
                                                      onLoad={this.onLoad}
                                                      onEnd={this.onEnd}
                                                      onProgress={this.onProgress}
                                                      style={styles.backgroundVideo} 
                                                      repeat={false}
                                                      paused={this.state.paused} 
                                                      rate={1}
                                                      volume={1}
                                                      muted={false}
                                                      resizeMode={'stretch'}
                                          /> 
                      </View>
                          </TouchableOpacity>
              </View>
            <Slider value={this.state.value} onValueChange={this.onSliderChange} style={styles.slider}/>
            <Text style={styles.timecode}>{Math.round(this.state.selectedBeatPosition*100)/100} / {Math.round(convertMsToSec(this.state.duration))}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: 'red',
    backgroundColor: 'blue'
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  videoContainer: {
    width: Dimensions.get('window').width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black'
  },
  pressNextButtonTouchable: {
    width: Dimensions.get('window').width,
    alignItems: 'flex-end'
  },
  nextButton: {
    color: 'blue',
    fontSize: 25
  },
  slider: {
    marginTop: "-3%"
  },
  timecode: {
    marginTop: "-3%",
    marginLeft: "2%"
  }
});
