'use strict';

import React, { Component } from 'react';
import { TabBarIOS, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';
import FCM from 'react-native-fcm';

import CalendarView from './CalendarView';
import MoodView from './MoodView';
import CompetitionView from './CompetitionNavigator';
import HeilaView from './HeilaView';
import FeedView from './FeedView';
import SettingsView from './ProfileView';
import BuddyView from './BuddyView'

import Tabs from '../constants/Tabs';
import { changeTab } from '../actions/navigation';
import MDIcon from 'react-native-vector-icons/MaterialIcons';

const theme = require('../style/theme');


AsyncStorage.getItem('lastNotification').then(data=>{
  if (data){
    // if notification arrives when app is killed, it should still be logged here
    console.log('last notification', JSON.parse(data));
    AsyncStorage.removeItem('lastNotification');
  }
})

export function registerKilledListener(){
  // these callback will be triggered even when app is killed
  FCM.on(FCMEvent.Notification, notif => {
    AsyncStorage.setItem('lastNotification', JSON.stringify(notif));
  });
}

// # Tab navigation
function pushNotificationListener() {

  return FCM.on('notification', (notif) => {
    console.log('notificationListener ----> NOTIFICATION RECEIVED');
    console.log(notif);

    if (notif.opened_from_tray) {

      console.log('notif.opened_from_tray');
      navigator.push({
        component: HeilaView
      });

    } else {

      console.log('notification received while the app was foregr.');

    }

  });
}

class Navigation extends Component {
  constructor(props){
    super(props);
  }

  componentDidMount() {
    console.log('jebin');

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
          selected={currentTab === Tabs.HEILA}
          onPress={() => { this.onChangeTab(Tabs.HEILA); }}>
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
