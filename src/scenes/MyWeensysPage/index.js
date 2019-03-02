/**
 * MY WEENSYS PAGE
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  StyleSheet, 
  Text, 
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity
} from 'react-native';



export default class MyWeensysPage extends Component {
  

  constructor(props) {
    super(props);
    this.loadState = this.loadState.bind(this);
    this.initState();
  }
  
  initState() {
    this.state = {
      videos : [],
      msg : 'Yo Outside Shapiro'
    };
  }
  
  componentDidMount() {
    this.loadState();
  }

  loadState() {
    var RNFS = require('react-native-fs');
    RNFS.readDir(RNFS.DocumentDirectoryPath)
        .then((result) => {
          console.log('GOT RESULT', result);
          this.setState({
            videos : result.filter(video => video.path.includes("weensy_")),
            msg : 'Yo Inside Shapiro'
          });
          return result;
          //return Promise.all([RNFS.stat(result[0].path), result[0].path]);
        })
        .catch((err) => {
            console.log("errror CONANDO "+err.message, err.code);
        });
  }

  render() {
    return (
      <ScrollView style={styles.scrollContainer}>
          <View style={styles.viewContainer}>
              { 
                this.state.videos.map((video, i) => {
                  var videoView = <View key={i} style={styles.box}><Text>V: {video.path}</Text></View>;
                  return videoView;
                })  
              }
              
              {/* <View style={styles.box}><Text>Box 1</Text></View>
              <View style={styles.box}><Text>Box 2</Text></View>
              <View style={styles.box}><Text>Box 3</Text></View>
              <View style={styles.box}><Text>Box 4</Text></View>
              <View style={styles.box}><Text>Box 5</Text></View>
              <View style={styles.box}><Text>Box 6</Text></View>
              <View style={styles.box}><Text>Box 7</Text></View>
              <View style={styles.box}><Text>Box 8</Text></View> */}
          </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  srollContainer: {
    flex: 1
  },
  viewContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 2
  },
  box: {
    margin: 2,
    width: Dimensions.get('window').width / 3 -6,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'orange'
  }
});
