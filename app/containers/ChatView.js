'use strict';

import React, { Component } from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';
import autobind from 'autobind-decorator';

import analytics from '../services/analytics';
import theme from '../style/theme';

import Chat from '../components/chat/Chat';

const VIEW_NAME = 'ChatView';

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
  },
  chatfield: {
    height: 7
  },
  header: {
    flex: 1,
    backgroundColor: theme.lightgrey
  },
  chatContainer: {
    height: 30
  },
});


class ChatView extends Component {
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
      <View>
        <View style={styles.header}>
          <Text> Tämä on chatti header </Text>
        </View>
        <View style={styles.chatContainer}>
          <Text> viesti </Text>
        </View>
        <View style={styles.chatfield}>
          <Text> chattikenttä </Text>
        </View>
      </View>
    );
  }
}

export default ChatView;
