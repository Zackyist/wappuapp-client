'use strict'

import React, { Component } from 'react';
import { View } from 'react-native'

import { connect } from 'react-redux';
import autobind from 'autobind-decorator';
import FCM from 'react-native-fcm';

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
import HeilaView from './HeilaView';
import FeedView from './FeedView';
import ProfileView from './ProfileView';
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
  Tabs.HEILA,
  Tabs.ACTION,
  Tabs.SETTINGS
];
const initialTab = 0;



function pushNotificationListener(navigator) {
  return FCM.on('notification', (notif) => {
    console.log('notificationListener ----> NOTIFICATION RECEIVED');
    console.log(notif);
  // this part of the code executes (or the notification callback is
  // called) in two different situations:
  //
  // 1. the app is not foreground and a push msg is received.
  //    a notification is automatically added to the notification
  //    area. this callback *HAS NOT* been called yet.
  //    when the user clicks the notification in the notification
  //    area the app opens and this callback is called
  //    **PAY ATTENTION**: this is called *AFTER* the click of
  //    the notification, not when the push msg itself arrives.
  //    the arrival of the push msg only adds the notification.
  //
  // 2. the application is in the foreground and a push msg
  //    arrives. when the app is in the foreground, a notification
  //    is *NOT* added to the notification area. this callback
  //    function is called RIGHT AWAY.

  // see the console.log(notif) in the second line of this func
  // and inspect the fields you're interested in

  if (notif.opened_from_tray) {
    // notif.opened_from_tray is set to 1
    // in the #1 situation described above
    console.log('notif.opened_from_tray');
    navigator.push({
      component: HeilaView
    })
    // handle this situation somehow
    //
    // HOW TO HANDLE THIS:
    // probably open the corresponding discussion in the app
    // ???

  } else {
    // this is executed when the app was foreground and a push message
    // was received from the network. no notification has been shown
    // in the notification area. this is situation #2 in the above
    // description.
    console.log('notification received while the app was foregr.');

    // HOW TO HANDLE THIS:
    // the user is viewing *some* part of the app as of now so lets
    // *NOT* take the user to the chat. bad UX.
    // update any UI counters of chat messages or whatnot so the user
    // sees that "aha, there's a msg over there lol" and can himself
    // navigate to the correct view
  }

  // WHAT IS A PUSH MSG/NOTIF IN WHAPPUAPP?
  // Pietari's opinion:
  // I think the notification itself should just be something like
  // "there's a msg from user Pate", nothing more.
  // All the logic that reads and writes the msgs themselves should
  // be handled in the chat view through Firebase itself.
  // It's of course trivial to send the user the actual msg payload
  // another user has sent but that should be *COMPLETELY* decoupled
  // from the actual msg handling; ie. just show the notification and
  // throw it in the trash, do not store the payload anywhere or whatnot.
  // Firebase connection shows all msgs etc. and that's that.
  //
  // My point is: do not confuse push msgs with the actual chat logic.
  // This is a decoupled sugar on top of the chat logic and no data from
  // the push msgs should be incorporated/merged/added to the chats
  // themselves.
});
}


class AndroidTabNavigation extends Component {

  componentDidMount() {

    this.props.changeTab(ANDROID_TAB_ORDER[initialTab])

    FCM.getFCMToken().then(token => {
      console.log('FCM.getFCMToken --> token ::: ')
      console.log(token)
      // client should now send this token to the server
    });

    this.refreshTokenListener = FCM.on('refreshToken', (token) => {
      console.log('refreshTokenListener ----->> token ::')
      console.log(token)
      // fcm token may not be available on first load, catch it here
    });
    const {navigator} = this.props;
    pushNotificationListener(navigator);
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
          <HeilaView navigator={navigator} tabLabel={{title:'Heila', icon:'favorite-border'}} />
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
