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
import { getCurrentTab } from '../../reducers/navigation';
import { openLightBox } from '../../actions/feed';

import ParallaxView from 'react-native-parallax-view';
import Icon from 'react-native-vector-icons/MaterialIcons';

import theme from '../../style/theme';
import Header from '../common/Header';
import Loader from '../common/Loader';

import AppInfo from './AppInfo';
import LegalStuff from './LegalStuff';
import PopupMenu from './PopupMenu';

import { openRegistrationView } from '../../actions/registration';
import { getCurrentCityName } from '../../concepts/city';
import WebViewer from '../webview/WebViewer';

const headerImage = require('../../../assets/frontpage_header-bg.jpg');

const { height, width } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';



class UserView extends Component {

  componentDidMount() {
    const { user } = this.props.route;
    const { userId } = this.props;

    console.log(user)

    if (user && user.id) {
      this.props.fetchUserImages(user.id);
    }
  }

  componentWillReceiveProps({ tab, userId }) {
    // Fetch images on Settings tab
    if (tab !== this.props.tab && tab === 'SETTINGS') {
      this.props.fetchUserImages(userId);
      console.log('own profile');
    }
  }
  
  onTOS = () => {
    this.props.navigator.push({component: LegalStuff});
  }
  onChangeMyProfile() {
    this.props.openRegistrationView();
  }

  onAppInfo = () => {
    this.props.navigator.push({component: AppInfo});
  }

  onFuksiSurvivalKit = () => {
    this.props.navigator.push({
      component: WebViewer,
      showName: true,
      name: 'Fuksi Survival Kit',
      url: 'https://ttyy.fi/me-ollaan-teekkareita/teekkarikulttuuri/wappu/fuksi-survival-kit/'
    });
  }

  onPopupEvent = (eventName, index) => {

    if (eventName !== 'itemSelected') return
    if (index === 0) this.onTOS()
    else if (index === 1) this.onChangeMyProfile()
    else if (index === 2) this.onAppInfo()
    else this.onFuksiSurvivalKit()
  }

  render() {

    const { images, isLoading, totalVotes, totalSimas,
      userTeam, userName, navigator, cityName } = this.props;
    let { user } = this.props.route;

    // Show Current user if not user selected
    if (!user) {
      user = { name: userName,
               team: userTeam };
      console.log(userTeam);
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
            {!isIOS && user.name !== userName &&
            <View style={styles.backLink}>
              <TouchableHighlight onPress={() => navigator.pop()} style={styles.backLinkText} underlayColor={'rgba(255, 255, 255, .1)'}>
                <Icon name="arrow-back" size={28} style={styles.backLinkIcon} />
              </TouchableHighlight>
            </View>
            }

            {user.name === userName && !isIOS &&
              <View style={styles.menu}>
                {cityName === 'Tampere' &&
                    <PopupMenu actions={['Terms of Service', 'Change my profile', 'App Information', 'Fuksi Survival Kit']} onPress={this.onPopupEvent} />
                }
                {cityName !== 'Tampere' &&
                    <PopupMenu actions={['Terms of Service', 'Change my profile', 'App Information']} onPress={this.onPopupEvent} />
                }
              </View>
            }

            <View style={styles.avatar}>
              <Icon style={styles.avatarText} name="person-outline" />
            </View>
            <Text style={styles.headerTitle}>
              {user.name}
            </Text>
            <Text style={styles.headerSubTitle}>
              {user.team}
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
  menu: {
    position: 'absolute',
    right: 7,
    top: 7,
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


const mapDispatchToProps = { openLightBox, fetchUserImages, openRegistrationView };

const mapStateToProps = state => ({
  images: getUserImages(state),
  isLoading: isLoadingUserImages(state),
  totalSimas: getTotalSimas(state),
  totalVotes: getTotalVotesForUser(state),
  userId: getUserId(state),
  userName: getUserName(state),
  userTeam: getUserTeam(state),
  cityName: getCurrentCityName(state),
  tab: getCurrentTab(state)
});

export default connect(mapStateToProps, mapDispatchToProps)(UserView);