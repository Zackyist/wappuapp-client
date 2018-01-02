'use strict';

import React, { Component } from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';
import autobind from 'autobind-decorator';

import FCM from 'react-native-fcm';

import analytics from '../services/analytics';
import theme from '../style/theme';


const VIEW_NAME = 'HeilaView';

const styles = StyleSheet.create({
  navigator: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom:Platform.OS === 'ios' ? 0 : 0,
  },
  navbar: {
    backgroundColor: theme.secondary,
    height: 62,
    paddingBottom: 5,
    flexDirection: 'row',
    alignItems: 'center'
  }
});



// SUPER IMPORTANT:
// react-native-fcm version 5 is used because of RN version
// --------------->
// this is the correct documentation: 
// https://github.com/evollu/react-native-fcm/tree/v5.0.0





// when you call this function, it initializes a global FCM listener
// this means that this function *HAS TO BE CALLED* exactly once after
// the application has started. for simplicity it is now called in the
// componentDidMount of HeilaView but most likely should be transferred
// to some other place, ie. where the initial state is set or something
// like that. app bootup.
//
// this function can be called even if the user has not granted permission
// to receive push notifications. it just doesn't do anything in that case.
function pushNotificationListener() {

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

class HeilaView extends Component {
  componentDidMount() {

    console.log('HeilaView :: MOUNTED');
    analytics.viewOpened(VIEW_NAME);

    // FCM.requestPermissions(); // for iOS
    // TODO: add iOS specific hanlding here

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

    pushNotificationListener();

  }

  @autobind
  renderScene(route, navigator) {
    if (route.component) {
      const RouteComponent = route.component;
      return <RouteComponent route={route} {...this.props} />
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: theme.lightgrey }}>
        <Text>Tämä on uusi Heila-täbi :-) Löysit sen!</Text>
      </View>
    );
  }
}

export default HeilaView;
