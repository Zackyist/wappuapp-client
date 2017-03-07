'use strict';

import React, { Component } from 'react';
import { TabBarIOS } from 'react-native';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';

import CalendarView from './CalendarView';
import EventMapView from './EventMapView';
import CompetitionView from './CompetitionNavigator';
import FeedView from './FeedView';
import SettingsView from './ProfileView';
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
    const { navigator, currentTab, isRadioPlaying } = this.props;
    return (
      <TabBarIOS tintColor={theme.secondary} translucent={true}>
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
        {/*<MDIcon.TabBarItemIOS
          iconName='location-on'
          title=''
          selected={currentTab === Tabs.MAP}
          onPress={() => { this.onChangeTab(Tabs.MAP); }}>
          <EventMapView navigator={navigator} />
        </MDIcon.TabBarItemIOS>*/}
        <MDIcon.TabBarItemIOS
          iconName='equalizer'
          title=''
          selected={currentTab === Tabs.ACTION}
          onPress={() => { this.onChangeTab(Tabs.ACTION); }}>
          <CompetitionView navigator={navigator} />
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

const select = store => {
  return {
    currentTab: store.navigation.get('currentTab')
  }
};

export default connect(select, mapDispatchToProps)(Navigation);
