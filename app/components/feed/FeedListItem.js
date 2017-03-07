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
  View
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import { connect } from 'react-redux';
import abuse from '../../services/abuse';
import time from '../../utils/time';
import theme from '../../style/theme';
import { openRegistrationView } from '../../actions/registration';
const { height, width } = Dimensions.get('window');
const FEED_ITEM_MARGIN_DISTANCE = 50;
const FEED_ITEM_MARGIN_DEFAULT = 15;

const styles = StyleSheet.create({
  itemWrapper: {
    width,
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: 0,
    paddingTop: 10,
  },
  itemContent:{
    flex: 1,
    marginLeft: FEED_ITEM_MARGIN_DEFAULT,
    marginRight: FEED_ITEM_MARGIN_DISTANCE,
    borderRadius: 20,
    overflow: 'hidden',
    // // # Drop shadows
    // elevation: 2,
    // shadowColor: '#000000',
    // shadowOpacity: 0.15,
    // shadowRadius: 1,
    // shadowOffset: {
    //   height: 2,
    //   width: 0
    // },
    backgroundColor: '#f5f5f5'
  },
  itemContent_byMyTeam: {
    marginRight: FEED_ITEM_MARGIN_DEFAULT,
    marginLeft: FEED_ITEM_MARGIN_DISTANCE,
    backgroundColor: '#edfcfb',
  },
  itemContent_image: {
    marginLeft: FEED_ITEM_MARGIN_DEFAULT,
    marginRight: FEED_ITEM_MARGIN_DEFAULT,
    borderRadius: 20,
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
    paddingTop: 15,
    paddingBottom: 20,
    top: -10,
  },
  itemVoteWrapper: {
    flexDirection: 'row',
    paddingVertical: 5
  },
  itemVoteButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemVoteValue: {
    fontSize: 15,
    paddingVertical: 5,
    color: theme.secondary
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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,

  },
  feedItemListItemImg__admin: {
    width: width - (2 * FEED_ITEM_MARGIN_DEFAULT),
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
  feedItemListItemAuthorIcon:{
    color: '#bbb',
    fontSize: 15,
    marginTop: 1,
    paddingRight: 10
  },
  listItemRemoveButton:{
    backgroundColor: 'transparent',
    color: 'rgba(150,150,150,.65)',
    fontSize: Platform.OS === 'ios' ? 22 : 20,
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
    top:  Platform.OS === 'ios' ? 1 : 2,
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
    paddingLeft: 25,
    paddingRight: 15
  },
  feedItemListItemInfo__admin: {
    paddingLeft: 0,
    paddingBottom: 18,
  },
  feedItemListItemAuthor__admin:  {
    paddingLeft: 25,
  },
  itemTimestamp__admin:{
    color: '#b5afa6'
  },
  feedItemListText__admin: {
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
      wasVoted: false,
      myVote: 0
    };
  }

  itemIsCreatedByMe(item) {
    return item.author.type === 'ME';
  }

  itemIsVotedByMe() {
    return false;
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

  voteThisItem(value) {

    if (this.props.isRegistrationInfoValid === false) {
      this.props.openRegistrationView();
    } else {
      this.props.voteFeedItem(this.props.item, parseInt(value));
      this.setState({
        myVote: value
      })
    }
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
    const value = positive ? 1 : -1;
    const iconName = positive ? 'keyboard-arrow-up' : 'keyboard-arrow-down';
    const disabled = this.state.myVote === value;

    return (
      <TouchableOpacity
        style={styles.itemVoteButton}
        disabled={disabled}
        activeOpacity={0}
        onPress={() => this.voteThisItem(value)}>
        <Text style={{color: disabled ? 'gray' : theme.secondary}}>
          <Icon name={iconName} size={30}/>
        </Text>
      </TouchableOpacity>
    );
  }

  renderVotingPanel() {
    return (
      <View style={styles.itemVoteWrapper}>
        {this.renderVoteButton(true)}
        <Text style={styles.itemVoteValue}>{this.props.item.votes}</Text>
        {this.renderVoteButton()}
      </View>);
  }

  renderAdminItem(item, ago) {

    return null; // <--- TODO HOX REMOVE THIS BEFORE LAUNCH

    return (
      <View style={styles.itemWrapper}>
        <View style={[styles.itemContent, styles.itemContent__admin]}>

          <View style={[styles.feedItemListItemInfo, styles.feedItemListItemInfo__admin]}>
            <View style={[styles.feedItemListItemAuthor, styles.feedItemListItemAuthor__admin]}>
              <Text style={styles.itemAuthorName}>Whappu</Text>
              <Text style={[styles.itemTimestamp, styles.itemTimestamp__admin]}>{ago}</Text>
            </View>
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
    const { item } = this.props;
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
          style={{ flex: 1 }}
          onLongPress={() => this.selectItem() }
        >
        <View style={[styles.itemContent,
          itemByMyTeam ? styles.itemContent_byMyTeam : {},
          isItemImage ? styles.itemContent_image : {}
        ]}>

          <View style={styles.feedItemListItemInfo}>
            {/*<Icon name='face' style={styles.feedItemListItemAuthorIcon} />*/}
            <View style={styles.feedItemListItemAuthor}>
              <Text style={styles.itemAuthorName}>{item.author.name}</Text>
              <Text style={styles.itemAuthorTeam}>{item.author.team}</Text>
            </View>
            <Text style={styles.itemTimestamp}>{ago}</Text>
          </View>

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
