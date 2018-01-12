'use strict';

// TODO: Styling of the TextInput
// TODO: Waiting backend to send the feedback to
// TODO: Fix colour sources to theme
// TODO: Repair navigation

import React, { Component } from 'react';
import { Text, View, Navigator, TextInput } from 'react-native';
import StarRating from 'react-native-star-rating';
import Button from '../common/Button';
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

  // @autobind
  // renderScene(route, navigator) {
  //   if (route.component) {
  //     const RouteComponent = route.component;
  //     return <RouteComponent route={route} {...this.props} />
  //   }
  // }

  render() {
    return (
      <View>
        <View style={ styles.containerStyle } >
          <Text style={ styles.textStyle } >
            Rate the event
          </Text>
          <StarRating
            maxStars={5}
            rating={this.state.stars}
            selectedStar={(rating) => this.giveStarRating(rating)}
            starColor={'#00d7d2'}
            emptyStarColor={'white'}
            starSize={40}
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
        <View style={styles.buttonWrapper}>
            <Button onPress={() => this.giveFeedback.bind(this)}>Give feedback</Button>
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

  },
  textStyle: {
    fontSize: 16,
    fontColor: '#ec449c'
  },
  buttonWrapper: {
    margin: 15,
    marginTop: 0,
    marginBottom: 15,
    borderRadius: 3,
    backgroundColor: theme.light
  }
});

const select = store => {
  return {};
};

export default connect(select)(EventFeedback);
