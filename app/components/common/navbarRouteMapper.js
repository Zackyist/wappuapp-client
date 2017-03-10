/*eslint-disable react/display-name*/
/*react-eslint misfires for jsx-returning functions*/

/**
 * Navigation Bar for IOS
 * Used with Navigator
 * https://github.com/facebook/react-native/blob/master/Examples/UIExplorer/Navigator/NavigationBarSample.js
 */

'use strict';

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActionSheetIOS,
  Platform,
  Image,
  TouchableHighlight
} from 'react-native';


import theme from '../../style/theme';
import CitySelector from '../header/CitySelector';
import Icon from 'react-native-vector-icons/Ionicons';

let showShareActionSheet = function(url) {
  if (Platform.OS === 'ios') {
    ActionSheetIOS.showShareActionSheetWithOptions({
      url: url
    },
  (error) => { /* */ },
  (success, method) => {
    /* */
  });
  }
}

let NavigationBarRouteMapper = {
  LeftButton: function(route, navigator, index, navState) {

    if (index > 0) {
      return (
        <TouchableHighlight
          underlayColor={'transparent'}
          onPress={() => { navigator.pop() }}>
          <Icon name='ios-arrow-back' style={styles.navBarIcon} /> :
          <View/>
        </TouchableHighlight>
      )
    }

    return <CitySelector />
  },

  RightButton: function(route, navigator, index, navState) {
    if (route.actions) {
      return (
        <TouchableHighlight
        onPress={() => {
          showShareActionSheet(route.post.link)
        }}
        >
          <Icon name='ios-upload-outline' style={styles.navBarIcon} />
        </TouchableHighlight>
        );
    }
    return null;
  },

  Title: function(route, navigator, index, navState) {

    if (route.showName) {
      return (
        <Text style={styles.navBarTitle}>
        {route.name}
        </Text>
      );
    }
    return (
      <View style={styles.navBarLogoWrap}>
        <Image
          source={require('../../../assets/header/4.png')}
          style={styles.navBarLogo} />
      </View>
    );
  }
};

var styles = StyleSheet.create({
  navBarLogoWrap:{
    flex:1,
    alignItems:'center'
  },
  navBarButton:{
    color: theme.white,
    padding:10,
    fontSize:16,
    textAlign:'center',
  },
  navBarIcon:{
    color: theme.white,
    padding:6,
    paddingLeft:10,
    paddingRight:10,
    fontSize:28,
    textAlign:'center',
  },
  navBarLogo:{
    top: 0,
    width:58,
    height:38,
  },
  navBarTitle:{
    padding:10,
    fontSize:16,
    color: theme.white,
    textAlign:'center',
    fontWeight:'bold',
  }
});

export default NavigationBarRouteMapper
