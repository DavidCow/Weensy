/**
 * LOGIN PAGE
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  StyleSheet, 
  Text, 
  View,
  TouchableOpacity
} from 'react-native';
import Sound from 'react-native-sound';



export default class LoginPage extends Component {
  constructor() {
    super();
    this.onPress = this.onPress.bind(this);
    this.playSound = this.playSound.bind(this);
  }

  componentWillMount() {
    var RNFS = require('react-native-fs');


    this.setState({
      rnfsdocpath: RNFS.DocumentDirectoryPath,
      sound : new Sound('https://firebasestorage.googleapis.com/v0/b/weensy1.appspot.com/o/template_sounds%2Fkonohasenpu.ogg?alt=media&token=7aed7bc5-4813-4c8f-9b8f-1f76b87becc0',
      Sound.MAIN_BUNDLE,
      error => {
        if (error) {
          console.log(error)
        }
      })
    });
  }

  onPress = () => {
    console.log("Test");
    this.playSound(this.state.sound)
  }

  playSound(sound) {
    sound.play(() => {
      //sound.release();
    });
  }

  render() {
    return (
      <View style={styles.container}>
      <TouchableOpacity onPress={this.onPress}>  
        <Text style={styles.welcome}>LoginPage Hi</Text>
        </TouchableOpacity>
        <View style={styles.body}>
        
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
  }
});
