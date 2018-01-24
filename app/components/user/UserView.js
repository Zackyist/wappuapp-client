'use strict';

import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity,
  TouchableHighlight, Image, Platform, Text, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';

import {
  getUserImages,
  getUserTeam,
  getTotalSimas,
  getTotalVotesForUser,
  getUserImageUrl,
  fetchUserImages,
  fetchUserProfile,
  isLoadingUserImages,
  hasRegisteredOnWhappuBuddy
} from '../../concepts/user';
import { getUserName, getUserId, isDataUpdated } from '../../reducers/registration';
import { getCurrentTab } from '../../reducers/navigation';
import { openLightBox } from '../../actions/feed';

import ParallaxView from 'react-native-parallax-view';
import Icon from 'react-native-vector-icons/MaterialIcons';
import UserAvatar from 'react-native-user-avatar';
import Modal from 'react-native-modal';
import PhotoView from 'react-native-photo-view';
import Toolbar from './UserViewProfileToolbar';

import theme from '../../style/theme';
import Header from '../common/Header';
import Loader from '../common/Loader';

import AppInfo from './AppInfo';
import LegalStuff from './LegalStuff';
import PopupMenu from './PopupMenu';

import { openRegistrationView, acknowledgeDataUpdate } from '../../actions/registration';
import { getCurrentCityName } from '../../concepts/city';
import WebViewer from '../webview/WebViewer';
import BuddyUserView from '../whappubuddy/BuddyUserView';
import DeleteProfileView from '../whappubuddy/DeleteProfileView';

import Button from '../../components/common/Button';

const headerImage = require('../../../assets/frontpage_header-bg.jpg');

const { height, width } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';

class UserView extends Component {

  constructor(props) {
    super(props)

    this.closeModal = this.closeModal.bind(this)

    this.state = {
      modalVisible: false
    };
  }

  componentDidMount() {
    const { user } = this.props.route;
    const { userId } = this.props;
    // Fetch images and data upon mounting if this is not the user's own profile
    if (user && user.id) {
      this.props.fetchUserProfile(user.id);
      this.props.fetchUserImages(user.id);
    }
  }

  componentWillReceiveProps({ tab, userId }) {
    // Fetch images and data on Settings tab if this is the user's own profile
    if (tab !== this.props.tab && tab === 'SETTINGS') {
      this.props.fetchUserImages(userId);
      this.props.fetchUserProfile(userId);
    }
  }

  componentDidUpdate() {
    // Ensure that the user data is updated right after editing the profile
    if (this.props.isDataUpdated) {
      const { userId } = this.props;
      this.props.acknowledgeDataUpdate();
      this.props.fetchUserProfile(userId);
    }
  }

  // This method is used to navigate from the user's Whappu Log to their WhappuBuddy profile
  @autobind
  showBuddyProfile() {
    let { user } = this.props.route;

    return () => {
      this.props.navigator.push({
        component: BuddyUserView,
        name: `${user.name}`,
        user
      });
    };
  }

