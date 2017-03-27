'use strict';

import React, { PropTypes, Component } from 'react';

import {
  View,
  Animated,
  Text,
  Platform,
  Easing,
  TouchableWithoutFeedback,
  StyleSheet,
  Modal
} from 'react-native';

import {
  UNAVAILABLE,
  AVAILABLE,
  CHECKED
} from '../../constants/CheckInStates';

import location from '../../services/location';
import autobind from 'autobind-decorator';
import Icon from 'react-native-vector-icons/MaterialIcons';

import theme from '../../style/theme';
import * as CompetitionActions from '../../actions/competition';
const IOS = Platform.OS === 'ios';

class CheckInButton extends Component {

  constructor(props) {
    super(props);
    this.state = {
      springAnim: new Animated.Value(0),
      status: props.validLocation ? AVAILABLE : UNAVAILABLE
    };
  }

  handlePress() {
    this.setState({status: CHECKED});
    this.state.springAnim.setValue(0);
     Animated.timing(
       this.state.springAnim,
       {
         toValue: 1,
         duration: 500,
         easing: Easing.elastic(1)}
     ).start(() => {
       this.props.checkIn();
     });
  }

  renderText(status) {
    switch(status) {
      case AVAILABLE:
        return <Text style={styles.text}>CHECK IN </Text>;
      case CHECKED:
        return <Icon size={20} name={'check'} style={styles.icon}/>;
      case UNAVAILABLE:
        return <Text style={styles.text}>TOO FAR </Text>;
    }
  }

  render() {
    const { validLocation, checkIn } = this.props;
    const { status } = this.state;

    const active = this.state.springAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 1.2, 1]
    });

    return (
      <TouchableWithoutFeedback disabled={status !== AVAILABLE} onPress={() => this.handlePress()}>
        <Animated.View style={[styles.button, {opacity: status === AVAILABLE ? 1 : 0.7, transform: [{scale: active}]}]}>
          {this.renderText(status)}
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    color: 'white',
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

export default CheckInButton;
