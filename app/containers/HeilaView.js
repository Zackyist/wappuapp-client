'use strict';

import React, { Component } from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';
import autobind from 'autobind-decorator';

import analytics from '../services/analytics';
import theme from '../style/theme';


const VIEW_NAME = 'HeilaView';

const styles = StyleSheet.create({
  navigator: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom:Platform.OS === 'ios' ? 0 : 0,
  },
  navbar: {
    backgroundColor: theme.secondary,
    height: 62,
    paddingBottom: 5,
    flexDirection: 'row',
    alignItems: 'center'
  }
});


class HeilaView extends Component {
  componentDidMount() {
    analytics.viewOpened(VIEW_NAME);
  }

  @autobind
  renderScene(route, navigator) {
    if (route.component) {
      const RouteComponent = route.component;
      return <RouteComponent route={route} {...this.props} />
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: theme.lightgrey }}>
        <Text>Tämä on uusi Heila-täbi :-) Löysit sen!</Text>
      </View>
    );
  }
}

export default HeilaView;
