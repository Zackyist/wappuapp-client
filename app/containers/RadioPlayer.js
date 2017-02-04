'use strict';

import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
  Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Icon from 'react-native-vector-icons/Ionicons';

import {
  getRadioMode,
  getRadioStatus,
  getRadioSong,
  toggleRadioBar,
  setRadioSong,
  setRadioStatus
} from '../concepts/radio';
import theme from '../style/theme';
import autobind from 'autobind-decorator';

import PlayerUI from '../components/radio/PlayerUI';

const { height, width } = Dimensions.get('window');
const IOS = Platform.OS === 'ios';

const PLAYER_HEIGHT_EXPANDED = height - 60 - 48;
const PLAYER_HEIGHT = 48;

class RadioPlayer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      playerHeight: new Animated.Value(48)
    };
  }

  @autobind
  toggle() {
    const nextState = !this.props.expanded;
    if (!nextState) {
      return;
    }

    this.animateRadioBar(nextState);
    this.props.toggleRadioBar(nextState);
  }

  @autobind
  close() {
    this.animateRadioBar(false);
    this.props.toggleRadioBar(false);
  }

  animateRadioBar(nextState) {
    Animated.timing(this.state.playerHeight,
      { duration: 200, easing: Easing.quad, toValue: nextState ? PLAYER_HEIGHT_EXPANDED : PLAYER_HEIGHT}).start();
  }

  render() {
    const { playerHeight } = this.state;
    const { expanded, song, status } = this.props;

    return (
      <Animated.View style={[styles.container, { height: playerHeight }]}>
        {expanded && <Image
          source={require('../../assets/radiopic.jpg')}
          style={styles.bgImage} />
        }
        <TouchableOpacity
        activeOpacity={1}
        onPress={this.toggle}
        style={styles.pressable}>
          <PlayerUI
            setRadioStatus={this.props.setRadioStatus}
            setRadioSong={this.props.setRadioSong}
            status={status}
            song={song}
            url="http://lacavewebradio.chickenkiller.com:8000/stream.mp3"
          />
          {expanded &&
            <TouchableOpacity onPress={this.close} style={styles.close} >
              <Icon name="ios-arrow-up-outline" style={styles.closeArrow} />
            </TouchableOpacity>
          }
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderStyle: 'solid',
    borderBottomWidth: 2,
    borderBottomColor: theme.accent,
    position: 'absolute',
    left: 0,
    right: 0,
    height: PLAYER_HEIGHT,
    zIndex: 0,
    top: 20,
    backgroundColor: theme.primary, // 'rgba(255, 255, 255, .95)',
    overflow: 'hidden',
  },
  bgImage: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: PLAYER_HEIGHT_EXPANDED,
    bottom: 0,
    opacity: 0.1,
  },
  pressable: {
    paddingLeft: 10,
    paddingRight: 10,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    color: theme.stable,
    backgroundColor: 'transparent',
  },
  close: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  closeArrow: {
    fontSize: 30,
    marginBottom: 5,
    color: 'rgba(255, 255, 255, .6)',
    backgroundColor: 'transparent'
  }
});

const mapDispatchToProps = {
  setRadioStatus,
  setRadioSong,
  toggleRadioBar
}

const mapStateToProps = createStructuredSelector({
  status: getRadioStatus,
  song: getRadioSong,
  expanded: getRadioMode
});

export default connect(mapStateToProps, mapDispatchToProps)(RadioPlayer);

