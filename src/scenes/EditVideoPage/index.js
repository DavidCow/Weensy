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
  TouchableOpacity
} from 'react-native';
import Video from 'react-native-video';
import { Slider } from 'react-native-elements';
import Sound from 'react-native-sound';
import {calculateTimeBetweenTwoTimecodesInInt, convertSecToMS, convertMsToSec} from './services/timecodeHelper';

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

    this.playSound = this.playSound.bind(this);
  }

  componentWillMount() {
    this.setState({
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
  
  render() {
    return (
      <View style={styles.container}>
              <View style ={styles.videoContainer}>
                        <View style={{ 
                            width: this.props.navigation.getParam('width', 100)/4,     // Change number "2" - 6 to change element number for one row
                            height: this.props.navigation.getParam('height', 100)/4,          // Set to Screenheight
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
              </View>
            <Slider value={this.state.value} onValueChange={this.onSliderChange} />
            <TouchableOpacity onPress={this.onPressPlay}> 
              <Text>PLAY</Text> 
            </TouchableOpacity>
            <Text style={{backgroundColor: 'blue'}}>Beat position {Math.round(this.state.selectedBeatPosition*100)/100}</Text>
            <Text style={styles.welcome}>Drag Slider to adjust Beat.</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: 'green'
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
    backgroundColor: 'blue'
  }
});
