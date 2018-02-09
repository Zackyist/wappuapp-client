// TODO: Remove unnecessary imports

'use strict';

import React, { Component } from 'react';
import { Alert, Text, View, StyleSheet, ScrollView, ParallaxView, Platform, TouchableHighlight, Dimensions } from 'react-native';
import Button from '../common/Button';
import { connect } from 'react-redux';
import Header from '../common/Header';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {deleteBuddyProfile} from '../../actions/registration';
import autobind from 'autobind-decorator';

import theme from '../../style/theme';

const { height, width } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';

class DeleteProfileView extends Component {

  @autobind
  onDelete() {
      Alert.alert(
        'Are you sure you want to delete your profile?!',
        '',
        [
          {text: 'Yes!', onPress: () => this.deleteProfile()},
          {text: 'No'}
        ],
        { cancelable: false }
      )
    }

    @autobind
    deleteProfile(){
      console.log('deleteeee');

      this.props.deleteBuddyProfile();
      this.props.navigator.pop();
    }



  render() {

    return (
        <View style={styles.container}>
            <View style={styles.mainView}>
              <Text style={styles.headingText}>Are you sure you want to delete your profile on WhappuBuddy?</Text>
              <Text style={styles.mainText}>If you delete your profile, other users wont be able to discover you on
                WhappuBuddy anymore.</Text>
              <Text style={styles.mainText}>All of your previous matches and chats will also be removed and cannot be recovered.
                You can, however, rejoin WhappuBuddy later on and start from a blank slate.</Text>
              <Text style={styles.boldText}>Please note that leaving WhappuBuddy does not remove your Whappu App profile!</Text>
              <View style={styles.deleteButton}>
                <Button onPress={this.onDelete}>DELETE MY WHAPPUBUDDY PROFILE</Button>
              </View>
            </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.danger
  },
  mainView: {
    flex: 1,
    marginTop: 20,
    padding: 20
  },
  headingText: {
    fontWeight: 'bold',
    fontSize: 22,
    color: theme.accent,
    textAlign: 'center',
    marginBottom: 15
  },
  mainText: {
    color: theme.accentLight,
    fontSize: 20,
    paddingTop: 20,
    textAlign: 'center'
  },
  boldText: {
    color: theme.accentLight,
    fontWeight: 'bold',
    fontSize: 20,
    paddingTop: 35,
    textAlign: 'center'
  },
  deleteButton: {
    position: 'absolute',
    bottom: 0,
    width:width
  }


});

const mapDispatchToProps = {
  deleteBuddyProfile
};

const select = store => {
  return {};
};


export default connect(select, mapDispatchToProps)(DeleteProfileView);
