'use strict';

import React, { Component } from 'react';
import {
  Navigator,
  StyleSheet,
  BackAndroid,
  Platform
} from 'react-native';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';

import EventMap from '../components/map/EventMap';
import sceneConfig from '../utils/sceneConfig';
import theme from '../style/theme';

const styles = StyleSheet.create({
  navigator: {
    paddingTop: Platform.OS === 'ios' ? 20 : 0
  },
  navbar: {
    backgroundColor: theme.secondary,
    height: 62,
    paddingBottom: 5,
    flexDirection: 'row',
    alignItems: 'center'
  }
});

var _navigator;
BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator && _navigator.getCurrentRoutes().length > 1) {
    _navigator.pop();
    return true;
  }
  return false;
});

class EventMapView extends Component {
  @autobind
  renderScene(route, navigator) {
    _navigator = navigator;
    if (route.component) {
      const RouteComponent = route.component;
      return <RouteComponent route={route} {...this.props} />
    }
  }

  render() {
    return (
      <Navigator
        style={styles.navigator}
        initialRoute={{
          component: EventMap,
          name: 'Map'
        }}

        renderScene={this.renderScene}
        configureScene={() => sceneConfig}
      />
    );
  }
}

const select = store => {
  return {};
};

export default connect(select)(EventMapView);
