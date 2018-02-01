'use strict';

import React, { Component } from 'react';
import {
  Navigator,
  StyleSheet,
  Platform
} from 'react-native';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';

import UserView from '../components/user/UserView';
import Profile from '../components/profile/Profile';

const theme = require('../style/theme');

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


class ProfileView extends Component {
  @autobind
  renderScene(route, navigator) {
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
          component: UserView,
          name: 'Settings'
        }}
        renderScene={this.renderScene}
        configureScene={() => ({
          ...Navigator.SceneConfigs.FloatFromRight
        })}
      />
    );
  }
}

const select = store => {
  return {};
};

export default connect(select)(ProfileView);
