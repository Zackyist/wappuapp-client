'user strict';

import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { firebase } from 'firebase';

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

  componentWillMount() {
    console.log('Navigator chatissa: ', this.props.navigator)
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    );
  }
}

export default BuddyChatView;