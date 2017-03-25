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
  Linking,
  Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Icon from 'react-native-vector-icons/Ionicons';
const IOS = Platform.OS === 'ios';

import {
  getRadioMode,
  getRadioStatus,
  getRadioSong,
  getRadioName,
  getRadioStations,
  getActiveStationId,
  getActiveStation,
  getNowPlaying,
  toggleRadioBar,
  setRadioSong,
  setRadioStatus,
  setRadioStationActive
} from '../concepts/radio';
import theme from '../style/theme';
import autobind from 'autobind-decorator';
import PlayerUI from '../components/radio/PlayerUI';
import PlatformTouchable from '../components/common/PlatformTouchable';

const { height } = Dimensions.get('window');

const PLAYER_HEIGHT_EXPANDED = IOS ? height - 60 - 48 : height - 130;
const PLAYER_HEIGHT = IOS ? 40 : 40;

class RadioPlayer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      playerHeight: new Animated.Value(PLAYER_HEIGHT)
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

  renderExpandedContent() {
    const { song, stations, activeStationId, currentStation } = this.props;
    return (
      <View style={styles.containerExpanded}>
        <View style={styles.tabs}>
          {stations && stations.map((station, index) =>
            <View key={index} style={[styles.tab, station.get('id') === activeStationId ? styles.tab__active : {}]}>
              <PlatformTouchable onPress={() => this.props.setRadioStationActive(station.get('id'))}>
                <Text style={styles.tabText}>{station.get('name')}</Text>
              </PlatformTouchable>
            </View>
          )}
          {/*<View style={styles.tab}><PlatformTouchable><Text style={styles.tabText}>Radiodiodi</Text></PlatformTouchable></View>*/}
        </View>

        <View style={styles.radioContent}>
          <View style={{ flex: 1 }}><Text style={styles.songName}>{'Aamukahvia ananaspuusta'}</Text></View>

          {!!currentStation.get('website') &&
            <View style={styles.radioWebsite}>
              <PlatformTouchable onPress={() => Linking.openURL(currentStation.get('website'))}>
                <Text style={styles.websiteUrl}>See more in {currentStation.get('website')}</Text>
              </PlatformTouchable>
            </View>
          }
        </View>

        <TouchableOpacity onPress={this.close} style={styles.close} >
          <Icon name="ios-arrow-up-outline" style={styles.closeArrow} />
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const { playerHeight } = this.state;
    const { expanded, song, status, nowPlaying, currentStation } = this.props;

    return (
      <Animated.View style={[styles.container, { height: playerHeight }]}>
        {false && expanded && <Image
          resizeMode={'contain'}
          source={require('../../assets/radio.png')}
          // source={require('../../assets/rakkauden-wappuradio.png')}
          style={styles.bgImage} />
        }
        {expanded && this.renderExpandedContent()}

        {!expanded && <TouchableOpacity
        activeOpacity={1}
        onPress={this.toggle}
        style={styles.pressable}>
          <PlayerUI
            setRadioStatus={this.props.setRadioStatus}
            setRadioSong={this.props.setRadioSong}
            radioStationName={currentStation ? currentStation.get('name') : ''}
            status={status}
            song={nowPlaying ? `${nowPlaying.get('programHost')} ${nowPlaying.get('programTitle')}` : ''}
            url={currentStation ? currentStation.get('stream') : ''}
          />
        </TouchableOpacity>
        }
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderStyle: 'solid',
    borderBottomWidth: IOS ? 1 : 0,
    borderBottomColor: '#eee',
    position: 'absolute',
    left: 0,
    right: 0,
    height: PLAYER_HEIGHT,
    zIndex: 0,
    top: IOS ? 20 : 0,
    backgroundColor: theme.white, // 'rgba(255, 255, 255, .95)',
    overflow: 'hidden',
    elevation: 1,
  },
  bgImage: {
    position: 'absolute',
    height: PLAYER_HEIGHT_EXPANDED - 250,
    bottom: 35,
    opacity: 0.8,
    tintColor: theme.secondary,
  },
  pressable: {
    paddingLeft: 10,
    paddingRight: 10,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },

  // expanded
  containerExpanded: {
    flex: 1,
    justifyContent: 'flex-start',
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
    color: 'rgba(0, 0, 0, .3)',
    backgroundColor: 'transparent'
  },
  tabs: {
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tab: {
    alignItems: 'center',
    borderBottomWidth: 2,
    paddingTop: 2,
    borderBottomColor: 'transparent'
  },
  tabText: {
    paddingRight: 20,
    paddingLeft: 20,
    padding: 10,
    color: theme.secondary
  },
  tab__active: {
    borderBottomColor: theme.secondary
  },
  radioContent: {
    backgroundColor: '#FF0000',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  radioWebsite: {
    flexGrow: 1,
    flex: 1,
    alignItems: 'center'
  },
  websiteUrl: {
    fontSize: 20,
    color: theme.primary,
  },
  songName: {
    padding: 5,
    textAlign: 'center',
    fontWeight: '900',
    fontSize: 40,
    color: theme.secondary,
  }

});

const mapDispatchToProps = {
  setRadioStatus,
  setRadioSong,
  setRadioStationActive,
  toggleRadioBar,
}

const mapStateToProps = createStructuredSelector({
  name: getRadioName,
  status: getRadioStatus,
  nowPlaying: getNowPlaying,
  song: getRadioSong,
  expanded: getRadioMode,
  stations: getRadioStations,
  activeStationId: getActiveStationId,
  currentStation: getActiveStation,
});

export default connect(mapStateToProps, mapDispatchToProps)(RadioPlayer);

