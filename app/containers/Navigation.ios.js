'use strict';

import React, { Component } from 'react';
import { TabBarIOS } from 'react-native';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';

import CalendarView from './CalendarView';
import MoodView from './MoodView';
import CompetitionView from './CompetitionNavigator';
import FeedView from './FeedView';
import SettingsView from './ProfileView';
import BuddyView from './BuddyView'

import Tabs from '../constants/Tabs';
import { changeTab } from '../actions/navigation';
import MDIcon from 'react-native-vector-icons/MaterialIcons';

const theme = require('../style/theme');

// # Tab navigation
class Navigation extends Component {
  @autobind
  onChangeTab(tab) {
    this.props.changeTab(tab);
  }

  render() {
    const { navigator, currentTab } = this.props;
    return (
      <TabBarIOS tintColor={theme.secondary} translucent={true}
      itemPositioning={'center'}>
        <MDIcon.TabBarItemIOS
          iconName={'whatshot'}
          title=''
          selected={currentTab === Tabs.FEED}
          onPress={() => { this.onChangeTab(Tabs.FEED); }}>
          <FeedView navigator={navigator} />
        </MDIcon.TabBarItemIOS>
        <MDIcon.TabBarItemIOS
          iconName='access-time'
          title=''
          selected={currentTab === Tabs.CALENDAR}
          onPress={() => { this.onChangeTab(Tabs.CALENDAR); }}>
          <CalendarView navigator={navigator} />
        </MDIcon.TabBarItemIOS>
        <MDIcon.TabBarItemIOS
          iconName='trending-up'
          title=''
          selected={currentTab === Tabs.FEELING}
          onPress={() => { this.onChangeTab(Tabs.FEELING); }}>
          <MoodView navigator={navigator} />
        </MDIcon.TabBarItemIOS>
        <MDIcon.TabBarItemIOS
          iconName='favorite-border'
          title=''
          selected={currentTab === Tabs.BUDDY}
          onPress={() => { this.onChangeTab(Tabs.BUDDY); }}>
          <BuddyView navigator={navigator} />
        </MDIcon.TabBarItemIOS>

        <MDIcon.TabBarItemIOS
          iconName='account-circle'
          title=''
          selected={currentTab === Tabs.SETTINGS}
          onPress={() => { this.onChangeTab(Tabs.SETTINGS); }}>
          <SettingsView navigator={navigator} />
        </MDIcon.TabBarItemIOS>
      </TabBarIOS>
    )
  }
}

const mapDispatchToProps = { changeTab };

const select = state => {
  return {
    currentTab: state.navigation.get('currentTab')
  }
};

export default connect(select, mapDispatchToProps)(Navigation);
