/**
 * CREATE WEENSY PAGE
 * Shows Weensys and lets users watch the video
 * and tap a button inside the video to create
 * their own Weensy.
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  StyleSheet, 
  Text, 
  View,
} from 'react-native';



export default class CreateWeensyPage extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Create a Weensy now!</Text>

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
