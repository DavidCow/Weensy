/**
 * CREATE WEENSY PAGE
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
import { URL_PREFIX } from '../../../constants';


export default class CreateWeensyPage extends Component {

  componentWillMount() {
    console.log("HALLO " + URL_PREFIX);
    fetch(URL_PREFIX + "/videofeed.json")
            .then(response => response.json() )
            .then(data => {
              console.log("Hallo du Namek"); 
              console.log(data)
            } )
            .catch(error => console.log(error));
  }

  render() {
    return (
      <VideoContainerComponent url={{uri: "https://www.davidcaos.com/weensy/cap.mp4"}}></VideoContainerComponent>
    );
  }
}

/**
 * VideoContainerComponent holds 10 videos 
 * in a ScrollView.
 */
class VideoContainerComponent extends Component {
  render() {
    return (
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
                   <VideoSingleForFeed url={this.props.url} />
                   <VideoSingleForFeed url={this.props.url} />
                   <VideoSingleForFeed url={this.props.url} />
        </View>
      </ScrollView>
    );
  }
}

/**
 * Display one single video
 */
class VideoSingleForFeed extends Component {
  render() {
    return (
      <View style={styles.box}>
              <Video source={this.props.url}  // Can be a URL or a local file.
                    ref={(ref) => {
                      this.player = ref
                    }}                                      // Store reference
                    onBuffer={this.onBuffer}                // Callback when remote video is buffering
                    onError={this.videoError}               // Callback when video cannot be loaded
                    style={styles.backgroundVideo} 
                    repeat={false}/>
       </View>
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
