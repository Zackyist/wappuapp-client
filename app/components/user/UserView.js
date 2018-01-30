'use strict';

import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity,
  TouchableHighlight, Image, Platform, Text } from 'react-native';
import { connect } from 'react-redux';

import {
  getUserImages,
  getUserTeam,
  getTotalSimas,
  getTotalVotesForUser,
  fetchUserImages,
  isLoadingUserImages,
} from '../../concepts/user';
import { getUserName, getUserId } from '../../reducers/registration';
import { openLightBox } from '../../actions/feed';
import analytics from '../../services/analytics';

import ParallaxView from 'react-native-parallax-view';
import Icon from 'react-native-vector-icons/MaterialIcons';

import FCM, {FCMEvent} from 'react-native-fcm';

import theme from '../../style/theme';
import Header from '../common/Header';
import Loader from '../common/Loader';

const headerImage = require('../../../assets/frontpage_header-bg.jpg');

const { height, width } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';

const VIEW_NAME = 'UserView';

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

class UserView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: "",
      tokenCopyFeedback: ""
    }
  }
  componentDidMount() {
    const { user } = this.props.route;
    const { userId } = this.props;

    if (user && user.id) {
      this.props.fetchUserImages(user.id);
    } else {
      this.props.fetchUserImages(userId);
    }
    console.log('UserView :: MOUNTED');
    analytics.viewOpened(VIEW_NAME);

    if (isIOS)
    {


     FCM.requestPermissions(); // for iOS
     // TODO: add iOS specific hanlding here
    }

    FCM.getFCMToken().then(token => {
      console.log('FCM.getFCMToken --> token ::: ')
      console.log(token)
      this.setState(token: token)
      console.log(this.state.token)
      // client should now send this token to the server
    });

    this.refreshTokenListener = FCM.on('refreshToken', (token) => {
      console.log('refreshTokenListener ----->> token ::')
      console.log(token)
      this.setState(token: token)
      console.log(this.state.token)
      // fcm token may not be available on first load, catch it here
    });

    pushNotificationListener();

  }

  render() {

    const { images, isLoading, totalVotes, totalSimas,
      userTeam, userName, navigator } = this.props;
    let { user } = this.props.route;

    // Show Current user if not user selected
    if (!user) {
      user = { name: userName }
    }

    const imagesCount = images.size;

    return (
      <View style={{ flex: 1 }}>
      {false && <Header backgroundColor={theme.secondary} title={user.name} navigator={navigator} />}
      <ParallaxView
        backgroundSource={headerImage}
        windowHeight={270}
        style={{ backgroundColor:theme.white }}
        header={(
          <View style={styles.header}>
            {!isIOS &&
            <View style={styles.backLink}>
              <TouchableHighlight onPress={() => navigator.pop()} style={styles.backLinkText} underlayColor={'rgba(255, 255, 255, .1)'}>
                <Icon name="arrow-back" size={28} style={styles.backLinkIcon}  />
              </TouchableHighlight>
            </View>
            }
            <View style={styles.avatar}>
              <Icon style={styles.avatarText} name="person-outline" />
            </View>
            <Text style={styles.headerTitle}>
              {user.name}
            </Text>
            <Text style={styles.headerSubTitle}>
              {userTeam || user.team}
            </Text>
            <View style={styles.headerKpis}>
              <View style={styles.headerKpi}>
                <Text style={styles.headerKpiValue}>{!isLoading ? imagesCount : '-'}</Text>
                <Text style={styles.headerKpiTitle}>photos</Text>
              </View>
              <View style={styles.headerKpi}>
                <Text style={styles.headerKpiValue}>{!isLoading ? totalVotes : '-'}</Text>
                <Text style={styles.headerKpiTitle}>votes for photos</Text>
              </View>
              <View style={styles.headerKpi}>
                <Text style={styles.headerKpiValue}>{!isLoading ? (totalSimas || '-') : '-'}</Text>
                <Text style={styles.headerKpiTitle}>simas</Text>
              </View>
            </View>
          </View>
        )}
      >

      <View style={styles.container}>
        {isLoading && <View style={styles.loader}><Loader size="large" /></View>}
        {images.size > 0 &&
          <View style={styles.imageContainer}>
            {images.map(image =>
              <View key={image.get('id')}>
                <TouchableOpacity
                activeOpacity={1}
                onPress={() => this.props.openLightBox(image.get('id'))}
                >
                  <Image
                    key={image.get('id')}
                    style={{height: width / 3 - 5, width: width / 3 - 5, margin: 2, backgroundColor: theme.stable}}
                    source={{uri: image.get('url')}}/>
                </TouchableOpacity>
              </View>
            )}
          </View>
        }
        {!isLoading && !images.size &&
          <View style={styles.imageTitleWrap}>
            <Text style={styles.imageTitle}>No photos</Text>
          </View>
        }
      </View>
      </ParallaxView>
      </View>
    );
  }
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.white,
    minHeight: height / 2
  },
  header: {
    flex:1,
    elevation: 3,
    paddingTop: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  backLink: {
    position: 'absolute',
    left: 7,
    top: 7,
    zIndex: 2,
  },
  backLinkText: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.transparent
  },
  backLinkIcon: {
    color: theme.white
  },
  headerTitle:{
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: theme.light,
    marginBottom: 3,
  },
  headerSubTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'rgba(0,0,0,.6)',
    opacity: 0.9,
  },
  avatar: {
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    height: 90,
    backgroundColor: theme.stable,
    borderRadius: 45,
  },
  avatarText: {
    backgroundColor: theme.transparent,
    color: theme.secondary,
    fontSize: 60,
  },
  headerKpis: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  headerKpi: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 25,
  },
  headerKpiTitle: {
    color: theme.accentLight,
    fontWeight: '500',
    fontSize: 11,
  },
  headerKpiValue: {
    fontSize: 26,
    color: theme.accentLight,
    fontWeight: '400'
  },
  loader: {
    marginTop: 50
  },
  imageContainer:{
    margin: 1,
    marginTop: 2,
    marginBottom: 30,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 50,
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  imageTitle: {
    textAlign: 'center',
    color: theme.grey,
    margin: 20,
    marginTop: 40,
    fontSize: 15,
    fontWeight: '600'
  },
  imageTitleWrap: {
    flex: 1,
    marginTop: 0
  },
});


const mapDispatchToProps = { openLightBox, fetchUserImages };

const mapStateToProps = state => ({
  images: getUserImages(state),
  isLoading: isLoadingUserImages(state),
  totalSimas: getTotalSimas(state),
  totalVotes: getTotalVotesForUser(state),
  userId: getUserId(state),
  userName: getUserName(state),
  userTeam: getUserTeam(state)
});

export default connect(mapStateToProps, mapDispatchToProps)(UserView);
