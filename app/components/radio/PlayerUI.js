import React, { PropTypes, Component } from 'react';
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
import {
  PLAYING,
  STREAMING,
  PAUSED,
  STOPPED,
  ERROR,
  METADATA_UPDATED,
  BUFFERING,
  START_PREPARING,
  BUFFERING_START,
} from '../../constants/RadioStates';

const IOS = Platform.OS === 'ios';

// Player UI Component
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
    const { setRadioSong, setRadioStatus } = this.props;
    this.subscription = DeviceEventEmitter.addListener(
      'AudioBridgeEvent', (evt) => {
        // We just want meta update for song name
        if (evt.status === METADATA_UPDATED && evt.key === 'StreamTitle') {
          setRadioSong(evt.value);
        } else if (evt.status != METADATA_UPDATED) {
          // TODO
          // evt can also contain progress & duration
          // check if useful, would be cool
          setRadioStatus(evt.status);
        }
      }
      );

    ReactNativeAudioStreaming.getStatus((error, { status }) => {
      (error) ? console.log(error) : setRadioStatus(status)
    });
  }

  _onPress() {
    const { status, url } = this.props;

    switch (status) {
      case PLAYING:
      case STREAMING:
      ReactNativeAudioStreaming.pause();
      break;
      case PAUSED:
      ReactNativeAudioStreaming.resume();
      break;
      case STOPPED:
      case ERROR:
      ReactNativeAudioStreaming.play(url, {showIniOSMediaCenter: true, showInAndroidNotifications: true});
      break;
      case BUFFERING:
      ReactNativeAudioStreaming.stop();
      break;
    }
  }

  render() {
    let icon = null;
    const { status, song } = this.props;
    switch (status) {
      case STREAMING:
      case PLAYING:
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
          size={IOS ? 'small' : 25}
          color={theme.secondary}
          animating={true}
          style={styles.loader}
        />;
        break;
    }

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
    color: theme.secondary,
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
    color: theme.dark,
  },
  stationTitle: {
    fontWeight: '100',
    fontSize: 10,
    color: theme.dark,
    opacity: 0.8,
  },
  songName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: theme.dark
  }
});

Player.propTypes = {
  url: PropTypes.string.isRequired,
  status: PropTypes.string,
  song: PropTypes.string,
  setRadioStatus: PropTypes.func,
  setRadioSong: PropTypes.func,
};

export default Player;
