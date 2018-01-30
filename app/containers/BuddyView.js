'use strict';

import React, { Component } from 'react';
import {
  Navigator,
  StyleSheet,
  Platform,
  View,
} from 'react-native';

import { connect } from 'react-redux';
import autobind from 'autobind-decorator';
import TabBarItems from '../components/tabs/Tabs';

// import BuddyUserView from '../components/whappubuddy/BuddyUserView';
import BuddyMatchesView from '../components/whappubuddy/BuddyMatchesView';
import FindBuddyPlaceholder from '../components/whappubuddy/FindBuddyPlaceholder';
import BuddyPlaceholder from '../components/whappubuddy/BuddyPlaceholder';

const ScrollTabs = require('react-native-scrollable-tab-view');

const IOS = Platform.OS === 'ios';
// const VIEW_NAME = 'BuddyView';

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


class BuddyView extends Component {
  @autobind
  renderScene(route, navigator) {
    if (route.component) {
      const RouteComponent = route.component;
      return <RouteComponent route={route} {...this.props} />
    }
  }

  componentWillMount() {
    <Navigator
      style={styles.navigator}
      initialRoute={{
        component: BuddyView, // BuddyUserView
        name: 'WhappuBuddy'
      }}
      renderScene={this.renderScene}
      configureScene={() => ({
        ...Navigator.SceneConfigs.FloatFromRight
      })}
    />
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollTabs
          contentProps={this.props.route}
          initialPage={0}
          tabBarActiveTextColor={theme.secondary}
          tabBarUnderlineColor={theme.secondary}
          tabBarBackgroundColor={theme.white}
          tabBarInactiveTextColor={'rgba(0,0,0,0.6)'}
          locked={IOS}
          prerenderingSiblingsNumber={0}
          renderTabBar={() => <TabBarItems />}
        >
          {/* Replace with buddyprofile and the buddyfinder */}
          <BuddyPlaceholder
            tabLabel='My profile'
            navigator={this.props.navigator}
            barColor={theme.accent}
            ref='profile'
          />
          <FindBuddyPlaceholder
              tabLabel="Find Matches"
              navigator={this.props.navigator}
              barColor={theme.accent}
              ref="buddy" />
          <BuddyMatchesView
              tabLabel="My Matches"
              navigator={this.props.navigator}
              barColor={theme.accent}
              ref="matches" />
        </ScrollTabs>
      </View>
    );
  }
}

const select = store => {
  return {}
};

export default connect(select)(BuddyView);
