// TODO: Remove unused imports

'use strict';

import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  Platform, 
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
  closeBuddyIntroView,
  openBuddyIntroView,
  openBuddyRegistrationView
} from '../../actions/registration';

import theme from '../../style/theme';
import Button from '../../components/common/Button';

const { height, width } = Dimensions.get('window');
const IOS = Platform.OS === 'ios';

class BuddyIntroView extends Component {
  @autobind
  onRequestClose() {
    this.props.closeBuddyIntroView();
  }

  @autobind
  onSignUp() {
    this.props.closeBuddyIntroView();
    this.props.openBuddyRegistrationView();
  }

  render() {
    const { userName, isBuddyIntroViewOpen } = this.props;

    return (
      <Modal
        visible={isBuddyIntroViewOpen}
        animationType={'slide'}
        onRequestClose={this.onRequestClose}
      >
        <View style={styles.viewContainer}>
          <ScrollView
            ref={view => this.containerScrollViewRef = view}
            showsVerticalScrollIndicator={false}
            style={styles.container}
          >
            <View style={styles.innerContainer}>
              <View style={styles.headingContainer}>
                <Text style={styles.heading}>Hello</Text>
                <Text style={styles.heading}>{userName}!</Text>
              </View>
              <Text style={styles.helpText}>Welcome to WhappuBuddy! It's the modern way to find new friends to spend this Wappu with.</Text>
              <View style={styles.imagesContainer}>
                <Image style={{width: 50, height: 50, marginHorizontal: 25}} source={require('../../../assets/thumbDown.png')}/>
                <Image style={{width: 50, height: 50, marginHorizontal: 25}} source={require('../../../assets/thumbUp.png')}/>
              </View>
              <Text style={styles.helpText}>Just browse profiles and thumb them up or down. Matched users will be able to chat with each other.</Text>
              <View style={styles.imagesContainer}>
                <Image style={{width: 30, height: 30, marginHorizontal: 25}} source={require('../../../assets/skipButton.png')}/>
              </View>
              <Text style={styles.helpText}>You can browse potential buddies without registering but you cannot give anyone a thumbs up or down.</Text>
              <Text style={styles.adviceText}>So let's sign you up!</Text>
            </View>
            
            <Button
              onPress={this.onSignUp}
              style={styles.button}
              isDisabled={false}
            >
              Sign me up!
            </Button>
            <Button
              onPress={this.onRequestClose}
              style={styles.button}
              isDisabled={false}
            >
              I'll register later
            </Button>
          </ScrollView>
        </View>
      </Modal>
    );
  }
};



const styles = StyleSheet.create({
  adviceText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: theme.accentLight,
    marginBottom: 15,
    marginTop: 15
  },
  button: {
    height: 50,
    borderRadius: 0,
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    marginTop: 5
  },
  container: {
    flex: 1,
    backgroundColor: theme.secondary,
    paddingBottom: 20,
  },
  header: {
    flex:1,
    elevation: 3,
    paddingTop: 30,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: theme.accentLight
  },
  headingContainer: {
    marginBottom: 15,
  },
  helpText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'justify',
    color: theme.light,
    marginBottom: 5,
  },
  imagesContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  innerContainer: {
    flex:1,
    paddingTop:15,
    paddingBottom: 10,
    margin: 0,
    borderRadius: 5
  },
  viewContainer: {
    paddingTop: 0,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 0,
    flex: 1,
    backgroundColor: theme.secondary
  }
});


const mapDispatchToProps = {
    closeBuddyIntroView,
    openBuddyIntroView,
    openBuddyRegistrationView
};

const select = store => {
  return {
    isBuddyIntroViewOpen: store.registration.get('isBuddyIntroViewOpen'),
    userId: store.registration.get('userId'),
    userName: store.registration.get('name')
  };
};

export default connect(select, mapDispatchToProps)(BuddyIntroView);
