/**
 * EDIT VIDEO PAGE
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  StyleSheet, 
  Text, 
  View,
  Dimensions
} from 'react-native';
import Video from 'react-native-video';
import {
  Slider
} from 'react-native-elements';


export default class EditVideoPage extends Component {
  constructor() {
    super();
    this.onLoad = this.onLoad.bind(this);
    this.onSliderChange = this.onSliderChange.bind(this);
  }

  componentWillMount() {
    this.setState({value: 1, duration: 1});
  }

  onLoad = (data) => {
    this.setState({ duration: data.duration});
  };

  /**
   * Interpolate slider to match video and its duration to display the right frame
   */
  onSliderChange = (value) => {
    this.player.seek(value*this.state.duration);
    this.setState( { value : value });
  }

  render() {
    return (
      <View style={styles.container}>
              <View style ={styles.videoContainer}>
                        <View style={{ 
                            width: this.props.navigation.getParam('width', 100)/4,     // Change number "2" - 6 to change element number for one row
                            height: this.props.navigation.getParam('height', 100)/4,          // Set to Screenheight
                            backgroundColor: 'blue',
                          // justifyContent: 'center',
                          //  alignItems: 'center'
                        }}>
                        <Video source={{uri : this.props.navigation.getParam('uri', null), type: this.props.navigation.getParam('mime', null)}}  // Can be a URL or a local file.
                                          ref={(ref) => {
                                            this.player = ref
                                          }}                                              // Store reference
                                          onBuffer={this.onBuffer}                        // Callback when remote video is buffering
                                          onError={this.videoError}                       // Callback when video cannot be loaded
                                          onLoad={this.onLoad}
                                          style={styles.backgroundVideo} 
                                          repeat={false}
                                          paused={true} 
                                          rate={1}
                                          volume={1}
                                          muted={false}
                                          resizeMode={'stretch'}
                                          />
                      </View>
              </View>
            <Slider
              value={this.state.value}
              onValueChange={this.onSliderChange}
            />
            <Text style={{backgroundColor: 'blue'}}>Slidervalue: {this.state.value}</Text>
              <Text style={styles.welcome}>Drag Slider to adjust Beat.</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    backgroundColor: 'green'
  },/**
  box: {
    width: this.props.navigation.getParam('width', 100),     // Change number "2" - 6 to change element number for one row
    height: this.props.navigation.getParam('height', 100),          // Set to Screenheight
    backgroundColor: '#000000'
  },*/
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
