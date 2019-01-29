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
} from 'react-native';




export default class LoginPage extends Component {
  componentWillMount() {
    var RNFS = require('react-native-fs');

    this.setState({
      rnfsdocpath: RNFS.DocumentDirectoryPath
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>LoginPage Hi</Text>

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
