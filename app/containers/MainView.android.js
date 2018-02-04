'use strict'

import React, { Component } from 'react';
import {
  View,
  Navigator,
  StatusBar,
  BackAndroid,
} from 'react-native'

import _ from 'lodash';
import { connect } from 'react-redux';

import AndroidTabNavigation from './Navigation';
import RegistrationView from '../components/registration/RegistrationView';
import TextActionView from '../components/actions/TextActionView';
import CheckInActionView from '../components/actions/CheckInActionView';
import errorAlert from '../utils/error-alert';
import LightBox from '../components/lightbox/Lightbox';
import BuddyRegistrationView from '../components/whappubuddy/BuddyRegistrationView';
import BuddyIntroView from '../components/whappubuddy/BuddyIntroView';

const theme = require('../style/theme');

let _navigator;
BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator && _navigator.getCurrentRoutes().length > 1) {
    _navigator.pop();
    return true;
  }
  return false;
});

class MainView extends Component {
  renderScene(route, navigator) {
    _navigator = navigator;
    if (route.component) {
      const RouteComponent = route.component;
      return <RouteComponent navigator={_navigator} route={route} {...this.props} />
    }
  }

  render() {
    const immutableError = this.props.errors.get('error');
    if (immutableError) {
      const error = immutableError.toJS();
      errorAlert(this.props.dispatch, _.get(error, 'header'), _.get(error, 'message'));
    }

    return (
      <View style={{ flex:1 }}>
        <StatusBar backgroundColor={theme.secondaryDark} />

        <Navigator
          initialRoute={{
            component: AndroidTabNavigation,
            name: 'Whappu'
          }}
          renderScene={this.renderScene}
          configureScene={() => ({
            ...Navigator.SceneConfigs.FloatFromBottomAndroid
          })}
        />
        <BuddyIntroView />
        <BuddyRegistrationView />
        <RegistrationView />
        <LightBox />
        <CheckInActionView />
        <TextActionView />
      </View>
    )
  }
}

const select = store => {
  return {
    errors: store.errors
  }
};

export default connect(select)(MainView);
