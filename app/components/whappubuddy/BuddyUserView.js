// TODO: onBuddiesEnd and corresponding render

'use strict';

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Platform,
  Text,
  Alert,
  ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';
import { parseInt } from 'lodash';
import Modal from 'react-native-modal';

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
  fetchBuddyProfile,
  updateCurrentBuddy,
  getBuddyUserProfile
} from '../../concepts/buddyUser';
import {
  getUserName,
  getUserId,
  getLookingForTypes,
  isOwnBuddyProfileShown,
  isDataUpdated,
  usesWhappuBuddy
} from '../../reducers/registration';
import {
  acknowledgeDataUpdate,
  openBuddyIntroView,
  openBuddyRegistrationView
} from '../../actions/registration';

import ParallaxView from 'react-native-parallax-view';
import Icon from 'react-native-vector-icons/MaterialIcons';
import abuse from '../../services/abuse';

import theme from '../../style/theme';
import Header from '../common/Header';
import PopupMenu from '../user/PopupMenu';
import { getCurrentTab } from '../../reducers/navigation';

import UserView from '../user/UserView';
import DeleteProfileView from './DeleteProfileView';
import Button from '../../components/common/Button';

const { height, width } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';

class BuddyUserView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      buddyIndex: 0,
      buddyToShow: this.props.route,
      popModalVisible: false
    };
  }

  componentDidMount() {
    const { user } = this.props.route;
    const { userId } = this.props;

    // Fetch own profile if requested
    if (this.props.isOwnBuddyProfileShown) {
      if (this.props.usesWhappuBuddy) {
        this.props.fetchBuddyProfile(userId);
      }
    
    // Fetch buddies when accessing the view from somewhere else than the Buddy tab
    } else if (user && user.id) {
      this.props.fetchBuddyProfile(user.id);
      this.props.fetchUserBuddies(user.id);

    // Fetch buddies when accessing the view from the Buddy tab
    } else {
      this.props.fetchUserBuddies(userId).then(() => {
        this.props.updateCurrentBuddy(this.props.buddies.get(0));
      });
    }
  }

  componentWillReceiveProps({ tab, userId }) {
    // Fetch images and data if accessing this view through the Buddy tab
    if (!this.props.isOwnBuddyProfileShown && tab !== this.props.tab && tab === 'BUDDY') {
      this.props.fetchUserBuddies(userId).then(() => {
        this.props.updateCurrentBuddy(this.props.buddies.get(0));
      });
    }
  }

  componentDidUpdate() {
    // Ensure that the user data is updated right after editing the WhappuBuddy profile
    // as well as after switching WhappuBuddy tabs
    const { userId } = this.props;

    if (this.props.isDataUpdated && this.props.isOwnBuddyProfileShown) {
      this.props.acknowledgeDataUpdate();
      this.props.fetchUserProfile(userId);
      this.props.fetchBuddyProfile(userId);

    // Ensure that Discover mode is re-entered after changing tabs
    } else if (this.props.isDataUpdated && !this.props.isOwnBuddyProfileShown) {
      this.props.acknowledgeDataUpdate();
      this.props.fetchUserBuddies(userId).then(() => {
        this.props.updateCurrentBuddy(this.props.buddies.get(0));
      });
    }
  }

  // Checks whether this is the user's own profile or not
  isCurrentUser() {
    let user = this.props.currentBuddy;
    const { userId } = this.props;

    // For My Profile mode
    if (this.props.isOwnBuddyProfileShown) {
      return true;
    }

    // For Discover mode and accessing through Whappu Log
    if (user) {
      if (user.id == userId) {
        return true;
      } else {
        return false;
      }
    }

    return true;
  }

  // This method is used to navigate from the user's WhappuBuddy profile to their Whappu Log
  @autobind
  showWhappuLog() {
    let buddy = this.props.currentBuddy;

    let user = {
      id: buddy.id,
      name: buddy.name,
      team: buddy.team,
      type: 'OTHER_USER'
    };

    return () => {
      this.props.navigator.push({
        component: UserView,
        name: user.name,
        user,
        fromWhappuBuddy: true
      });
    };
  }

  /* Popup Menu functions start */

  // Popup Menu actions for other users' profiles
  onPopupEvent = (eventName, index) => {
    if (eventName !== 'itemSelected') return
    if (index === 0) this.onReportUser()
  }

  // Popup Menu actions for the user's own profile
  onMyPopupEvent = (eventName, index) => {
    if (eventName !== 'itemSelected') return
    if (index === 0) this.onEditProfile()
    if (index === 1) this.onDeleteProfile()
  }

  // Open iOS menu
  openPopModal = () => {
    this.setState({popModalVisible:true});
  }

  // Toggle iOS menu
  togglePopModal = () => {
    if (this.state.modalVisible){
      this.closePopModal();
    }
    else {
      this.openPopModal();
    }
  }

  // Close iOS menu
  closePopModal = () => {
    this.setState({popModalVisible:false});
  }

  @autobind
  onEditProfile() {
    this.closePopModal();
    this.props.openBuddyRegistrationView();
  }

  @autobind
  onDeleteProfile() {
    this.closePopModal();
    this.props.navigator.push({
      component: DeleteProfileView
    });
  }

  @autobind
  onReportUser() {
    if (isIOS){
      this.closePopModal();
    }

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

  /* Popup Menu functions end  */

  /* Buddy browsing functions start */
  @autobind
  onBuddiesEnd(){
    //TODO
  }

  @autobind
  nextBuddy() {
    if (this.props.buddies.size > 0) {
      this.props.updateCurrentBuddy(this.props.buddies.get(this.state.buddyIndex));

      if (this.state.buddyIndex === this.props.buddies.size - 1) {
        this.setState({buddyIndex: 0});
      }
      else {
        this.setState({buddyIndex: this.state.buddyIndex + 1});
      }

    }
    else {
      this.onBuddiesEnd()
    }
  }

  @autobind
  onLikePress(){
    if (this.props.usesWhappuBuddy) {
      const Subpackage  = {
        matchedUserId: this.props.currentBuddy.id,
        opinion: 'UP'
      };
      if (isIOS){
        this.closePopModal();
      }
      this.props.submitOpinion(Subpackage);
      this.props.buddies.delete(this.state.buddyIndex);
      this.nextBuddy()
    } else {
      this.props.openBuddyIntroView();
    }
  }

  @autobind
  onDislikePress(){
    if (this.props.usesWhappuBuddy) {
      const Subpackage  = {
        matchedUserId: this.props.currentBuddy.id,
        opinion: 'DOWN'
      };
  
      this.props.submitOpinion(Subpackage);
      this.props.buddies.delete(this.state.buddyIndex);
      this.nextBuddy()
    } else {
      this.props.openBuddyIntroView();
    }
  }
  /* Buddy browsing functions end */

  @autobind
  renderBuddyProfile() {
    const { navigator } = this.props;
    let buddy = this.props.currentBuddy;
    let headerImage = require('../../../assets/frontpage_header-bg.jpg');

    // Show the user's profile picture as the header image if it's set
    if (buddy.image_url) {
      headerImage = { uri: buddy.image_url};
    }

    return (
      <ScrollView
        ref={view => this.containerScrollViewRef = view}
        showsVerticalScrollIndicator={true}
        style={styles.container}
      >
        <ParallaxView
          backgroundSource={headerImage}
          windowHeight={height / 2.3}
          style={{ backgroundColor:theme.white }}
          header={(

            <View style={styles.header}>

              { /* Back Arrow for Android */ }
              {!isIOS && !this.isCurrentUser() && this.props.tab === 'FEED' &&
                <View style={styles.backLink}>
                  <TouchableHighlight onPress={() => navigator.pop()} style={styles.backLinkText} underlayColor={'rgba(255, 255, 255, .1)'}>
                    <Icon name="arrow-back" size={28} style={styles.backLinkIcon}  />
                  </TouchableHighlight>
                </View>
              }

              { /* Android Popup Menu for own user profile */ }
              {this.isCurrentUser() && !isIOS &&
                <View style={styles.menu}>
                  <PopupMenu actions={['Edit my profile', 'Delete my profile']} onPress={this.onMyPopupEvent} />
                </View>
              }

              { /* iOS Popup Menu for own user profile */ }
              {this.isCurrentUser() && isIOS &&
                <View style={styles.popContainer}>
                  <Modal
                      onBackdropPress={() => this.setState({ popModalVisible: false })}
                      visible={this.state.popModalVisible}
                      animationType={'fade'}>
                      <View style={styles.modalContainer}>
                      <TouchableOpacity onPress={this.onEditProfile}>
                        <Text style={styles.modalLink}> Edit my profile</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={this.onDeleteProfile}>
                        <Text style={styles.modalLink}> Delete profile</Text>
                      </TouchableOpacity>
                      </View>
                  </Modal>
                  <TouchableOpacity onPress={this.togglePopModal}>
                  <Icon name='more-vert' size={28} color={'white'} />
                  </TouchableOpacity>
                </View>
              }

              { /* Android Popup Menu for other user's profile */ }
              {!this.isCurrentUser() && !isIOS &&
                <View style={styles.menu}>
                  <PopupMenu actions={['Report user']} onPress={this.onPopupEvent} />
                </View>
              }

              { /* iOS Popup Menu for other user's profile */ }
              {!this.isCurrentUser() && isIOS &&
                <View style={styles.popContainer}>
                  <Modal
                      onBackdropPress={() => this.setState({ popModalVisible: false })}
                      visible={this.state.popModalVisible}
                      animationType={'fade'}>
                      <View style={styles.modalContainer}>
                      <TouchableOpacity onPress={this.onReportUser}>
                        <Text style={styles.modalLink}> Report user</Text>
                      </TouchableOpacity>
                      </View>
                  </Modal>
                  <TouchableOpacity onPress={this.togglePopModal}>
                  <Icon name='more-vert' size={28} color={'white'} />
                  </TouchableOpacity>
                </View>
              }
              
              { /* Quick and dirty fix for the user info header below not always being rendered
                    TODO: Find out why the element in this exact position in the element hierarchy
                          sometimes renders and sometimes does not. And why a simple View does not
                          fix it, instead requiring the Text element inside it as well. */ }
              <View><Text></Text></View>

              { /* Actual header for user info */ }
              <View style={styles.headerInfo}>
                <Text style={styles.headerTitle}>
                  { buddy.name || '' }
                </Text>
                <Text style={styles.headerSubTitle}>
                  { this.props.userTeam || '' }
                  { this.renderClassYear(buddy.class_year) || '' }
                </Text>
              </View>

            </View>
            )}
        >
        
          { /* Only show the Whappu Log connection button if this is not the user's own profile
               and if the user has not arrived here from a Whappu Log */}
          {!this.isCurrentUser() && !this.props.route.fromWhappuLog &&
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

          { /* WhappuBuddy Profile Data */ }
          <View style={styles.bioView}>
            <Text style={styles.bioTitle}>About Me</Text>

            <Text style={styles.bioText}>
            { buddy.bio_text || '' }
            </Text>

            <Text style={styles.lookingForTitle}>Looking For</Text>
            <Text style={styles.lookingForText}>
              {this.renderLookingFor(buddy)}
            </Text>
          </View>
        </ParallaxView>
      </ScrollView>
    );
  }

  // Adds ordinal endings to the class year
  @autobind
  renderClassYear(ClassYear) {

    if (ClassYear) {
      const lastChar = ClassYear.slice(-1);
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
      const parsed = parseInt(ClassYear);
      if (parsed == 11 || parsed == 12 || parsed == 13) {
        ordinal = 'th';
      }

      return ', ' + ClassYear + ordinal + ' year';
    } else {
      return '';
    }
  }

  @autobind
  renderLookingFor(buddy) {
    if (buddy.bio_looking_for_type_id) {
      return this.props.lookingForTypes.find(item => item.id === buddy.bio_looking_for_type_id).type;
    } else {
      return 'Nothing specific';
    }
  }

  @autobind
  renderOpinionButtons() {
    return (
      <View style={styles.opinionButtonContainer}>
        <TouchableOpacity onPress={this.onDislikePress}>
          <Image style={styles.opinionButtonImage} source={require('../../../assets/thumbDown.png')}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.nextBuddy}>
          <Image style={styles.skipButtonImage} source={require('../../../assets/skipButton.png')}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onLikePress}>
          <Image style={styles.opinionButtonImage} source={require('../../../assets/thumbUp.png')}/>
        </TouchableOpacity>
      </View>
    );
  }

  @autobind
  renderRegistrationPrompt() {
    return (
      <View style={styles.registerView}>
        <Text style={styles.registerTitle}>
          Hey there!
        </Text>
        <Text style={styles.registerText}>
          I see you haven't created a WhappuBuddy profile yet.
        </Text>
        <Text style={styles.registerText}>
          Once you register, you can vote on other people's profiles and get matched with other users!
        </Text>

        <View style={styles.registerButtonView}>
          <Button
            onPress={this.props.openBuddyIntroView}
            style={styles.registerButton}
            isDisabled={false}
          >
            Sounds neat, tell me more!
          </Button>
        </View>
      </View>
    );
  }

  render() {
    const { navigator } = this.props;

    return (
      <View style={{ flex: 1 }}>
      {false && <Header backgroundColor={theme.secondary} navigator={navigator} />}

      {/* Only render the WhappuBuddy profile if the user has registered on WhappuBuddy
          or they are viewing someone else's profile */}
      { (!this.props.isOwnBuddyProfileShown || this.props.usesWhappuBuddy) && this.renderBuddyProfile() }

      { /* Only show the opinion buttons if this is not the user's own profile */}
      { !this.isCurrentUser() && this.renderOpinionButtons() }

      { /* Render a prompt asking the user to register if they are trying to view their own,
           non-existent profile */ }
      { this.props.isOwnBuddyProfileShown && !this.props.usesWhappuBuddy && this.renderRegistrationPrompt() }

      { /* If the user has exhausted all their potential buddies, let them know the sad truth */ }
      { /* TODO */ }

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
    marginTop: 0,
    paddingBottom: 100
  },
  logButton: {
    flex: 1,
  },
  logButtonView: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: width/1.2,
    flexDirection: 'row',
    alignSelf: 'center'
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
  opinionButtonImage: {
    height: 70,
    width: 70,
    borderRadius: 0,
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 0,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 1,
    shadowOffset: {
      height: 2,
      width: 0
    },
    backgroundColor: theme.transparent
  },
  opinionButtonContainer: {
    flex:1,
    flexDirection:'row',
    marginTop:0,
    marginBottom:0,
    marginLeft:5,
    marginRight:5,
    height:70,
    justifyContent: 'space-between',
    alignItems:'flex-start',
    position:'absolute',
    bottom:20,
    left:0,
    right:0
  },
  registerButton: {
    flex: 1
  },
  registerButtonView: {
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
    width: width / 1.2,
    flexDirection: 'row',
    alignSelf: 'center'
  },
  registerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: theme.light,
    opacity: 0.9,
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  registerTitle: {
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
    color: theme.accentLight,
    opacity: 1,
    marginBottom: 40,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  registerView: {
    flex: 1,
    backgroundColor: theme.secondary,
    minHeight: height / 2,
    padding: 20
  },
  skipButtonImage: {
    height: 40,
    width: 40,
    borderRadius: 0,
    flex: 0,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 10,
    marginTop: (70 - 40) / 2
  },
  popContainer: {
    position: 'absolute',
    right: 7,
    top: 7,
    width: 50,
  },
  modalContainer: {
    backgroundColor: 'white',
    position: 'absolute',
    width: 150,
    top: 75,
    right: 0

  },
  modalLink: {
    paddingLeft: 10,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    color: theme.secondary
  },
});


const mapDispatchToProps = {
  acknowledgeDataUpdate,
  fetchBuddyProfile,
  fetchUserBuddies,
  fetchUserImages,
  fetchUserProfile,
  openBuddyIntroView,
  openBuddyRegistrationView,
  submitOpinion,
  updateCurrentBuddy
};

const mapStateToProps = state => ({
  buddies: getUserBuddies(state),
  currentBuddy: getBuddyUserProfile(state),
  image_url: getUserImageUrl(state),
  isDataUpdated: isDataUpdated(state),
  isOwnBuddyProfileShown: isOwnBuddyProfileShown(state),
  lookingForTypes: getLookingForTypes(state),
  tab: getCurrentTab(state),
  userId: getUserId(state),
  userName: getUserName(state),
  userTeam: getUserTeam(state),
  usesWhappuBuddy: usesWhappuBuddy(state)
});

export default connect(mapStateToProps, mapDispatchToProps)(BuddyUserView);
