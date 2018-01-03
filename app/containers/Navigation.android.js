'use strict'

import React, { Component } from 'react';
import { View } from 'react-native'

import { connect } from 'react-redux';
import autobind from 'autobind-decorator';

import { changeTab } from '../actions/navigation';
import {
  getCurrentCityName,
  toggleCityPanel,
  getCityPanelShowState,
} from '../concepts/city';
import { getFeedSortType, setFeedSortType } from '../concepts/sortType';

import CalendarView from './CalendarView';
import MoodView from './MoodView';
import CompetitionView from './CompetitionNavigator';
import FeedView from './FeedView';
import ProfileView from './ProfileView';
import UserView from '../components/user/UserView';
import AndroidTabs  from 'react-native-scrollable-tab-view';
import Header from '../components/common/MainHeader';
import CitySelector from '../components/header/CitySelector';
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
      currentCityName,
      showCitySelection,
      selectedSortType,
    } = this.props;

    return (
      <View style={{ flexGrow: 1 }}>
        <Header
          title={null}
          backgroundColor={theme.secondary}
          currentTab={currentTab}
          currentCityName={currentCityName}
          toggleCityPanel={this.props.toggleCityPanel}
          selectedSortType={selectedSortType}
          setFeedSortType={this.props.setFeedSortType}
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
          prerenderingSiblingsNumber={0}
          renderTabBar={() => <IconTabBar />}
        >
          <FeedView navigator={navigator} tabLabel={{title:'Buzz', icon:'whatshot'}} />
          <CalendarView navigator={navigator} tabLabel={{title:'Events', icon:'event'}} />
          <MoodView navigator={navigator} tabLabel={{title:'Vibes', icon:'trending-up', iconSize: 26}} />
          <CompetitionView tabLabel={{title:'Ranking', icon:'equalizer'}} />
          <ProfileView navigator={navigator} tabLabel={{title:'Profile', icon:'account-circle'}} />
        </AndroidTabs>
        {showCitySelection && <CitySelector />}
      </View>
    )
  }
}


const mapDispatchToProps = {
  changeTab,
  toggleCityPanel,
  setFeedSortType,
};

const select = state => {
  return {
    showCitySelection: getCityPanelShowState(state),
    currentCityName: getCurrentCityName(state),
    selectedSortType: getFeedSortType(state),
    currentTab: state.navigation.get('currentTab')
  }
};

export default connect(select, mapDispatchToProps)(AndroidTabNavigation);
