'user strict';

import React, { Component } from 'react';
import { View, Text } from 'react-native';

class BuddyPlaceholder extends Component {

  constructor(props) {
    super(props);
  }
  
  componentWillMount() {
    console.log('buddy ', this.props)
  }

  render() {
    return (
      <View>
        <Text>
          This is BuddyPlaceholder. To be replaced with buddyprofile. Then delete this.
        </Text>
      </View>
    );
  }
}

export default BuddyPlaceholder;