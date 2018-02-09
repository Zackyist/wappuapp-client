'use strict';

import React, { Component } from 'react';
import { TabBarIOS, Alert } from 'react-native';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';
import FCM from 'react-native-fcm';

import CalendarView from './CalendarView';
import MoodView from './MoodView';
import CompetitionView from './CompetitionNavigator';
import FeedView from './FeedView';
import SettingsView from './ProfileView';
import BuddyView from './BuddyView'

import Tabs from '../constants/Tabs';
import { changeTab } from '../actions/navigation';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import {updateBuddyPushToken} from '../actions/registration';

const theme = require('../style/theme');

const pushNotificationListener = (navigator) => {
  return FCM.on('notification', (notif) => {
    console.log('notificationListener ----> NOTIFICATION RECEIVED');
    console.log(notif);

    if (notif.opened_from_tray) {
      console.log('notif.opened_from_tray');
      navigator.push({
        component: BuddyView
      })


    } else {
      //if (notif.notifType === 'message')
      Alert.alert(
        'New Message received',
        'Go check it out?',
        [
          { text: 'Nope'},
          { text: 'Yes, ofc ', onPress: () => navigator.push({ component: BuddyView}) }
        ]
      );

      console.log('notification received while the app was foregr.');
      console.log(notif);
    }
  });
}

// # Tab navigation
class Navigation extends Component {
  @autobind
  onChangeTab(tab) {
    this.props.changeTab(tab);
  }

  componentDidMount(){

    FCM.requestPermissions();
    FCM.getFCMToken().then(token => {
      console.log('FCM.getFCMToken --> token ::: ')
      console.log(token)
      this.props.updateBuddyPushToken(token);
    });

    this.refreshTokenListener = FCM.on('refreshToken', (token) => {
      console.log('refreshTokenListener ----->> token ::')
      console.log(token)
      this.props.updateBuddyPushToken(token);
      // fcm token may not be available on first load, catch it here
    });

    const {navigator} = this.props;
    pushNotificationListener(navigator);

    FCM.getInitialNotification().then(notif => {
      this.setState({
        initNotif: notif
      })
    });
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
