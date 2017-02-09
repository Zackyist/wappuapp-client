'use strict'

import React, { Component } from 'react';
import {
  View,
  Navigator,
  StatusBar,
  BackAndroid,
} from 'react-native'

import { connect } from 'react-redux';
import _ from 'lodash';
import CalendarView from './CalendarView';
import CompetitionView from './CompetitionNavigator';
import FeedView from './FeedView';
import ProfileView from './ProfileView';
import RegistrationView from '../components/registration/RegistrationView';
import errorAlert from '../utils/error-alert';
import AndroidTabs  from 'react-native-scrollable-tab-view';
import LightBox from '../components/lightbox/Lightbox';
import Header from '../components/common/Header';

const theme = require('../style/theme');
const IconTabBar = require('../components/common/MdIconTabBar');

class AndroidTabNavigation extends Component {
  render() {
    const { navigator } = this.props;
    return (<View style={{flex: 1}}>
        {/*<Header title={'Whappu'} backgroundColor={theme.secondary} navigator={navigator} />*/}
        <AndroidTabs
          initialPage={0}
          tabBarPosition={'bottom'}
          tabBarUnderlineColor={theme.secondary}
          tabBarBackgroundColor={theme.white}
          tabBarActiveTextColor={theme.secondary}
          tabBarInactiveTextColor={'rgba(0, 0, 0, 0.6)'}
          locked={true}
          scrollWithoutAnimation={true}
          renderTabBar={() => <IconTabBar />}
        >
          <FeedView navigator={navigator} tabLabel={{title:'Buzz', icon:'whatshot'}} />
          <CalendarView navigator={navigator} tabLabel={{title:'Events', icon:'event-available'}} />
          <CompetitionView tabLabel={{title:'Ranking', icon:'stars'}} />
          <ProfileView navigator={navigator} tabLabel={{title:'Profile', icon:'account-circle'}} />
        </AndroidTabs>
      </View>
    )
  }
}

let _navigator;
BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator && _navigator.getCurrentRoutes().length > 1) {
    _navigator.pop();
    return true;
  }
  return false;
});

class MainView extends Component {
  renderScene(route, navigator) {
    _navigator = navigator;
    if (route.component) {
      const RouteComponent = route.component;
      return <RouteComponent navigator={_navigator} route={route} {...this.props} />
    }
  }

  render() {
    const immutableError = this.props.errors.get('error');
    if (immutableError) {
      const error = immutableError.toJS();
      errorAlert(this.props.dispatch, _.get(error, 'header'), _.get(error, 'message'));
    }

    return (
      <View style={{ flex:1 }}>
        <StatusBar backgroundColor={theme.secondaryLight} />

        <Navigator
          initialRoute={{
            component: AndroidTabNavigation,
            name: 'Whappu'
          }}
          renderScene={this.renderScene}
          configureScene={() => ({
            ...Navigator.SceneConfigs.FloatFromBottomAndroid
          })}
        />
        <RegistrationView />
        <LightBox />
      </View>
    )
  }
}


const select = store => {
  return {
    currentTab: store.navigation.get('currentTab'),
    errors: store.errors
  }
};
export default connect(select)(MainView);
