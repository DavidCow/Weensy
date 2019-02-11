/**
 * SHARE VIDEO PAGE
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  StyleSheet, 
  Text, 
  View,
} from 'react-native';
import Video from 'react-native-video';



export default class ShareVideoPage extends Component {
  componentWillMount() {
    console.log("ShareVideoPage: " + this.props.navigation.getParam('currentVideoUri', null));
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Share your Weensy on Instagra, Tik Tok, ..</Text>

        <View style={styles.body}>
        <Video source={{uri : this.props.navigation.getParam('currentVideoUri', null)}}  // Can be a URL or a local file.
                                          ref={(ref) => {
                                            this.player = ref
                                          }}                                              // Store reference
                                          onBuffer={this.onBuffer}                        // Callback when remote video is buffering
                                          onError={this.videoError}                       // Callback when video cannot be loaded
                                          onLoad={this.onLoad}
                                          onEnd={this.onEnd}
                                          style={styles.backgroundVideo} 
                                          repeat={true}
                                          paused={false} 
                                          rate={1}
                                          volume={1}
                                          muted={false}
                                          resizeMode={'stretch'}
                                          /> 
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  body: {
    flex:1
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  }
});
