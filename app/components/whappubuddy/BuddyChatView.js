'user strict';

import React, { Component } from 'react';
import { View, Text, ActivityIndicator, Modal, Dimensions } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';

import theme from '../../style/theme';
import Button from '../../components/common/Button';
import { fetchChat, sendMessage, openChatView, closeChatView } from '../../actions/chat';
import {
  getMyId,
  getBuddyId,
  getBuddyName,
  getBuddyImg,
  getChatId,
  getDatabase,
  isFetchReady,
  getMessages,
  isChatViewOpen,
  isFetching,
  getFetchError,
  getErrorMsg
} from '../../reducers/chat';
import { getBuddyUser } from '../../actions/registration';

const { height, width } = Dimensions.get('window');

class BuddyChatView extends Component {

  constructor(props) {
    super(props);
  }

  @autobind
  sendNewMessage(messages = []) {
    console.log('send', messages)
    this.props.sendMessage(this.props.myId, messages[0].text, this.props.chatId, this.props.database)
  }

  @autobind
  prepareChat() {
    this.props.fetchChat(this.props.chatId, this.props.database, this.props.buddyName, this.props.buddyImg);
  }

  @autobind
  onRequestClose() {
    this.props.closeChatView();
  }

  render() {
    return (
      <Modal
        visible={this.props.isChatViewOpen}
        animationType={'slide'}
        onRequestClose={this.onRequestClose}
        onShow={this.prepareChat}
      >
        <GiftedChat
          messages={this.props.messages}
          onSend={messages => this.sendNewMessage(messages)}
          user={{
            _id: this.props.myId
          }}
          timeFormat={'HH'}
        />
        <View style={{flex: 0, height: 50}}>
          <Button
            onPress={this.onRequestClose}
            style={{width: width, height: 50}}
            isDisabled={false}
          >
            Close
          </Button>
        </View>
      </Modal>
    );
  }
}

const mapDispatchToProps = {
  fetchChat,
  sendMessage,
  openChatView,
  closeChatView
};

const mapStateToProps = store => {
  return {
    database: firebase.database(),
    messages: getMessages(store),
    myId: getMyId(store),
    buddyId: getBuddyId(store),
    buddyName: getBuddyName(store),
    buddyImg: getBuddyImg(store),
    chatId: getChatId(store),
    fetching: isFetching(store),
    fetchReady: isFetchReady(store),
    fetchError: getFetchError(store),
    errorMsg: getErrorMsg(store),
    isChatViewOpen: isChatViewOpen(store)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BuddyChatView);
