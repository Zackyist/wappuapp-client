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
import moment from 'moment';
import location from '../../services/location';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';
import Icon from 'react-native-vector-icons/Ionicons';
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
    };
  }

  handlePress() {
    this.props.checkIn();

    this.state.springAnim.setValue(0);
     Animated.timing(
       this.state.springAnim,
       {
         toValue: 1,
         duration: 500,
         easing: Easing.elastic(1)}
     ).start();
  }

  renderIcon(validLocation) {
    return validLocation ?
      <Icon size={30} name={IOS ? 'ios-checkmark' : 'md-checkmark'} style={styles.icon}/>
      :
      <Icon size={20} name={IOS ? 'ios-lock' : 'md-lock'} style={styles.icon}/>;
  }

  render() {

    const { validLocation, checkIn } = this.props;

    const active = this.state.springAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 1.2, 1]
    });

    return (
      <TouchableWithoutFeedback disabled={!validLocation} onPress={() => this.handlePress()}>
        <Animated.View style={[styles.button, {opacity: validLocation ? 1 : 0.7, transform: [{scale: active}]}]}>
          {this.renderIcon(validLocation)}
          <Text style={styles.text}>{validLocation ? 'CHECK IN' : 'TOO FAR :<'}</Text>
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
