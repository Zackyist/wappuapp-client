'user strict';

import React, { Component } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import * as firebase from 'firebase';
import { connect } from 'react-redux';

import { fetchChat, sendMessage, } from '../../actions/chat';

class BuddyChatView extends Component {

  constructor(props) {
    super(props);
    
    state = {
      messages: [],
      myId: 4,
      buddyId: 14,
      buddyName: "pate666", 
      buddyImg: null,
      chatId: "-L3hgBVkaXrlTGtDiPwx"
    }
  }

  sendNewMessage = (messages = []) => {
    console.log('send', messages)
    this.props.sendMessage(this.props.myId, messages[0].text, this.props.chatId, this.props.database)
  }

  componentWillMount() {

    this.props.fetchChat(this.props.chatId, this.props.database, this.props.buddyName, this.props.buddyImg);
  }

  render() {

    if (!this.props.fetchReady) {
      return (
        <View>
          <ActivityIndicator size={'large'} />
        </View>
      );
    }
    return (
      <GiftedChat
        messages={this.props.messages}
        onSend={this.sendNewMessage.bind(this)}
        user={{
          _id: this.props.myId
        }}
        timeFormat={'HH'}

      />
    );
  }
}

const mapDispatchToProps = {
  fetchChat,
  sendMessage,
};

const mapStateToProps = store => {
  console.log('store: ', store.user)
  // TODO: Change source to "this.props" once navi works!!!
  return {
    database: firebase.database(),
    messages: store.chat.messages,
    myId: 4,
    buddyId: 14,
    buddyName: 'pate666',
    buddyImg: null,
    chatId: "-L3hgBVkaXrlTGtDiPwx",
    fetching: store.chat.fetching,
    fetchReady: store.chat.fetchReady,
    fetchError: store.chat.fetchError,
    errorMsg: store.chat.errorMsg
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BuddyChatView);