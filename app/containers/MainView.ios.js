'use strict';

import React, { Component } from 'react';
import { View, Navigator, StyleSheet } from 'react-native';
import { get } from 'lodash';
import { connect } from 'react-redux';

import sceneConfig from '../utils/sceneConfig';
import NavRouteMapper from '../components/common/navbarRouteMapper';
import errorAlert from '../utils/error-alert';

import IOSTabNavigation from './Navigation';
import RegistrationView from '../components/registration/RegistrationView';
import LightBox from '../components/lightbox/Lightbox';
import RadioPlayer from '../containers/RadioPlayer';

const theme = require('../style/theme');



class MainView extends Component {
  renderScene(route, navigator) {
    if (route.component) {
      const RouteComponent = route.component;
      return <RouteComponent navigator={navigator} route={route} {...this.props} />;
    }
  }

  render() {
    const immutableError = this.props.errors.get('error');
    if (immutableError) {
      const error = immutableError.toJS();
      errorAlert(this.props.dispatch, get(error, 'header'), get(error, 'message'));
    }

    return (
      <View style={{ flex:1 }}>
        <Navigator
          style={styles.navigator}
          navigationBar={
            <Navigator.NavigationBar
              style={styles.navbar}
              routeMapper={NavRouteMapper} />
          }
          initialRoute={{
            component: IOSTabNavigation,
            name: 'Whappu'
          }}
          renderScene={this.renderScene}
          configureScene={() => sceneConfig}
        />
        <LightBox />
        <RegistrationView />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  navigator: {
    paddingTop: 42,
    paddingBottom:0,
  },
  navbar: {
    backgroundColor: theme.secondary,
    height: 62,
    paddingBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
  }
});

const select = store => {
  return {
    errors: store.errors
  }
};

export default connect(select)(MainView);
