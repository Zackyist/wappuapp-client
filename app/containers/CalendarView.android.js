'use strict';

import React, { Component } from 'react';
import {
  Navigator,
  BackAndroid,
  PropTypes
} from 'react-native';
import autobind from 'autobind-decorator';
import TimelineList from '../components/calendar/TimelineList';
import EventsView from './EventsView';

var _navigator;
BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator && _navigator.getCurrentRoutes().length > 1) {
    _navigator.pop();
    return true;
  }
  return false;
});


class TimelineListWrapper extends Component {
  propTypes: {
    navigator: PropTypes.object.isRequired
  }

  @autobind
  renderScene(route, navigator) {
    _navigator = navigator;
    if (route.component) {
      const RouteComponent = route.component;
      return <RouteComponent navigator={this.props.navigator} route={route} {...this.props} />
    }
  }

  render() {
    return (
      <Navigator
        initialRoute={{
          component: EventsView,
          name: 'Events'
        }}
        renderScene={this.renderScene}
        configureScene={() => ({
          ...Navigator.SceneConfigs.FloatFromBottomAndroid
        })}
      />
    );
  }
}

export default TimelineListWrapper;
