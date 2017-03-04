'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  ListView,
  Text,
  RefreshControl,
  View,
  ScrollView,
  Platform
} from 'react-native';
import { connect } from 'react-redux';
import { ImagePickerManager } from 'NativeModules';
import autobind from 'autobind-decorator';

import theme from '../../style/theme';
import { fetchFeed,
  refreshFeed,
  loadMoreItems,
  removeFeedItem,
  voteFeedItem,
  openLightBox
} from '../../actions/feed';

import { getUserTeam } from '../../reducers/registration';

import FeedListItem from './FeedListItem';
import Notification from '../common/Notification';
import Loading from './Loading';
import ActionButtons from './ActionButtons';
import TextActionView from '../../components/actions/TextActionView';
import LoadingStates from '../../constants/LoadingStates';

import ImageCaptureOptions from '../../constants/ImageCaptureOptions';
import {
  updateCooldowns,
  postImage,
  postAction,
  openTextActionView
} from '../../actions/competition';
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';

const IOS = Platform.OS === 'ios';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  listView: {
    flex: 1
  },
  actionButtons: {
    position: 'absolute',
    bottom: IOS ? 30 : 0,
    right: 0
  },

});

class FeedList extends Component {
  // mixins: [TimerMixin]

  constructor(props) {
    super(props);

    this.state = {
      showScrollTopButton: false,
      dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 })
    };
  }

  componentDidMount() {
    this.props.fetchFeed();

    this.props.updateCooldowns();
  }

  // componentWillUnmount() {
  //   //this.clearInterval(this.updateCooldownInterval);
  // }

  componentWillReceiveProps({ feed }) {
    if (feed !== this.props.feed) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(feed.toJS())
      });
    }
    // Scroll to top when user does an action
    if (this.props.isSending){
      this.scrollTop();
    }
  }

  @autobind
  scrollTop() {
    if (this.refs._scrollView){
     this.refs._scrollView.scrollTo({x: 0, y: 0, animated: true});
    }
  }

  @autobind
  _onScroll(event) {
    const SHOW_SCROLLTOP_LIMIT = 600;
    const scrollTop = event.nativeEvent.contentOffset.y;

    const showScrollTopButton = scrollTop > SHOW_SCROLLTOP_LIMIT;

    if (this.state.showScrollTopButton !== showScrollTopButton) {
      this.setState({
        showScrollTopButton: showScrollTopButton
      })
    }
  }

  @autobind
  onRefreshFeed() {
    this.props.refreshFeed();
  }

  @autobind
  onLoadMoreItems() {
    if (this.props.isRefreshing || !this.props.feed.size || this.props.feed.size < 10) {
      return;
    }

    const lastItemID = this.props.feed.get(this.props.feed.size - 1).get('id') || '';
    if (lastItemID) {
      this.props.loadMoreItems(lastItemID);
    }
  }

  @autobind
  chooseImage() {
    ImagePickerManager.showImagePicker(ImageCaptureOptions, (response) => {
      if (!response.didCancel && !response.error) {
        const image = 'data:image/jpeg;base64,' + response.data;
        this.props.postImage(image);
      }
    });
  }

  @autobind
  onPressAction(type) {

    switch (type) {
      case 'IMAGE':
        return this.chooseImage();
      case 'TEXT':
        return this.props.openTextActionView();
      default:
        return this.props.postAction(type);
    }
  }

  @autobind
  renderFeed(feedListState, isLoadingActionTypes, isLoadingUserData) {
    const refreshControl = <RefreshControl
      refreshing={this.props.isRefreshing || this.props.isSending}
      onRefresh={this.onRefreshFeed}
      colors={[theme.primary]}
      tintColor={theme.primary}
      progressBackgroundColor={theme.light} />;

    const isLoading = isLoadingActionTypes || isLoadingUserData;

    switch (feedListState) {
      case LoadingStates.LOADING:
        return <Loading />;
      case LoadingStates.FAILED:
        return (
          <ScrollView style={{ flex: 1 }} refreshControl={refreshControl}>
            <Text style={{ marginTop: 20 }}>Could not get feed :(</Text>
          </ScrollView>
        );
      default:
        return (
          <View style={styles.container}>

            <ListView
              ref='_scrollView'
              dataSource={this.state.dataSource}
              renderRow={item => <FeedListItem
                item={item}
                userTeam={this.props.userTeam}
                removeFeedItem={this.props.removeFeedItem}
                voteFeedItem={this.props.voteFeedItem}
                openLightBox={this.props.openLightBox} />
              }
              style={[styles.listView]}
              onScroll={this._onScroll}
              onEndReached={this.onLoadMoreItems}
              refreshControl={refreshControl} />

            <ActionButtons
              isRegistrationInfoValid={this.props.isRegistrationInfoValid}
              style={styles.actionButtons}
              isLoading={isLoading}
              onPressAction={this.onPressAction}
              onScrollTop={this.scrollTop}
              showScrollTopButton={this.state.showScrollTopButton}
              />
          </View>
        );
    }
  }

  render() {

    return (
      <View style={styles.container}>
        {this.renderFeed(
          this.props.feedListState,
          this.props.isLoadingActionTypes,
          this.props.isLoadingUserData
        )}
        <Notification visible={this.props.isNotificationVisible}>
          {this.props.notificationText}
        </Notification>
      </View>
    );
  }
}

const mapDispatchToProps = {
  fetchFeed,
  refreshFeed,
  loadMoreItems,
  updateCooldowns,
  postImage,
  postAction,
  openTextActionView,
  removeFeedItem,
  voteFeedItem,
  openLightBox
};

const select = store => {
  const isRegistrationInfoValid = store.registration.get('name') !== '' &&
    store.registration.get('selectedTeam') > 0;

  return {
    feed: store.feed.get('list'),
    feedListState: store.feed.get('listState'),
    isRefreshing: store.feed.get('isRefreshing'),
    isLoadingActionTypes: store.competition.get('isLoadingActionTypes'),
    actionTypes: store.competition.get('actionTypes'),
    isNotificationVisible: store.competition.get('isNotificationVisible'),
    notificationText: store.competition.get('notificationText'),
    isSending: store.competition.get('isSending'),
    userTeam: getUserTeam(store),

    isRegistrationInfoValid,
    isLoadingUserData: store.registration.get('isLoading'),
  };
};

reactMixin(FeedList.prototype, TimerMixin);
export default connect(select, mapDispatchToProps)(FeedList);
