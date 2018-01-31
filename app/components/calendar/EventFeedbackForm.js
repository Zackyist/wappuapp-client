'use strict';

import React, { Component } from 'react';
import { Text, View, TextInput, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import Star from 'react-native-stars';
import Button from '../common/Button';
import Toolbar from './EventFeedbackToolbar';
import api from '../../services/api';
import DeviceInfo from 'react-native-device-info';

import theme from '../../style/theme';

class EventFeedback extends Component {

  constructor(props) {
    super(props);

    const { eventId } = this.props.route.passProps;

    this.state = {
      id: eventId,
      grade: 0,
      text: '',
      textLength: 0,
      uuid: DeviceInfo.getUniqueID()
    };
  }

  submitFeedback() {

    const { id, text, grade, uuid } = this.state;

    const feedback = {id, text, grade, uuid }

    return api.postFeedback(feedback, id)
      .then(response => {
        if (response.status === 200) {
          Alert.alert(
            'Thank you!',
            'We have received your feedback!',
            [
              {text: 'Return', onPress: () => this.props.navigator.pop()}
            ],
            { cancelable: false }
          )
        }
      })
      .catch(e => {
        Alert.alert(
          'Something went wrong...',
          'Your feedback wasn\'t sent. Please try again in a moment.',
          [
            {text: 'Cancel', onPress: () => console.log('Event feedback canceled!')}
          ],
          { cancelable: false }
        )
      })
  }

  render() {
    return (
      <ScrollView style={{ backgroundColor: theme.lightgrey }} >
        <View style={ styles.toolbarContainerStyle }>
          <Toolbar style={styles.titleStyle} title={'Event Feedback'} navigator={this.props.navigator} />
        </View>
        <View style={ styles.starContainerStyle } >
          <Text style={ styles.textStyle } >
            Rate the event
          </Text>
          <Star
            update={(val)=>{this.setState({grade: val})}}
            spacing={4}
            starSize={40}
            count={5}
            fullStar={require('../../../assets/eventStarFilled.png')}
            emptyStar={require('../../../assets/eventStarEmpty.png')}
            halfStar={require('../../../assets/eventStarHalf.png')}
          />
        </View>
        <View style={ styles.containerStyle } >
          <Text style={ styles.textStyle } >
            Optional feedback
          </Text>
          <View style={styles.textBoxContainerStyle} >
            <TextInput
              style={styles.textBoxStyle}
              placeholder='Your feedback here'
              editable={true}
              multiline={true}
              numberOfLines={10}
              maxLength={1000}
              textBreakStrategy={'highQuality'}
              onChangeText={(text) => this.setState({text: text})}
            />
          </View>
          <Text style={styles.charCounterStyle}>{this.state.text.length}/1000</Text>
        </View>
        <View style={styles.navigationButton}>
            <Button onPress={() => this.submitFeedback()}>Send</Button>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: 'white',
    borderRadius: 5,
    margin: 16,
    justifyContent: 'center',
    paddingBottom: 20,
  },
  starContainerStyle: {
    backgroundColor: 'white',
    borderRadius: 5,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 61,
    justifyContent: 'center',
    paddingBottom: 20
  },
  toolbarContainerStyle: {
    marginBottom: 10
  },
  textStyle: {
    fontSize: 17,
    color: '#ec449c',
    margin: 10,
    fontWeight: 'bold'
  },
  textBoxStyle: {
    textAlign: 'left',
    marginRight: 15,
    marginLeft: 15,
    fontSize: 16,
    marginTop: 0,
    paddingTop: 0,
    paddingBottom: Platform.OS === 'ios' ? 200 : 0,
    textAlignVertical: 'top'
  },
  textBoxContainerStyle: {
    borderWidth: 1,
    borderColor: 'rgba(9, 234, 227, 0.4)',
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 5
  },
  navigationButton: {
    height: 50,
    backgroundColor: '#E9E9E9',
    borderColor: '#C7C7C7',
    borderRadius: 5,
    marginRight: 15,
    marginLeft: 15
  },
  charCounterStyle: {
    textAlign: 'right',
    marginRight: 25,
    fontSize: 10,
    marginTop: 0,
    paddingTop: 0
  }
});

export default EventFeedback;

