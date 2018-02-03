'user strict';

import React, { Component } from 'react';
import { View, Text } from 'react-native';

class BuddyChatView extends Component {

  constructor(props) {
    super(props);

  }

  componentWillMount() {
    console.log('Navigator chatissa: ', this.props.navigator)
  }

  render() {
    return (
      <View>
        <Text>
          Chatti tulee tänne.
        </Text>
      </View>
    );
  }
}

export default BuddyChatView;