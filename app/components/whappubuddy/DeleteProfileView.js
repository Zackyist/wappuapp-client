
'use strict';

// TODO: Waiting for backend to send the feedback to
// TODO: Fix colour sources to theme
// TODO: Repair navigation
// TODO: Add event and userid to props

import React, { Component } from 'react';
import { Alert, Text, View, StyleSheet, ScrollView, ParallaxView, Platform, TouchableHighlight } from 'react-native';
import Button from '../common/Button';
import { connect } from 'react-redux';
import Header from '../common/Header';
import Icon from 'react-native-vector-icons/MaterialIcons';
import deleteBuddyProfile from '../../actions/whappuBuddy';

import theme from '../../style/theme';

const isIOS = Platform.OS === 'ios';

//let headerImage = require('../../../assets/frontpage_header-bg.jpg');

class DeleteProfileView extends Component {

  onDelete() {
      Alert.alert(
        'Are you sure you want to delete your profile?!',
        '',
        [
          {text: 'Yes!', onPress: () => this.deleteProfile},
          {text: 'No', onPress: () => this.props.navigator.pop()}
        ],
        { cancelable: false }
      )
    }

    deleteProfile(){

      deleteBuddyProfile();
    }


  render() {
    return (
          <View style={styles.mainView}>
            <Text style={styles.redText}>Are you sure you want to delete your profile on WhappuBuddy?</Text>
            <Text style={styles.grayText}>If you delete your profile, other users wont be able to discover you on
              WhappuBuddy anymore.</Text>
            <Text style={styles.grayText}>All of your previous matches and chats will also be removed and cannot be recovered.
              You can, however, rejoin WhappuBuddy later on and start from blank slate.</Text>
            <Text style={styles.boldText}>Please note that leaving WhappuBuddy does not remove your Whappu App profile!</Text>
            <Button style={styles.deleteButton} onPress={this.deleteProfile}>DELETE MY WHAPPUBUDDY PROFILE</Button>
          </View>


    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    marginTop: 40
  },
  redText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'red',
    textAlign: 'center'
  },
  grayText: {
    color: 'gray',
    fontSize: 20,
    paddingTop: 20,
    textAlign: 'center'
  },
  boldText: {
    color: 'gray',
    fontWeight: 'bold',
    fontSize: 20,
    paddingTop: 20,
    textAlign: 'center'
  },
  deleteButton: {

  }


});

const select = store => {
  return {};
};


export default connect(select)(DeleteProfileView);
