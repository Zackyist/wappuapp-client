'use strict';

import React, { PropTypes, Component } from 'react';

import {
  View,
  Animated,
  Text,
  ListView,
  Platform,
  Easing,
  TouchableWithoutFeedback,
  Dimensions,
  StyleSheet,
  BackAndroid,
  Modal
} from 'react-native';

import {
  UNAVAILABLE,
  AVAILABLE,
  CHECKED
} from '../../constants/CheckInStates';

import moment from 'moment';
import location from '../../services/location';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';
import Icon from 'react-native-vector-icons/MaterialIcons';
import EventListItem from '../calendar/EventListItem';
import { checkIn } from '../../actions/competition';

import Button from '../../components/common/Button';
import theme from '../../style/theme';
import * as CompetitionActions from '../../actions/competition';
const IOS = Platform.OS === 'ios';

const { width, height } = Dimensions.get('window');

class CheckInButton extends Component {

  constructor(props) {
    super(props);
    this.state = {
      springAnim: new Animated.Value(0),
      status: props.validLocation ? AVAILABLE : UNAVAILABLE
    };
  }

  handlePress() {
    this.props.checkIn();
    this.setState({status: CHECKED});

    this.state.springAnim.setValue(0);
     Animated.timing(
       this.state.springAnim,
       {
         toValue: 1,
         duration: 500,
         easing: Easing.elastic(1)}
     ).start();
  }

  renderIcon(status) {
    switch(status) {
      case AVAILABLE:
        return <Icon size={30} name={'pin-drop'} style={styles.icon}/>;
      case CHECKED:
        return <Icon size={30} name={'check'} style={styles.icon}/>;
      default:
        return <Icon size={20} name={'lock'} style={styles.icon}/>;
    }
  }

  renderText(status) {
    switch(status) {
      case AVAILABLE:
        return 'CHECK IN';
      case CHECKED:
        return 'OK';
      default:
        return 'TOO FAR :<';
    }
  }

  render() {

    const { validLocation, checkIn } = this.props;
    const { status } = this.state;

    const active = this.state.springAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 1.2, 1]
    });

    console.log('validLocation ' + validLocation);

    return (
      <TouchableWithoutFeedback disabled={!validLocation} onPress={() => this.handlePress()}>
        <Animated.View style={[styles.button, {opacity: validLocation ? 1 : 0.7, transform: [{scale: active}]}]}>
          {this.renderIcon(status)}
          <Text style={styles.text}>{this.renderText(status)}</Text>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    color: 'white',
    marginRight: 5
  },
  text: {
    color: theme.light
  },
  button: {
    flexDirection: 'row',
    alignItems:'center',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: theme.white,
    height: 40,
    width: 120,
    position: 'absolute',
    bottom: 10,
    right: 10,
    overflow: 'hidden',
    padding: 2,
    justifyContent: 'center',
    backgroundColor: theme.primaryDarker,
  }
});



export default connect()(CheckInButton);
