'use strict';

// TODO: Remove Button from imports when no longer used
// TODO: Replace the WhappuBuddy Button with a WB logo Image
// TODO: Get the bioText from the back-end
// TODO: Get class year from back-end

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

import ParallaxView from 'react-native-parallax-view';
import Icon from 'react-native-vector-icons/MaterialIcons';

import theme from '../../style/theme';
import Header from '../common/Header';
import Loader from '../common/Loader';

import UserView from '../user/UserView';
import Button from '../../components/common/Button';

const headerImage = require('../../../assets/buddy-test.jpg');

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
  
  componentDidMount() {
    const { user } = this.props.route;
    const { userId } = this.props;

    if (user && user.id) {
      this.props.fetchUserImages(user.id);
    } else {
      this.props.fetchUserImages(userId);
    }
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
                {userTeam || user.team}, 3. year
              </Text>
            </View>
          </View>
        )}
      >

        <View style={styles.bioView}>
          <Text style={styles.bioTitle}>About Me</Text>
          <Text style={styles.bioText}>
            Liirumlaarum olot sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium.
          </Text>
          <Text style={styles.lookingForTitle}>Looking For</Text>
          <Text style={styles.lookingForText}>
            Hauskaa wappuseuraa!
          </Text>
        </View>
        <View style={styles.logButtonView}>
          <Button
            onPress={this.showWhappuLog()}
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
    color: theme.secondary
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

export default connect(mapStateToProps, mapDispatchToProps)(BuddyUserView);
