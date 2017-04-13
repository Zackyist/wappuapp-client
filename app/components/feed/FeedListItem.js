'use strict';

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
import React, { Component } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  Platform,
  PropTypes,
  TouchableOpacity,
  TouchableHighlight,
  View
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import { connect } from 'react-redux';
import abuse from '../../services/abuse';
import time from '../../utils/time';
import theme from '../../style/theme';
import { openRegistrationView } from '../../actions/registration';

const { width } = Dimensions.get('window');
const FEED_ITEM_MARGIN_DISTANCE = 0;
const FEED_ITEM_MARGIN_DEFAULT = 0;
const FEED_ADMIN_ITEM_MARGIN_DEFAULT = 15;
const IOS = Platform.OS === 'ios';

const styles = StyleSheet.create({
  itemWrapper: {
    width,
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingBottom: 10,
    paddingTop: 0,
  },
  itemTouchable: {
    elevation: 1,
    flexGrow: 1,
  },
  itemContent:{
    flexGrow: 1,
    marginLeft: FEED_ITEM_MARGIN_DEFAULT,
    marginRight: FEED_ITEM_MARGIN_DISTANCE,
    borderRadius: 0,
    // overflow: 'hidden',
    borderBottomWidth: IOS ? 0 : 1,
    borderBottomColor: 'rgba(0, 0, 0, .075)',
    // // # Drop shadows
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.075,
    shadowRadius: 1,
    shadowOffset: {
      height: 2,
      width: 0
    },
    backgroundColor: '#fff'
  },
  itemContent_selected: {
    backgroundColor: theme.stable
  },
  itemContent_byMyTeam: {
    marginRight: FEED_ITEM_MARGIN_DEFAULT,
    marginLeft: FEED_ITEM_MARGIN_DISTANCE,
    // backgroundColor: '#edfcfb',
  },

  itemContent_image: {
    marginLeft: FEED_ITEM_MARGIN_DEFAULT,
    marginRight: FEED_ITEM_MARGIN_DEFAULT,
    borderRadius: 0,
  },
  itemImageWrapper: {
    width: width - (2 * FEED_ITEM_MARGIN_DEFAULT),
    height: width - (2 * FEED_ITEM_MARGIN_DEFAULT),
    // borderBottomLeftRadius: 20,
    // borderBottomRightRadius: 20,
    overflow: 'hidden'
  },
  itemTextWrapper: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 16,
    paddingBottom: 12,
    top: -10,
  },
  itemVoteWrapper: {
    flexDirection: 'row',
    paddingVertical: 5,
    width: 100,
  },

  itemVoteButtonWrap: {
    flex: 1,
    width: 28,
    height: 28,
    top: 2,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemVoteButton: {
    flex: 1,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemVoteValue: {
    minWidth: 15,
    textAlign: 'center',
    fontSize: 15,
    paddingVertical: 5,
    color: theme.grey
  },
  feedItemListText: {
    textAlign: 'center',
    fontSize: 17,
    lineHeight: 25,
    color: theme.dark
  },
  feedItemListItemImg: {
    width: width - (2 * FEED_ITEM_MARGIN_DEFAULT),
    height: width - (2 * FEED_ITEM_MARGIN_DEFAULT),
    backgroundColor: 'transparent',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,

  },
  feedItemListItemImg__admin: {
    width: width - (2 * FEED_ADMIN_ITEM_MARGIN_DEFAULT),
    borderRadius: 5,
  },
  feedItemListItemInfo: {
    flex: 1,
    flexDirection: 'row',
    padding: 13,
    paddingTop: 13,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  feedItemListItemAuthor:{
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  itemAuthorName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: theme.secondary,
    paddingRight: 10
  },
  itemAuthorTeam:{
    fontSize:11,
    color: '#aaa'
  },
  itemAuthorTeam__my: {
    color: theme.primary,
    fontWeight: 'bold'
  },
  feedItemListItemAuthorIcon:{
    color: '#bbb',
    fontSize: 15,
    marginTop: 1,
    paddingRight: 10
  },
  listItemRemoveButton:{
    backgroundColor: 'transparent',
    color: 'rgba(150,150,150,.65)',
    fontSize: IOS ? 22 : 20,
  },
  listItemRemoveContainer: {
    position: 'absolute',
    right: 8,
    bottom: 10,
    borderRadius: 15,
    width: 30,
    height: 30,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemTimestamp: {
    top:  IOS ? 1 : 2,
    color: '#aaa',
    fontSize: 11,
  },
  itemContent__admin:{
    marginLeft: 15,
    marginRight: 15,
    paddingTop: 0,
    paddingBottom: 0,
    borderRadius: 2,
    backgroundColor: '#faf5ee'
  },
  itemTextWrapper__admin: {
    paddingTop: 0,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15
  },
  feedItemListItemInfo__admin: {
    paddingLeft: 0,
    paddingBottom: 14,
  },
  feedItemListItemAuthor__admin:  {
    paddingLeft: 15,
  },
  itemTimestamp__admin:{
    color: '#b5afa6'
  },
  feedItemListText__admin: {
    textAlign: 'left',
    color: '#7d776e',
    fontWeight: 'bold',
    fontSize: 12,
    lineHeight: 19,
  }
});

class FeedListItem extends Component {
  propTypes: {
    item: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      myVote: 0,
      selected: false
    };
  }

  itemIsCreatedByMe(item) {
    return item.author.type === 'ME';
  }


  itemIsCreatedByMyTeam(item) {
    const { userTeam } = this.props;
    if (userTeam) {
      return item.author.team === userTeam.get('name');
    }
    return false;
  }

  selectItem() {
    this.setState({ selected: true });
    this.showRemoveDialog(this.props.item);
  }

  deSelectItem() {
    this.setState({ selected: false });
  }

  showRemoveDialog(item) {
    if (this.itemIsCreatedByMe(item)) {
      Alert.alert(
        'Remove Content',
        'Do you want to remove this item?',
        [
          { text: 'Cancel',
            onPress: () => this.deSelectItem(), style: 'cancel' },
          { text: 'Yes, remove item',
            onPress: () => { this.deSelectItem(); this.removeThisItem() }, style: 'destructive' }
        ]
      );
    } else {
      Alert.alert(
        'Flag Content',
        'Do you want to report this item?',
        [
          { text: 'Cancel',
            onPress: () => this.deSelectItem() , style: 'cancel' },
          { text: 'Yes, report item',
            onPress: () => { this.deSelectItem(); abuse.reportFeedItem(item) }, style: 'destructive' }
        ]
      );
    }
  }

  removeThisItem() {
    this.props.removeFeedItem(this.props.item);
  }

  voteThisItem(vote) {

    const { userVote, id } = this.props.item;

    if (this.props.isRegistrationInfoValid === false) {
      this.props.openRegistrationView();
    } else {
      const wasAlreadyVotedByMe = userVote !== 0;
      const voteWasChanged = userVote !== vote;
      const multiplier = wasAlreadyVotedByMe ? 2 : 1;
      const difference = voteWasChanged ? vote * multiplier : 0;

      this.props.voteFeedItem(id, vote, difference);
      this.setState({
        myVote: vote
      })
    }
  }

  getVotes() {
    // If the user has just given a vote, it is added to the total amount to votes displayed on the screen.
    const { difference, votes } = this.props.item;
    const newVote = difference ? difference : 0;
    return parseInt(votes) + newVote;
  }

  // Render "remove" button, which is remove OR flag button,
  // depending is the user the creator of this feed item or not
  renderRemoveButton(item) {
    if (item.author.type === 'SYSTEM') {

      return <View></View>; // currently it is not possible to return null in RN as a view
    }

    const iconName = this.itemIsCreatedByMe(item) ? 'delete' : 'flag';
    return (
      <TouchableOpacity
       style={[styles.listItemRemoveContainer,
         {backgroundColor:item.type !== 'IMAGE' ? 'transparent' : 'rgba(255,255,255,.1)'}]}
       onPress={() => this.showRemoveDialog(item)}>

        <Icon name={iconName} style={[styles.listItemRemoveButton,
          {opacity:item.type !== 'IMAGE' ? 0.7 : 1}]
        }/>

      </TouchableOpacity>
    );
  }

  renderVoteButton(positive) {
    const { myVote } = this.state;
    const { userVote } = this.props.item;

    const value = positive ? 1 : -1;
    const iconName = positive ? 'keyboard-arrow-up' : 'keyboard-arrow-down';

    const voteWasChanged = myVote !== 0;
    const disabled = voteWasChanged ? myVote === value : userVote === value;

    return (
      <View style={styles.itemVoteButtonWrap}>
      <TouchableHighlight
        disabled={disabled}
        activeOpacity={1}
        style={styles.itemVoteButton}
        underlayColor={theme.stable}
        onPress={() => this.voteThisItem(value)}>
          <View style={styles.itemVoteButton}>
            <Text style={{color: disabled ? theme.secondary : theme.grey}}>
              <Icon name={iconName} size={25}/>
            </Text>
          </View>
      </TouchableHighlight>
      </View>
    );
  }

  renderVotingPanel() {
    return (
      <View style={styles.itemVoteWrapper}>
        {this.renderVoteButton(true)}
        <Text style={styles.itemVoteValue}>{this.getVotes()}</Text>
        {this.renderVoteButton()}
      </View>);
  }

  renderAdminItem(item, ago) {

    return (
      <View style={styles.itemWrapper}>
        <View style={[styles.itemContent, styles.itemContent__admin]}>

          <View style={[styles.feedItemListItemInfo, styles.feedItemListItemInfo__admin]}>
            <View style={[styles.feedItemListItemAuthor, styles.feedItemListItemAuthor__admin]}>
              <Text style={styles.itemAuthorName}>Whappu</Text>
            </View>
            <Text style={[styles.itemTimestamp, styles.itemTimestamp__admin]}>{ago}</Text>
          </View>

          {item.type === 'IMAGE' ?
            <View style={styles.itemImageWrapper}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => this.props.openLightBox(item)}
              >
                <Image
                  source={{ uri: item.url }}
                  style={[styles.feedItemListItemImg, styles.feedItemListItemImg__admin]} />
              </TouchableOpacity>
            </View>
          :
            <View style={[styles.itemTextWrapper, styles.itemTextWrapper__admin]}>
              <Text style={[styles.feedItemListText, styles.feedItemListText__admin]}>
                {item.text}
              </Text>
            </View>
          }
        </View>
      </View>
    );
  }

  render() {
    const { item, openUserPhotos } = this.props;
    const { selected } = this.state;
    const ago = time.getTimeAgo(item.createdAt);

    if (item.author.type === 'SYSTEM') {
      return this.renderAdminItem(item, ago);
    }

    const itemByMyTeam = this.itemIsCreatedByMyTeam(item);
    const isItemImage = item.type === 'IMAGE';

    return (
      <View style={styles.itemWrapper}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.itemTouchable}
          onLongPress={() => this.selectItem() }
        >
        <View style={[styles.itemContent,
          itemByMyTeam ? styles.itemContent_byMyTeam : {},
          isItemImage ? styles.itemContent_image : {},
          selected ? styles.itemContent_selected : {}
        ]}>

          <TouchableOpacity activeOpacity={0.7} style={styles.feedItemListItemInfo} onPress={() => openUserPhotos(item.author)}>
            <View style={styles.feedItemListItemAuthor}>
              <Text style={styles.itemAuthorName}>{item.author.name}</Text>
              <Text style={[styles.itemAuthorTeam, itemByMyTeam ? styles.itemAuthorTeam__my : {}]}>{item.author.team}</Text>
            </View>
            <Text style={styles.itemTimestamp}>{ago}</Text>
          </TouchableOpacity>

          {isItemImage ?
            <View style={styles.itemImageWrapper}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => this.props.openLightBox(item)}
              >
                <Image
                  source={{ uri: item.url }}
                  style={styles.feedItemListItemImg} />
              </TouchableOpacity>
            </View>
          :
            <View style={styles.itemTextWrapper}>
              <Text style={styles.feedItemListText}>{item.text}</Text>
            </View>
          }
          {this.renderVotingPanel()}

          {/* this.renderRemoveButton(item) */}

        </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const select = store => {
  return {
    actionTypes: store.competition.get('actionTypes'),
  };
};
const mapDispatchToProps = { openRegistrationView };

export default connect(select, mapDispatchToProps)(FeedListItem);
