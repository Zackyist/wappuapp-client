'use strict';

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Platform,
  Text,
  Alert
} from 'react-native';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';
import { parseInt } from 'lodash';

import {
  fetchUserProfile,
  getUserImageUrl,
  fetchUserImages,
  submitOpinion,
  fetchUserBuddies,
  getUserBuddies,
  getUserTeam
} from '../../concepts/user';
import {
  getBuddyBio,
  getBuddyClassYear,
  getBuddyLookingFor,
  fetchBuddyProfile,
} from '../../concepts/buddyUser';
import {
  getUserName,
  getUserId,
  getLookingForTypes,
  isDataUpdated
} from '../../reducers/registration';
import { openBuddyRegistrationView, acknowledgeDataUpdate } from '../../actions/registration';

import ParallaxView from 'react-native-parallax-view';
import Icon from 'react-native-vector-icons/MaterialIcons';
import UserAvatar from 'react-native-user-avatar';
import abuse from '../../services/abuse';

import theme from '../../style/theme';
import Header from '../common/Header';
import Loader from '../common/Loader';
import PopupMenu from '../user/PopupMenu';
import { getCurrentTab } from '../../reducers/navigation';

import UserView from '../user/UserView';
import Button from '../../components/common/Button';

const { height, width } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';



class BuddyUserView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      buddyIndex: 0,
      buddyToShow: this.props.route
    };
  }

  componentDidMount() {
    const { user } = this.props.route;
    const { userId } = this.props;

    if (user && user.id) {
      this.props.fetchBuddyProfile(user.id);
      this.props.fetchUserBuddies(user.id);
    } else {
      this.props.fetchBuddyProfile(userId);
    }
    
  }

  componentWillReceiveProps({ tab, userId }) {
    // Fetch images and data on Buddy tab if this is the user's own profile
    if (tab !== this.props.tab && tab === 'BUDDY') {
      this.props.fetchUserImages(userId);
      this.props.fetchUserProfile(userId);
    }
  }

  componentDidUpdate() {
    // Ensure that the user data is updated right after editing the profile
    if (this.props.isDataUpdated) {
      const { userId } = this.props;
      this.props.acknowledgeDataUpdate();
      this.props.fetchBuddyProfile(userId);
    }
  }

  // This method is used to navigate from the user's WhappuBuddy profile to their Whappu Log
  @autobind
  showWhappuLog() {
    let { user } = this.props.route;

    return () => {
      this.props.navigator.push({
        component: UserView,
        name: `${user.name}`,
        user
      });
    };
  }


  onPopupEvent = (eventName, index) => {

    if (eventName !== 'itemSelected') return
    if (index === 0) this.onReportUser()
  }

  onMyPopupEvent = (eventName, index) => {

    if (eventName !== 'itemSelected') return
    if (index === 0) this.onEditProfile()
    if (index === 1) this.onDeleteProfile()
  }

  @autobind
  onEditProfile() {
    this.props.openBuddyRegistrationView();
  }

  onDeleteProfile = () => {

  }

  onReportUser = () => {
    Alert.alert(

      'Flag Content',
      'Do you want to report this user?',
      [
        { text: 'Cancel',
          onPress: () => this.onDeleteProfile() , style: 'cancel' },
        { text: 'Yes, report user',
          onPress: () => { abuse.reportUser(this.props.route.user) }, style: 'destructive' }
      ]
    );
  }

  @autobind
  nextBuddy() {
    if (this.state.buddyIndex === this.props.buddies.size - 1) {
      this.setState({buddyIndex: 0});
    }
    else {
      this.setState({buddyIndex: this.state.buddyIndex + 1});
    }
    
    this.setState({buddyToShow: this.props.buddies.get(this.state.buddyIndex)});

    this.props.fetchBuddyProfile(this.state.buddyToShow.id);
    this.props.fetchUserProfile(this.state.buddyToShow.id);
    this.props.fetchUserImages(this.state.buddyToShow.id);
  }

  @autobind
  onLikePress(){
    this.nextBuddy()
    //this.props.buddies.delete(this.state.buddyIndex);

    const Subpackage  = {
      matchedUserId: this.state.buddyToShow.id,
      opinion: 'UP'
    };
    this.props.submitOpinion(Subpackage);
  }

  //this.props.fetchUserBuddies(this.props.userId);
  @autobind
  onDislikePress(){
    this.nextBuddy()
    //this.props.buddies.delete(this.state.buddyIndex);

    const Subpackage  = {
      matchedUserId: this.state.buddyToShow.id,
      opinion: 'DOWN'
    };
    this.props.submitOpinion(Subpackage);
  }

  // Adds ordinal endings to the class year
  @autobind
  renderClassYear() {
    const { buddyClassYear } = this.props;

    if (buddyClassYear) {
      const lastChar =buddyClassYear.slice(-1);
      let ordinal = 'th';

      switch (parseInt(lastChar)) {
        case 1:
          ordinal = 'st';
          break;
        case 2:
          ordinal = 'nd';
          break;
        case 3:
          ordinal = 'rd';
          break;
        default:
      }

      // 11, 12 and 13 are always 'th'
      const parsed = parseInt(buddyClassYear);
      if (parsed == 11 || parsed == 12 || parsed == 13) {
        ordinal = 'th';
      }
      
      return ', ' + buddyClassYear + ordinal + ' year';
    } else {
      return '';
    }
  }

  @autobind
  renderLookingFor() {
    if (this.state.buddyToShow.bio_looking_for_type_id) {
      return this.props.lookingForTypes.find(item => item.id === this.state.buddyToShow.bio_looking_for_type_id).type;
    } else {
      return 'Nothing specific';
    }
  }

  render() {

    const { buddyBio, buddyClassYear, buddyLookingFor, image_url, userTeam, userName, navigator } = this.props;
    let { user } = this.props.route;

    // Show Current user if not user selected
    if (!user) {
      user = { name: userName, imageUrl: image_url, buddyBio: buddyBio, buddyLookingFor: buddyLookingFor, buddyClassYear: buddyClassYear }
    }

    let headerImage = require('../../../assets/frontpage_header-bg.jpg');

    // Show the user's profile picture as the header image if it's set
    if ( this.state.buddyToShow.image_url || user.imageUrl || image_url) {
      headerImage = { uri: this.state.buddyToShow.image_url || user.image_url };
      console.log('kuvasetti');
      console.log(headerImage);
      if (this.props.route.name === this.state.buddyToShow.name) {
        headerImage = {uri: this.state.buddyToShow.image_url || image_url}
      }
    }

    console.log('kamu');
    console.log(this.state.buddyToShow);


    return (
      <View style={{ flex: 1 }}>
      {false && <Header backgroundColor={theme.secondary} title={user.name} navigator={navigator} />}
      <ParallaxView
        backgroundSource={headerImage}
        windowHeight={height/1.8}
        style={{ backgroundColor:theme.white }}
        header={(
          <View style={styles.header}>
            {!isIOS && user.name !== userName &&
            <View style={styles.backLink}>
              <TouchableHighlight onPress={() => navigator.pop()} style={styles.backLinkText} underlayColor={'rgba(255, 255, 255, .1)'}>
                <Icon name="arrow-back" size={28} style={styles.backLinkIcon}  />
              </TouchableHighlight>
            </View>
            }


            {user.name === userName && !isIOS &&
              <View style={styles.menu}>
                <PopupMenu actions={['Edit my profile', 'Delete my profile']} onPress={this.onMyPopupEvent} />
              </View>
            }

            {user.name !== userName && !isIOS &&
              <View style={styles.menu}>
                <PopupMenu actions={['Report user']} onPress={this.onPopupEvent} />
              </View>
            }


            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>
              {this.props.buddies.size > 0 &&
                this.state.buddyToShow.name || userName || "A man/woman has no name"
              }
              </Text>
              <Text style={styles.headerSubTitle}>
              {this.props.buddies.size > 0 &&
                this.state.buddyToShow.class_year || buddyClassYear || "69 BC"
              }
              </Text>
            </View>
          </View>
        )}
      >

        <View style={styles.bioView}>
          <Text style={styles.bioTitle}>About Me</Text>
          <Text style={styles.bioText}>
          {this.props.buddies.size > 0 &&
            this.state.buddyToShow.bio_text || buddyBio || "No bio for lamo"
          }
          </Text>
          
          <Text style={styles.lookingForTitle}>Looking For</Text>
          <Text style={styles.lookingForText}>
            {this.renderLookingFor()}
          </Text>

        </View>

        <View style={styles.thumbs}>
        
        { /* Only show the opinion buttons as well as the Whappu Log connection button if this is not
             the user's own profile */}
        {user.id &&
          <View style={{flex: 1, flexDirection: 'row'}}>
          <TouchableHighlight onPress={this.onLikePress}>
            <Image style={{width: 100, height: 100, marginHorizontal: 25}} source={require('../../../assets/thumbUp.png')}/>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.onDislikePress}>
            <Image style={{width: 100, height: 100, marginHorizontal: 25}} source={require('../../../assets/thumbDown.png')}/>
          </TouchableHighlight>
          </View>
        }
        </View>

        {user.id &&
        <View style={styles.logButtonView}>
          <Button
            onPress={ this.nextBuddy }
            style={styles.logButton}
            isDisabled={false}
          >
            Skip
          </Button>     
        </View>
        }

        {user.id &&
        <View style={styles.logButtonView}>
          <Button
            onPress={this.showWhappuLog()}
            style={styles.logButton}
            isDisabled={false}
          >
            Check out my Whappu Log
          </Button>
        </View>
        }

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
  thumbs: {
    justifyContent: 'center',
    alignItems: 'center',
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


const mapDispatchToProps = { 
  acknowledgeDataUpdate,
  fetchUserImages,
  fetchUserProfile,
  fetchBuddyProfile,
  openBuddyRegistrationView,
  submitOpinion,
  fetchUserBuddies
};

const mapStateToProps = state => ({
  buddyBio: getBuddyBio(state),
  buddyClassYear: getBuddyClassYear(state),
  buddyLookingFor: getBuddyLookingFor(state),
  image_url: getUserImageUrl(state),
  isDataUpdated: isDataUpdated(state),
  lookingForTypes: getLookingForTypes(state),
  userId: getUserId(state),
  userName: getUserName(state),
  userTeam: getUserTeam(state),
  tab: getCurrentTab(state),
  buddies: getUserBuddies(state)
});

export default connect(mapStateToProps, mapDispatchToProps)(BuddyUserView);
