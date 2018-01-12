'use strict';

// TODO: Styling of the TextInput
// TODO: Waiting for backend to send the feedback to
// TODO: Fix colour sources to theme
// TODO: Repair navigation
// TODO: Add event and userid to props

import React, { Component } from 'react';
import { Text, View, TextInput, StyleSheet } from 'react-native';
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
      text: ''
    };
  }

  giveStarRating(rating) {
    this.setState({
      stars: rating
    });
  }

  placeholder() {
    return;
  }

  render() {
    return (
      <View style={{ backgroundColor: theme.lightgrey }} >
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
            fullStar={require('../../../assets/starFilled.png')}
            emptyStar={require('../../../assets/starEmpty.png')}
            halfStar={require('../../../assets/starHalf.png')}
          />
        </View>
        <View style={ styles.containerStyle } >
          <Text style={ styles.textStyle } >
            Optional feedback
          </Text>
          <TextInput
            multiline={true}
            numberOfLines={6}
            onChangeText={(text) => this.setState({text})}
          />
        </View>
        <View style={styles.navigationButton}>
            <Button onPress={() => this.placeholder()}>Send</Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: 'white',
    borderRadius: 5,
    margin: 16,
    justifyContent: 'center',
    paddingBottom: 20
  },
  starContainerStyle: {
    backgroundColor: 'white',
    borderRadius: 5,
    margin: 16,
    marginTop: 65,
    justifyContent: 'center',
    paddingBottom: 20
  },
  toolbarContainerStyle: {
    marginBottom: 10  
  },
  textStyle: {
    fontSize: 16,
    color: '#ec449c',
    margin: 10
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
