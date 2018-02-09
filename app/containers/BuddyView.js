'use strict';

import React, { Component } from 'react';
import {
  Navigator,
  StyleSheet,
  Platform
} from 'react-native';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import TabBarItems from '../components/tabs/Tabs';
import BuddyUserView from '../components/whappubuddy/BuddyUserView';
import BuddyMatchesView from '../components/whappubuddy/BuddyMatchesView';
import {
  broadcastDataUpdate,
  showOtherBuddyProfile,
  showOwnBuddyProfile
} from '../actions/registration';

const theme = require('../style/theme');
const isIOS = Platform.OS === 'ios';

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

  @autobind
  onChangeTab(selectedTab) {
    const tabIndex = selectedTab.i;

    switch (tabIndex) {
    case 0:
      this.props.showOwnBuddyProfile();
      this.props.broadcastDataUpdate();
      break;
    case 1:
      this.props.showOtherBuddyProfile();
      this.props.broadcastDataUpdate();
      break;
    case 2:
      // TODO: Insert MatchesView stuff if needed
      break;
    default:
    }
  }

  render() {
    return (
      <ScrollableTabView
        onChangeTab={this.onChangeTab}
        initialPage={1}
        tabBarActiveTextColor={theme.secondary}
        tabBarUnderlineColor={theme.secondary}
        tabBarBackgroundColor={theme.white}
        tabBarInactiveTextColor={'rgba(0,0,0,0.6)'}
        locked={isIOS}
        prerenderingSiblingsNumber={0}
        renderTabBar={() => <TabBarItems />}    
      >
        <Navigator
          key={0}
          style={styles.navigator}
          initialRoute={{
            component: BuddyUserView,
            name: 'My Profile'
          }}
          renderScene={this.renderScene}
          configureScene={() => ({
            ...Navigator.SceneConfigs.FloatFromRight
          })}
          tabLabel="My Profile"
          barColor={theme.accent}
          ref="myProfile"
        />
        <Navigator
          key={1}
          style={styles.navigator}
          initialRoute={{
            component: BuddyUserView,
            name: 'Discover'
          }}
          renderScene={this.renderScene}
          configureScene={() => ({
            ...Navigator.SceneConfigs.FloatFromRight
          })}
          tabLabel="Discover"
          barColor={theme.positive}
          ref="discover"
        />
        { /* TODO: Change this to route to MatchesView */ }
        <Navigator
          key={2}
          style={styles.navigator}
          initialRoute={{
            component: BuddyMatchesView,
            name: 'Matches'
          }}
          renderScene={this.renderScene}
          configureScene={() => ({
            ...Navigator.SceneConfigs.FloatFromRight
          })}
          tabLabel="Matches"
          barColor={theme.accent}
          ref="matches"
        />
      </ScrollableTabView>

    );
  }
}

const mapDispatchToProps = {
  broadcastDataUpdate,
  showOtherBuddyProfile,
  showOwnBuddyProfile
};

const select = store => {
  return {};
};

export default connect(select, mapDispatchToProps)(BuddyView);
