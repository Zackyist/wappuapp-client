'use strict';

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  Image,
  Platform,
  Text,
  Alert
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
  getBuddyBio,
  getBuddyClassYear,
  getBuddyLookingFor,
  fetchBuddyProfile,
  updateCurrentBuddy,
  getBuddyUserProfile
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

//|| this.props.buddies.insert(0, this.props.fetchBuddyProfile(this.props.route.id))
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

    if (user && user.id) {
      this.props.fetchBuddyProfile(user.id);
      this.props.fetchUserBuddies(user.id);
    } else {
      //this.props.fetchBuddyProfile(userId);
      this.props.fetchUserBuddies(userId);
      this.props.updateCurrentBuddy(this.props.buddies.get(0));
    }

  }

  componentWillReceiveProps({ tab, userId }) {
    // Fetch images and data on Buddy tab if this is the user's own profile
    if (tab !== this.props.tab && tab === 'BUDDY') {
      this.props.fetchUserBuddies(userId);
      this.props.updateCurrentBuddy(this.props.buddies.get(0));
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

  // Checks whether this is the user's own profile or not
  isCurrentUser() {
    let user = this.props.currentBuddy;
    const { userId } = this.props.userId;

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
    this.closePopModal();
    this.props.openBuddyRegistrationView();
  }

  onDeleteProfile = () => {
    this.closePopModal();
    this.props.navigator.push({
      component: DeleteProfileView
    });
  }

  onReportUser = () => {
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
  }

  @autobind
  onDislikePress(){
    const Subpackage  = {
      matchedUserId: this.props.currentBuddy.id,
      opinion: 'DOWN'
    };

    this.props.submitOpinion(Subpackage);
    this.props.buddies.delete(this.state.buddyIndex);
    this.nextBuddy()
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

  openPopModal = () => {
    this.setState({popModalVisible:true});
  }

  togglePopModal = () => {
    if (this.state.modalVisible){
      this.closePopModal();
    }
    else {
      this.openPopModal();
    }
  }

  closePopModal = () => {
    this.setState({popModalVisible:false});
  }

  render() {

    const { navigator } = this.props;
    let buddy = this.props.currentBuddy;

    let headerImage = require('../../../assets/frontpage_header-bg.jpg');

    // Show the user's profile picture as the header image if it's set
    if (buddy.image_url) {
      headerImage = { uri: buddy.image_url};
    }

    return (
      <View style={{ flex: 1 }}>
      {false && <Header backgroundColor={theme.secondary} navigator={navigator} />}
      <ParallaxView
        backgroundSource={headerImage}
        windowHeight={height / 1.8}
        style={{ backgroundColor:theme.white }}
        header={(
          <View style={styles.header}>
            {!isIOS && !this.isCurrentUser() &&
            <View style={styles.backLink}>
              <TouchableHighlight onPress={() => navigator.pop()} style={styles.backLinkText} underlayColor={'rgba(255, 255, 255, .1)'}>
                <Icon name="arrow-back" size={28} style={styles.backLinkIcon}  />
              </TouchableHighlight>
            </View>
            }

            {this.isCurrentUser() && !isIOS &&
              <View style={styles.menu}>
                <PopupMenu actions={['Edit my profile', 'Delete my profile']} onPress={this.onMyPopupEvent} />
              </View>
            }

            {user.name === userName && isIOS && <View style={styles.popContainer}>
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

            {!this.isCurrentUser() && !isIOS &&
              <View style={styles.menu}>
                <PopupMenu actions={['Report user']} onPress={this.onPopupEvent} />
              </View>
            }

            {!this.isCurrentUser() && isIOS && <View style={styles.popContainer}>
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


            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>
              {this.props.buddies.size > 0 &&
                buddy.name || "A man/woman has no name"
              }
              </Text>
              <Text style={styles.headerSubTitle}>
              {this.props.buddies.size > 0 &&
                buddy.team || "The Guild"
              }
              {this.props.buddies.size > 0 &&
                this.renderClassYear(buddy.class_year) || "69 BC"
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
            buddy.bio_text || "No bio for lamo"
          }
          </Text>

          <Text style={styles.lookingForTitle}>Looking For</Text>
          <Text style={styles.lookingForText}>
            {this.renderLookingFor(buddy)}
          </Text>

        </View>

        { /* Only show the opinion buttons as well as the Whappu Log connection button if this is not
        the user's own profile */}
        {!this.isCurrentUser() &&
        <View style={styles.thumbs}>
          <View style={{flex: 1, flexDirection: 'row'}}>
          <TouchableOpacity onPress={this.onLikePress}>
            <Image style={{width: 100, height: 100, marginHorizontal: 25}} source={require('../../../assets/thumbUp.png')}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onDislikePress}>
            <Image style={{width: 100, height: 100, marginHorizontal: 25}} source={require('../../../assets/thumbDown.png')}/>
          </TouchableOpacity>
          </View>
        </View>
        }

        {!this.isCurrentUser() &&
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

        {!this.isCurrentUser() &&
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
  thumbContainer: {
    flex: 1,
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'center'
  },

  thumbTouchable: {
    // placeholder
  },

  thumbImage: {
    width: 75,
    height: 75,
    marginLeft: 10,
    marginRight: 10
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
  fetchUserImages,
  fetchUserProfile,
  fetchBuddyProfile,
  updateCurrentBuddy,
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
  buddies: getUserBuddies(state),
  currentBuddy: getBuddyUserProfile(state)
});

export default connect(mapStateToProps, mapDispatchToProps)(BuddyUserView);
