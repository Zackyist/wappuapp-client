'use strict'

import React, { Component } from 'react';
import { View, Alert } from 'react-native'

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
import BuddyView from './BuddyView';
import FeedView from './FeedView';
import ProfileView from './ProfileView';
import AndroidTabs  from 'react-native-scrollable-tab-view';
import Header from '../components/common/MainHeader';
import CitySelector from '../components/header/CitySelector';
import Tabs from '../constants/Tabs';
import {updateBuddyPushToken} from '../actions/registration';


const theme = require('../style/theme');
const IconTabBar = require('../components/common/MdIconTabBar');
const ANDROID_TAB_ORDER = [
  Tabs.FEED,
  Tabs.CALENDAR,
  Tabs.FEELING,
  Tabs.BUDDY,
  Tabs.ACTION,
  Tabs.SETTINGS
];
const initialTab = 0;

function pushNotificationListener(navigator) {
  return FCM.on('notification', (notif) => {
    console.log('notificationListener ----> NOTIFICATION RECEIVED');
    console.log(notif);


  if (notif.opened_from_tray) {
<<<<<<< HEAD
<<<<<<< HEAD

=======
    
>>>>>>> applied listeners to ios version and added killed app notification listener
=======

>>>>>>> NON-WORKING version of alert for notifications on foreground
    console.log('notif.opened_from_tray');
    navigator.push({
      component: BuddyView
    })


  } else {
<<<<<<< HEAD
<<<<<<< HEAD
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
=======

=======
    this.onForegroundNotif();
>>>>>>> NON-WORKING version of alert for notifications on foreground
    console.log('notification received while the app was foregr.');

>>>>>>> applied listeners to ios version and added killed app notification listener
  }
});
}


class AndroidTabNavigation extends Component {

  constructor(props) {
      super(props);

      this.state = {
        token: "",
        tokenCopyFeedback: ""
      }
    }

  componentDidMount() {

    this.props.changeTab(ANDROID_TAB_ORDER[initialTab])

    FCM.getFCMToken().then(token => {
      console.log('FCM.getFCMToken --> token ::: ')
      console.log(token)
      this.props.updateBuddyPushToken(token);
      // client should now send this token to the server
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

  @autobind
  onChangeTab({ i }) {
    this.props.changeTab(ANDROID_TAB_ORDER[i]);
  }

<<<<<<< HEAD
=======
  onForegroundNotif = () => {
    console.log('alerttihommia');
    Alert.alert(
      'New Message received',
      'Go check it out?',
      [
        { text: 'Nope'},
        { text: 'Yes, ofc '}
      ]
    );
  }
>>>>>>> NON-WORKING version of alert for notifications on foreground

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
          <BuddyView navigator={navigator} tabLabel={{title:'Buddy', icon:'favorite-border'}} />
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
  updateBuddyPushToken,
};

const select = state => {
  return {
    showCitySelection: getCityPanelShowState(state),
    currentCityName: getCurrentCityName(state),
    selectedSortType: getFeedSortType(state),
    currentTab: state.navigation.get('currentTab'),
  }
};

export default connect(select, mapDispatchToProps)(AndroidTabNavigation);
