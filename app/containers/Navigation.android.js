'use strict'

import React, { Component } from 'react';
import { View } from 'react-native'

import { connect } from 'react-redux';
import autobind from 'autobind-decorator';
import _ from 'lodash';

import { changeTab } from '../actions/navigation';
import { openCitySelection, getCityId } from '../concepts/city';

import CalendarView from './CalendarView';
import CompetitionView from './CompetitionNavigator';
import FeedView from './FeedView';
import ProfileView from './ProfileView';
import AndroidTabs  from 'react-native-scrollable-tab-view';
import Header from '../components/common/MainHeader';
import Tabs from '../constants/Tabs';

const theme = require('../style/theme');
const IconTabBar = require('../components/common/MdIconTabBar');
const ANDROID_TAB_ORDER = [
  Tabs.FEED,
  Tabs.CALENDAR,
  Tabs.FEELING,
  Tabs.ACTION,
  Tabs.SETTINGS
];
const initialTab = 0;

class AndroidTabNavigation extends Component {

  componentDidMount() {
    this.props.changeTab(ANDROID_TAB_ORDER[initialTab])
  }

  @autobind
  onChangeTab({ i }) {
    this.props.changeTab(ANDROID_TAB_ORDER[i]);
  }

  render() {
    const {
      navigator,
      currentTab,
      currentCity,
      openCitySelection
    } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <Header
          title={null}
          backgroundColor={theme.secondary}
          currentTab={currentTab}
          currentCity={currentCity}
          openCitySelection={openCitySelection}
          navigator={navigator}
        />
        <AndroidTabs
          onChangeTab={this.onChangeTab}
          initialPage={initialTab}
          tabBarPosition={'bottom'}
          tabBarBackgroundColor={theme.white}
          tabBarActiveTextColor={theme.secondaryLight}
          tabBarInactiveTextColor={'rgba(0, 0, 0, 0.5)'}
          locked={true}
          scrollWithoutAnimation={true}
          renderTabBar={() => <IconTabBar />}
        >
          <FeedView navigator={navigator} tabLabel={{title:'Buzz', icon:'whatshot'}} />
          <CalendarView navigator={navigator} tabLabel={{title:'Events', icon:'event'}} />
          <CompetitionView tabLabel={{title:'Vibes', icon:'thumbs-up-down'}} />
          <CompetitionView tabLabel={{title:'Ranking', icon:'equalizer'}} />
          <ProfileView navigator={navigator} tabLabel={{title:'Profile', icon:'account-circle'}} />
        </AndroidTabs>
      </View>
    )
  }
}


const mapDispatchToProps = { changeTab, openCitySelection };

const select = state => {
  return {
    currentCity: getCityId(state),
    currentTab: state.navigation.get('currentTab')
  }
};

export default connect(select, mapDispatchToProps)(AndroidTabNavigation);
