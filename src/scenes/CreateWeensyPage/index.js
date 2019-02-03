/**
 * CREATE WEENSY PAGE
 * @format
 * @flow
 */
import React, {Component} from 'react';
import {
  StyleSheet, 
  View,
  ScrollView,
} from 'react-native';
import { 
  VIDEOFEED_FILENAME, 
  NUMBER_VIDEOSFEED, 
  FIREBASE_VIDEO_PREFIX, 
  FIREBASE_VIDEO_POSTFIX,
  FIREBASE_PREVIEW_FOLDERNAME
} from '../../../constants';
import { getJsonListFromFirebaseStorage } from '../../services/firebaseHelper';
import VideoSingleForFeed from './components/videoSingleForFeed';


export default class CreateWeensyPage extends Component {
  static navigationOptions = { title: 'Welcome', header: null };

  componentWillMount() {
    /**
     * Set inital state so render is possible
     */
    this.setState({
      json : [], 
      currentVideoList : [],
      videoLoadIndex : NUMBER_VIDEOSFEED
    });
        /**
     * Initial call of setState and fetching entire videofeedlist from Firebase
     * Then setting the first 10 videos as an array into list.
     */
    getJsonListFromFirebaseStorage(VIDEOFEED_FILENAME).then((json) => 
    this.setState({
      json : json, 
      currentVideoList : json.preview_videos.slice(0, NUMBER_VIDEOSFEED),
      videoLoadIndex : NUMBER_VIDEOSFEED
    }, function() {
      //Do this after asynchronous setState(..) call
    }))
    .catch(err => console.log(err));
  }

  render() {
    return (
      /* List of 10 videos should be inserted into Video*/
      <VideoContainerComponent currentVideoList={this.state.currentVideoList} videoLoadIndex={this.state.videoLoadIndex}></VideoContainerComponent>
      );
  }
}

/**
 * VideoContainerComponent holds 10 videos 
 * in a ScrollView.ok
 */
class VideoContainerComponent extends Component {
  render() {
    return (
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
            {
              /**
               * Loop through video urls and create VideoSingleForFeed Elements
               */
              this.props.currentVideoList.map(function(downloadUrl, i) {
                singleDownloadUrl = FIREBASE_VIDEO_PREFIX + FIREBASE_PREVIEW_FOLDERNAME + downloadUrl + FIREBASE_VIDEO_POSTFIX;
                try {
                  beatname = downloadUrl.split("_")[0];
                } catch(e) {
                  console.log("Could not split filename " + singleDownloadUrl + " by underscore _. Please Check the Filename: " + e);
                }
                return <VideoSingleForFeed key={i} singleDownloadUrl={singleDownloadUrl} filename={beatname}/>
              })
            }
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
  }
});
