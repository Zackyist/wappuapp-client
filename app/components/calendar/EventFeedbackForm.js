'use strict';

// TODO: Styling of the TextInput
// TODO: Waiting for backend to send the feedback to
// TODO: Fix colour sources to theme
// TODO: Repair navigation
// TODO: Add event and userid to props

import React, { Component } from 'react';
import { Text, View, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import Star from 'react-native-stars';
import Button from '../common/Button';
import Toolbar from './EventFeedbackToolbar';
import { connect } from 'react-redux';
// import autobind from 'autobind-decorator';

import theme from '../../style/theme';



class EventFeedback extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      stars: 0,
      text: '',
      textHeight: 40
    };
  }

  giveStarRating(rating) {
    this.setState({
      stars: rating
    });
  }

  updateSize(height) {
    this.setState({
      textHeight: height
    });
  }

  submitFeedback() {
    Alert.alert(
      'Event feedback',
      'Your feedback has been received! Thank you!',
      [
        {text: 'Return', onPress: () => this.props.navigator.pop()}
      ],
      { cancelable: false }
    )
  }

  render() {

    const { textHeight } = this.state

    let newStyle = {
      height: textHeight
    }

    return (
      <ScrollView style={{ backgroundColor: theme.lightgrey }} >
        <View style={ styles.toolbarContainerStyle }>
          <Toolbar title={'Event Feedback'} navigator={this.props.navigator} />
        </View>
        <View style={ styles.starContainerStyle } >
          <Text style={ styles.textStyle } >
            Rate the event
          </Text>
          <Star
            update={(val)=>{this.setState({stars: val})}}
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
          <TextInput
            style={newStyle}
            placeholder='Your feedback here'
            editable={true}
            autoGrow={true}
            multiline={true}
            minHeight={5}
            maxHeight={20}
            maxLength={1000}
            textBreakStrategy={'balanced'}
            onChangeText={(text) => this.setState({text: text})}
            onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.textHeight)}
          />
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
  navigationButton: {
    height: 50,
    backgroundColor: '#E9E9E9',
    borderColor: '#C7C7C7',
    borderRadius: 2,
  }
});

const select = store => {
  return {};
};

export default connect(select)(EventFeedback);
