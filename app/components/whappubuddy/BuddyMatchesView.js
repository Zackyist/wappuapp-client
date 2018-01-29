'use strict';

// TODO: Implement redux
// TODO: Find solution to the async problem with showing profile pic and name

import React, { Component } from 'react';
import {
  View,
  Text,
  ListView,
  ScrollView,
  ActivityIndicator,
  ActivityIndicatorIOS,
  Platform,
  TouchableOpacity,
  Alert
} from 'react-native';

import _ from 'lodash';
import api from '../../services/api';
import DeviceInfo from 'react-native-device-info';
import UserAvatar from 'react-native-user-avatar';

import theme from '../../style/theme';

const isIOS = Platform === 'ios';

class BuddyMatches extends Component {

  constructor(props) {
    super(props);

    this.state = {
      dataSource: [],
      matches: [],
      isLoading: true
    }
  }

  openChat = (item) => {
    Alert.alert(
      'Chatin aukaisu',
      'Halusit aloittaa chatin kanssa',
      [
        {text: 'OK', onPress: () => console.log('Chatti buddy: ', item.buddyName)},
      ],
      { cancelable: true }
    )
  }

  setBuddyInfo = () => {

    let currentMatches = [...this.state.matches ]

    _.each(currentMatches, (match) => {
      return api.getUserProfile(match.buddyId)
        .then(buddy => {
          match.buddyName = buddy.name,
          match.buddyImage = buddy.image_url
        })
    })

    this.setState({
      matches: currentMatches,
    })
  }

  async setMatchData(match) {

    // Name and image placeholders, find solution to the async problem
    var buddyName = 'Placeholder'
    var buddyImage = 'https://i.imgur.com/DhXdgph.png'
    var myId = match.userId1
    var buddyId = match.userId2
    var chatId = match.firebaseChatId

    const buddyObject = { myId, buddyId, buddyName, buddyImage, chatId }

    return buddyObject
  }

  async getMatchData() {

    return api.getMatches(DeviceInfo.getUniqueID())
      .then(async (matches) => {
        for (const match of matches) {

          const buddy = await this.setMatchData(match)

          this.setState({
            matches: [...this.state.matches, buddy]
          })
        }

        // Fetch names and profile pictures of current user's matches 
        this.setBuddyInfo()

        // Update the datasource
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(this.state.matches),
          isLoading: false
        })
      })
  }

  componentDidMount() {

    // Fetch current user's matches
    this.getMatchData()
  }

  componentWillMount() {

    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.setState({
      dataSource: ds.cloneWithRows([]),
      matches: [],
      isLoading: true
    })
  }

  renderRow = (item) => {

    return (
      <TouchableOpacity onPress={this.openChat.bind(this, item)}>
        <View style={styles.containerStyle} >
          <UserAvatar
            name={item.buddyName}
            src={item.buddyImage}
            size={50}
          />
          <Text
            style={styles.containerNameStyle}
          >
            {item.buddyName}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderSeparator = (sectionID, rowID) => {
    return <View key={`${sectionID}-${rowID}`} />
  }

  render() {

    return (
      <ScrollView style={styles.scrollStyle} >
        { this.state.isLoading ? (
          <View>
            {!isIOS ? (
              <ActivityIndicator />
            ) : (
              <ActivityIndicatorIOS />
            )}
          </View>
        ) : (
        <ListView
          enableEmptySections
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          renderSeparator={this.renderSeparator}
        />
        )}
      </ScrollView>
    );
  }
}

const styles = {
  scrollStyle: {
    flex: 1
  },
  containerStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 60,
    marginRight: 20,
    marginLeft: 20,
    marginBottom: 5,
    marginTop: 10,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0,.2)'
  },
  containerNameStyle: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: 'bold'
  }
}

export default BuddyMatches;
