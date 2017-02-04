'use strict';

import React, { Component } from 'react';
import { Navigator, View, StyleSheet, Platform } from 'react-native';
import autobind from 'autobind-decorator';

import analytics from '../services/analytics';
import FeedList from '../components/feed/FeedList';
import RadioPlayer from '../containers/RadioPlayer'
import NavRouteMapper from '../components/common/navbarRouteMapper';
import theme from '../style/theme';

const VIEW_NAME = 'FeedView';

const styles = StyleSheet.create({
  navigator: {
    paddingTop: Platform.OS === 'ios' ? 64 : 0,
    paddingBottom:Platform.OS === 'ios' ? 30 : 0,
  },
  navbar: {
    backgroundColor: theme.secondary,
    height: 62,
    paddingBottom: 5,
    flexDirection: 'row',
    alignItems: 'center'
  }
});


class FeedView extends Component {
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
    if (Platform.OS === 'ios') {
      return <View style={{ flex: 1 }}><Navigator
        style={styles.navigator}
        initialRoute={{
          component: FeedList,
          name: 'Feed'
        }}
        /*navigationBar={
          <Navigator.NavigationBar
            style={styles.navbar}
            routeMapper={NavRouteMapper} />
        }*/
        renderScene={this.renderScene}
        configureScene={() => ({
          ...Navigator.SceneConfigs.FloatFromRight
        })} />
        <RadioPlayer />
      </View>;
    }
    else {
      return <Navigator
        style={styles.navigator}
        initialRoute={{
          component: FeedList,
          name: 'Feed'
        }}
        renderScene={this.renderScene}
        configureScene={() => ({
          ...Navigator.SceneConfigs.FloatFromRight
        })} />;
    }
  }
}

export default FeedView;
