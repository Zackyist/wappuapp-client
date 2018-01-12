'use strict';

import React, { Component, PropTypes } from 'react';
import { Text, View, Navigator, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';

class EventFeedback extends Component {
  // componentDidMount() {
  //   analytics.viewOpened(VIEW_NAME);
  // }

  @autobind
  renderScene(route, navigator) {
    if (route.component) {
      const RouteComponent = route.component;
      return <RouteComponent route={route} {...this.props} />
    }
  }

  render() {
    return (
      <View>
        <Text>Palautenäkymä tulee tänne</Text>
      </View>
    );
  }
}

const style = StyleSheet.create({

});

const select = store => {
  return {};
};

export default connect(select)(EventFeedback);
