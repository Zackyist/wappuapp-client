'use strict';

import React, { Component } from 'react';
import { Navigator, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';

import sceneConfig from '../utils/sceneConfig';
import NavRouteMapper from '../components/common/navbarRouteMapper';

import TimelineList from '../components/calendar/TimelineList';
const theme = require('../style/theme');

const styles = StyleSheet.create({
  navigator: {
    paddingTop: 20,
    paddingBottom:30,
  },
  navbar: {
    backgroundColor: theme.secondary,
    height: 62,
    paddingBottom: 5,
    flexDirection: 'row',
    alignItems: 'center'
  }
});


class TimelineListWrapper extends Component {
  @autobind
  renderScene(route, navigator) {
    if (route.component) {
      const RouteComponent = route.component;
      return <RouteComponent route={route} {...this.props} />;
    }
  }

  render() {
    return (
      <Navigator
        style={styles.navigator}
        /*navigationBar={
          <Navigator.NavigationBar
            style={styles.navbar}
            routeMapper={NavRouteMapper} />
        }
        */
        initialRoute={{
          component: TimelineList,
          name: 'Tapahtumat'
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

export default connect(select)(TimelineListWrapper);
