// TODO: Get the bioText from the back-end
// TODO: Get the lookingFor from the back-end
// TODO: Get the class year from the back-end
// TODO: Replace placeholder headerImage with a WhappuBuddy header image
// TODO: BUG: Make sure that user data is loaded when entering from the navigation bar without going anywhere else first, currently not happening!
// TODO: Vuosikurssin järjestyskirjaimet st nd rd th jotenkin, ehkä jo matkalla bäkkäriin?
// TODO: Remove unused imports!
// TODO: PUT onPress={this.showWhappuLog()} back to the Whappu Log button!

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
  getUserImageUrl,
  fetchUserProfile,
  isLoadingUserImages,
} from '../../concepts/user';
import {
  getBuddyBio,
  getBuddyClassYear,
  getBuddyLookingFor,
  fetchBuddyProfile,
} from '../../concepts/buddyUser';
import { getUserName, getUserId } from '../../reducers/registration';
import { openLightBox } from '../../actions/feed';
import { openBuddyRegistrationView } from '../../actions/buddyRegistration';

import ParallaxView from 'react-native-parallax-view';
import Icon from 'react-native-vector-icons/MaterialIcons';
import UserAvatar from 'react-native-user-avatar';

import theme from '../../style/theme';
import Header from '../common/Header';
import Loader from '../common/Loader';

import UserView from '../user/UserView';
import Button from '../../components/common/Button';

const { height, width } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';

class BuddyUserView extends Component {
  // This method is used to navigate from the user's WhappuBuddy profile to their Whappu Log
  showWhappuLog = () => {
    let { user } = this.props.route;
    const { userName } = this.props;

    // Show Current user if not user selected
    if (!user) {
      user = { name: userName };
    }

    return () => {
      this.props.navigator.push({
        component: UserView,
        name: `${user.name}`,
        user
      });
    };
  }

  render() {

    const { buddyBio, buddyClassYear, buddyLookingFor, images, image_url, isLoading, totalVotes, totalSimas,
      userTeam, userName, navigator } = this.props;
    let { user } = this.props.route;

    // Show Current user if not user selected
    if (!user) {
      user = { name: userName, imageUrl: image_url, buddyBio: buddyBio, buddyLookingFor: buddyLookingFor, buddyClassYear: buddyClassYear }
    }

    let headerImage = require('../../../assets/frontpage_header-bg.jpg');

    // Show the user's profile picture as the header image if it's set
    if (image_url || user.imageUrl) {
      headerImage = { uri: image_url };
    }


    return (
      <View style={{ flex: 1 }}>
      {false && <Header backgroundColor={theme.secondary} title={user.name} navigator={navigator} />}
      <ParallaxView
        backgroundSource={headerImage}
        windowHeight={430}
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

            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>
                {user.name}
              </Text>
              <Text style={styles.headerSubTitle}>
                {userTeam || user.team}, {buddyClassYear} year
              </Text>
            </View>
          </View>
        )}
      >

        <View style={styles.bioView}>
          <Text style={styles.bioTitle}>About Me</Text>
          <Text style={styles.bioText}>
            {buddyBio}
          </Text>
          <Text style={styles.lookingForTitle}>Looking For</Text>
          <Text style={styles.lookingForText}>
            {buddyLookingFor}
          </Text>
        </View>
        <View style={styles.logButtonView}>
          <Button
            onPress={this.props.openBuddyRegistrationView}
            style={styles.logButton}
            isDisabled={false}
          >
            Check out my Whappu Log
          </Button>     
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
    justifyContent: 'flex-end'
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
  bioText: {
    fontSize: 14,
    fontWeight: 'normal',
    textAlign: 'justify',
    color: 'rgba(0,0,0,.6)',
    opacity: 0.9,
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  bioTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
    color: theme.secondary,
    opacity: 1,
    marginBottom: 2,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  bioView: {
    flex: 1,
    marginTop: 0
  },
  logButton: {
    flex: 1,
  },
  logButtonView: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    flexDirection: 'row',
  },
  lookingForText: {
    fontSize: 14,
    fontWeight: 'normal',
    textAlign: 'justify',
    color: 'rgba(0,0,0,.6)',
    opacity: 0.9,
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  lookingForTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
    color: theme.secondary,
    opacity: 1,
    marginBottom: 2,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  headerInfo:{
    backgroundColor: theme.secondary,
    opacity: 0.90,
    width: width,
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerTitle:{
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: theme.light,
    marginBottom: 3,
  },
  headerSubTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'rgba(0,0,0,0.6)',
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


const mapDispatchToProps = { openLightBox, fetchUserProfile, fetchBuddyProfile, openBuddyRegistrationView };

const mapStateToProps = state => ({
  images: getUserImages(state),
  isLoading: isLoadingUserImages(state),
  totalSimas: getTotalSimas(state),
  totalVotes: getTotalVotesForUser(state),
  userId: getUserId(state),
  userName: getUserName(state),
  userTeam: getUserTeam(state),
  image_url: getUserImageUrl(state),
  buddyBio: getBuddyBio(state),
  buddyLookingFor: getBuddyLookingFor(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(BuddyUserView);
