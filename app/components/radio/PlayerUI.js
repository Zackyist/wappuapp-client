import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  DeviceEventEmitter,
  ActivityIndicator,
  Platform
} from 'react-native';

import { ReactNativeAudioStreaming } from 'react-native-audio-streaming';
import Icon from 'react-native-vector-icons/MaterialIcons';

import theme from '../../style/theme';

// Possibles states
const PLAYING = 'PLAYING';
const STREAMING = 'STREAMING';
const PAUSED = 'PAUSED';
const STOPPED = 'STOPPED';
const ERROR = 'ERROR';
const METADATA_UPDATED = 'METADATA_UPDATED';
const BUFFERING = 'BUFFERING';
const START_PREPARING = 'START_PREPARING'; // Android only
const BUFFERING_START = 'BUFFERING_START'; // Android only

// UI
const iconSize = 60;

class Player extends Component {
  constructor(props) {
    super(props);
    this._onPress = this._onPress.bind(this);
    this.state = {
      status: STOPPED,
      song: ''
    };
  }

  componentDidMount() {
    this.subscription = DeviceEventEmitter.addListener(
      'AudioBridgeEvent', (evt) => {
        // We just want meta update for song name
        if (evt.status === METADATA_UPDATED && evt.key === 'StreamTitle') {
          this.setState({song: evt.value});
        } else if (evt.status != METADATA_UPDATED) {
          this.setState(evt);
        }
      }
      );

    ReactNativeAudioStreaming.getStatus((error, status) => {
      (error) ? console.log(error) : this.setState(status)
    });
  }

  _onPress() {
    switch (this.state.status) {
      case PLAYING:
      case STREAMING:
      ReactNativeAudioStreaming.pause();
      break;
      case PAUSED:
      ReactNativeAudioStreaming.resume();
      break;
      case STOPPED:
      case ERROR:
      ReactNativeAudioStreaming.play(this.props.url, {showIniOSMediaCenter: true, showInAndroidNotifications: true});
      break;
      case BUFFERING:
      ReactNativeAudioStreaming.stop();
      break;
    }
  }

  render() {
    let icon = null;
    switch (this.state.status) {
      case PLAYING:
      case STREAMING:
        icon = <Icon name="pause-circle-outline" style={styles.icon} />;
        break;
      case ERROR:
      case PAUSED:
      case STOPPED:
        icon = <Icon name="play-circle-outline" style={styles.icon} />;
        break;
      case BUFFERING:
      case BUFFERING_START:
      case START_PREPARING:
        icon = <ActivityIndicator
          color={theme.white}
          animating={true}
          style={styles.loader}
        />;
        break;
    }
    const { song } = this.state;

    return (
      <View style={styles.container}>
        <TouchableOpacity activeOpacity={0.8} style={styles.container} onPress={this._onPress}>
        {icon}
        </TouchableOpacity>
        <View style={styles.textContainer}>
          {!song && <Text style={styles.stationTitle}>LISTEN TO WAPPURADIO</Text>}
          {!!song && <Text style={styles.stationTitle}>NOW ON WAPPURADIO</Text>}
          {!!song && <Text style={styles.songName}>{song}</Text>}
        </View>
      </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  icon: {
    backgroundColor: 'transparent',
    fontSize: 30,
    marginRight: 20,
    color: theme.white,
  },
  loader: {
    width: 30,
    marginRight: 20,
  },
  textContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingRight: 30,
  },
  textLive: {
    color: theme.white,
  },
  stationTitle: {
    fontWeight: '100',
    fontSize: 11,
    color: theme.accent,
  },
  songName: {
    fontSize: 14,
    color: theme.white
  }
});

Player.propTypes = {
  url: React.PropTypes.string.isRequired
};

export default Player;
