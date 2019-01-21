/**
 * MY WEENSYS PAGE
 * 
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  StyleSheet, 
  Text, 
  View,
  ScrollView,
  Dimensions
} from 'react-native';
import Video from 'react-native-video';


export default class MyWeensysPage extends Component {
  render() {
    return (
      <ScrollView style={styles.scrollContainer}>

        <View style={styles.container}>
          <View style={styles.box}><Video source={{uri: "https://www.davidcaos.com/weensy/cap.mp4"}}   // Can be a URL or a local file.
                ref={(ref) => {
                  this.player = ref
                }}                                      // Store reference
                onBuffer={this.onBuffer}                // Callback when remote video is buffering
                onError={this.videoError}               // Callback when video cannot be loaded
                 style={styles.backgroundVideo} 
                 repeat={false}/></View>
                   <View style={styles.box}><Video source={{uri: "https://www.davidcaos.com/weensy/konohasenpu.mp4"}}   // Can be a URL or a local file.
                ref={(ref) => {
                  this.player = ref
                }}                                      // Store reference
                onBuffer={this.onBuffer}                // Callback when remote video is buffering
                onError={this.videoError}               // Callback when video cannot be loaded
                 style={styles.backgroundVideo} 
                 repeat={false}/></View>
                   <View style={styles.box}><Video source={{uri: "https://www.davidcaos.com/weensy/cap.mp4"}}   // Can be a URL or a local file.
                ref={(ref) => {
                  this.player = ref
                }}                                      // Store reference
                onBuffer={this.onBuffer}                // Callback when remote video is buffering
                onError={this.videoError}               // Callback when video cannot be loaded
                 style={styles.backgroundVideo} 
                 repeat={false}/></View>
                 
          <View style={styles.box}><Text>Box 2</Text></View>
          <View style={styles.box}><Text>Box 3</Text></View>
          <View style={styles.box}><Text>Box 4</Text></View>
          <View style={styles.box}><Text>Box 5</Text></View>
          <View style={styles.box}><Text>Box 6</Text></View>
          <View style={styles.box}><Text>Box 7</Text></View>
          <View style={styles.box}><Text>Box 8</Text></View>
          <View style={styles.box}><Text>Box 9</Text></View>
        </View>

      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 2,
  },
  box: {
    margin: 2,
    width: Dimensions.get('window').width / 1 -6,     // Change number "2" - 6 to change element number for one row
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1c40f'
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  }
});
