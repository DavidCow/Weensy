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
  TouchableWithoutFeedback,
  Text,
  Dimensions
} from 'react-native';
import { 
  VIDEOFEED_FILENAME, 
  NUMBER_VIDEOSFEED, 
  FIREBASE_VIDEO_PREFIX, 
  FIREBASE_VIDEO_POSTFIX,
  FIREBASE_PREVIEW_FOLDERNAME
} from '../../../constants';
import { getJsonListFromFirebaseStorage, getFirebaseFileByUrl } from '../../services/firebaseHelper';
import VideoSingleForFeed from './components/videoSingleForFeed';
import { getStatusBarHeight } from 'react-native-status-bar-height';


export default class CreateWeensyPage extends Component {
  static navigationOptions = { title: 'Welcome', header: null };

  initState() {
    this.setState({
      json : [], 
      currentVideoList : [],
      videoLoadIndex : NUMBER_VIDEOSFEED
    });
  }

  componentWillMount() {
    this.onAddVideos = this.onAddVideos.bind(this);

    this.initState();

     /**
     * Initial call of setState and fetching entire videofeedlist from Firebase
     * Then setting the first 10 videos as an array into list.
     */
    getFirebaseFileByUrl(VIDEOFEED_FILENAME).then((json) => 
    this.setState({
      json : json, 
      currentVideoList : json.preview_videos.slice(0, NUMBER_VIDEOSFEED),
      videoLoadIndex : NUMBER_VIDEOSFEED
    }, function() {
      //Do this after asynchronous setState(..) call
    }))
    .catch(err => console.log("Loading video feed failed: " + err));
  }

  onAddVideos = () => {
    console.log("ADD VIDEOS videoLoadIndex: " + this.state.videoLoadIndex + " json.length: "  +this.state.json.length);
    var endIndex = this.state.videoLoadIndex + 10;
    if (this.state.videoLoadIndex+10 >= this.state.json.length) {
      console.log("END");
      endIndex = this.state.json.length;
    } else {
      this.setState({
        currentVideoList : [...this.state.currentVideoList, ...this.state.json.preview_videos.slice(this.state.videoLoadIndex, endIndex)],
        videoLoadIndex : endIndex
      });
    }
  }

  render() {
    return (
      /* List of 10 videos should be inserted into Video*/
      <View>
        <VideoContainerComponent currentVideoList={this.state.currentVideoList} videoLoadIndex={this.state.videoLoadIndex} action={this.onAddVideos}></VideoContainerComponent>
      </View>
      );
  }
}

/**
 * VideoContainerComponent holds 10 videos 
 * in a ScrollView.ok
 */
class VideoContainerComponent extends Component {

  componentWillMount() {
    this.onScrollEndDrag = this.onScrollEndDrag.bind(this);
    this.scrollToNext = this.scrollToNext.bind(this);
    this.scrollTo = this.scrollTo.bind(this);
    this.setState({
      actElement : 1,
      currentScrollPosY : 0,
      height : Dimensions.get('screen').height-getStatusBarHeight(),
      scrollThreshold : 48
    });
  }

  /**
   * input : -1 or 1 
   * -1 scroll to prev
   * 1 scroll to next
   */
  scrollToNext = (direction) => {
    var newActElement = this.state.actElement + direction;
    this.setState({
      actElement : newActElement,
      currentScrollPosY : newActElement * this.state.height
    }, function() {
      this.scrollTo();
      if (this.state.actElement % 10 == 5) {
        //Add videos from parent component
        this.props.action();
      }
    });
  }

  scrollTo = () => {
    this.scroller.scrollTo({y: this.state.currentScrollPosY, animated: true});
  }

  onScrollEndDrag = (event) => {
    if(event.nativeEvent.contentOffset.y > this.state.currentScrollPosY+this.state.scrollThreshold) {
      this.scrollToNext(1);
    } else if (event.nativeEvent.contentOffset.y < this.state.currentScrollPosY-this.state.scrollThreshold) {
      this.scrollToNext(-1);
    } else {
      this.scrollTo();
    }
    console.log("actElement: "+this.state.actElement);
  }

  render() {
    return (
      <ScrollView   
        onScrollEndDrag={this.onScrollEndDrag}
        ref={(ref) => {
          this.scroller = ref }}
        >
        <View style={styles.container} 
              ref={(ref) => {
                this.videofeedView = ref }} >
            {
              /**
               * Loop through video urls and create VideoSingleForFeed Elements
               */
              this.props.currentVideoList.map((downloadUrl, i) => {
                singleDownloadUrl = FIREBASE_VIDEO_PREFIX + FIREBASE_PREVIEW_FOLDERNAME + downloadUrl + FIREBASE_VIDEO_POSTFIX;
                try {
                  beatname = downloadUrl.split("_")[0];
                } catch(e) {
                  console.log("Could not split filename " + singleDownloadUrl + " by underscore _. Please Check the Filename: " + e);
                }
                var renderedVideoSingle = <VideoSingleForFeed ref={i} key={i} singleDownloadUrl={singleDownloadUrl} filename={beatname}/>;
                return renderedVideoSingle;
              })
            }
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
});
