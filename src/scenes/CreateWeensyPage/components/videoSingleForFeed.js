import React, {PureComponent} from 'react';
import Video from 'react-native-video';
import {
    StyleSheet, 
    Text, 
    View,
    Dimensions,
    TouchableOpacity
  } from 'react-native';
/**
 * Display one single video
 */
export default class VideoSingleForFeed extends PureComponent {
    constructor(props) {
      super(props);
      this.onPress = this.onPress.bind(this);
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
        <View style={styles.box}>
                <Video source={{uri : this.props.singleDownloadUrl}}  // Can be a URL or a local file.
                      ref={(ref) => {
                        this.player = ref
                      }}                                      // Store reference
                      onBuffer={this.onBuffer}                // Callback when remote video is buffering
                      onError={this.videoError}               // Callback when video cannot be loaded
                      style={styles.backgroundVideo} 
                      repeat={false}
                      paused={this.state.isVideoPaused} 
                      />
                 <TouchableOpacity
                    style={styles.button}
                    onPress={this.onPress}>   
                  <Text style={{color: '#ffffff' }}> Touch Here  </Text>
                </TouchableOpacity>
        </View>
          
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
    }
  });