  deleteBuddyProfile = () => {
    let { user } = this.props.route;
    const { userName } = this.props;

    // Show Current user if not user selected
    if (!user) {
      user = { name: userName };
    }

    return () => {
      this.props.navigator.push({
        component: DeleteProfileView,
        name: `${user.name}`,
        user
      });
    };
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

  // Close the user image modal
  closeModal() {
    this.setState({modalVisible: false})
}

  render() {

    const { images, isLoading, totalVotes, totalSimas,
      userTeam, userName, navigator, cityName, image_url } = this.props;
    let { user } = this.props.route;

    // Show Current user if not user selected
    if (!user) {
      user = { name: userName,
               team: userTeam,
               imageUrl: image_url };
    }

    const imagesCount = images.size;

    return (
      <View style={{ flex: 1 }}>

        <View>
          <Modal
            isVisible={this.state.modalVisible}
            backdropOpacity={1.0}
            backdropColor={theme.black}
            onBackButtonPress={() => this.setState({modalVisible: false})}
            onBackdropPress={() => this.setState({modalVisible: false})}
            style={{margin: 0}}
          >
            <View style={{width: width, flex: 1, margin: 0}}>
                <Toolbar title={user.name} closeModal={this.closeModal} navigator={this.props.navigator} />
            </View>
            <View style={{ width: width, height: height}}>
              <PhotoView
                source={{uri: image_url}}
                minimumZoomScale={1}
                maximumZoomScale={4}
                style={styles.imageModal}
              />
            </View>
          </Modal>
        </View>

      {false && <Header backgroundColor={theme.secondary} title={user.name} navigator={navigator} />}
      <ParallaxView
        backgroundSource={headerImage}
        windowHeight={330}
        style={{ backgroundColor:theme.white }}
        header={(
          <View style={styles.header}>
            {!isIOS  && !isLoading && user.name !== userName &&
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

            {/* Load user's profile picture or avatar with initials */}
            {!isLoading ? (
              <View>
                { image_url ? (
                <View>
                  <View style={styles.containerAvatar}>
                    <TouchableOpacity style={styles.buttonAvatar} onPress={() => this.setState({modalVisible: true})}>
                      <Image source={{ uri: image_url || user.imageUrl }} style={styles.clickableAvatar} />
                    </TouchableOpacity>
                  </View>
                </View>
                ) : (
                <View>
                  <View style={styles.containerAvatar}>
                    <UserAvatar
                    name={user.name || userName }
                    src={image_url || user.imageUrl}
                    size={100}
                    />
                  </View>
                </View>
                )}
              </View>
            ) : (
              <View>
                <ActivityIndicator size={'large'} />
              </View>
            )}

            {/* Load username and name of the user's team */}
            {!isLoading ? (
              <View>
                <Text style={styles.headerTitle}>{user.name}</Text>
                <Text style={styles.headerSubTitle}>{userTeam || user.team}</Text>
              </View>
            ) : (
              <View>
              </View>
            )}

            {/* Load user's image, vote and sima statistics */}
            {!isLoading ? (
              <View style={styles.headerKpis}>
                <View style={styles.headerKpi}>
                  <Text style={styles.headerKpiValue}>{!isLoading ? (imagesCount || '-') : '-'}</Text>
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
            ) : (
              <View>

              </View>
            )}

            {/* Ugly but this hack is needed to render the WhappuBuddy connection button in a correct manner.
                Also only renders the button if the user is viewing someone else's UserView than their own
                and that someone else has registered on WhappuBuddy. */}
            {(!isLoading && user.id && this.props.isOnWhappuBuddy) ? (
              <View style={styles.headerKpis}>
                <View style={styles.buddyButtonView}>
                  <Button
                    onPress={this.showBuddyProfile()}
                    style={styles.buddyButton}
                    isDisabled={false}
                  >
                    Find me on WhappuBuddy
                  </Button>
                </View>
              </View>
            ) : (
              <View>
              </View>
            )}
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

<<<<<<< HEAD
=======
        <Button style={{marginBottom:100}} onPress={this.deleteBuddyProfile()}>
        Delete my profile
        </Button>
>>>>>>> Profile deletion view and mock button to navigate to it
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
  modalHeader: {
    height: 56,
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    top:0,
    right: 0,
    zIndex: 2,
  },
  modalHeaderIcon: {
    position: 'absolute',
    left: 15,
    right: 15,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
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
  buddyButton: {
    flex: 1,
    height: 35,
  },
  buddyButtonView: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: width - width/3,
    height: 40,
    flexDirection: 'row',
  },
  headerTitle:{
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: theme.light,
    marginBottom: 0,
    padding: 0
  },
  headerSubTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'rgba(0,0,0,.6)',
    opacity: 0.9,
  },
  buttonAvatar: {
    borderRadius: 100
  },
  clickableAvatar: {
    height: 100,
    width: 100,
    borderRadius: 50,
    padding: 0,
    margin: 0,
  },
  containerAvatar: {
    alignItems: 'center'
  },
  thumbs: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    backgroundColor: theme.transparent,
    color: theme.secondary,
    fontSize: 60,
  },
  headerKpis: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerKpi: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 20,
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
  imageModal: {
    flex: 1,
    width,
    height: width,
    justifyContent: 'center',
    alignItems: 'center'
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
  userProfilePicture: {
    width: 100,
    height: 100,
    borderRadius: 100
  }
});


const mapDispatchToProps = {
  acknowledgeDataUpdate,
  fetchUserImages,
  fetchUserProfile,
  openLightBox,
  openRegistrationView
};

const mapStateToProps = state => ({
  images: getUserImages(state),
  isLoading: isLoadingUserImages(state),
  totalSimas: getTotalSimas(state),
  totalVotes: getTotalVotesForUser(state),
  userId: getUserId(state),
  userName: getUserName(state),
  userTeam: getUserTeam(state),
  cityName: getCurrentCityName(state),
  tab: getCurrentTab(state),
  image_url: getUserImageUrl(state),
  isOnWhappuBuddy: hasRegisteredOnWhappuBuddy(state),
  isDataUpdated: isDataUpdated(state)
});

export default connect(mapStateToProps, mapDispatchToProps)(UserView);
