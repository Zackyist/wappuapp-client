'use strict';

import React, { PropTypes, Component } from 'react';

import {
  View,
  Text,
  Platform,
  Dimensions,
  StyleSheet,
  BackAndroid,
  Modal
} from 'react-native';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';

import Button from '../../components/common/Button';
import theme from '../../style/theme';
import * as CompetitionActions from '../../actions/competition';
const IOS = Platform.OS === 'ios';

const { width, height } = Dimensions.get('window');

class CheckInActionView extends Component {

  constructor(props) {
    super(props);
    // this.state = {
    //   text: '',
    //   formAnimation: new Animated.Value(1),
    //   okAnimation: new Animated.Value(0)
    // }
  }

  componentDidMount(){
    BackAndroid.addEventListener('hardwareBackPress', () => {
      if (this.props.isTextActionViewOpen) {
        this.onCancel()
        return true;
      }
      return false;
    })
  }

  render() {

    const { isCheckInViewOpen } = this.props;

    if (!isCheckInViewOpen) {
      return false;
    }

    return (
      <Modal
        // onRequestClose={this.props.closeCheckInView}
        visible={isCheckInViewOpen}
        animationType={'slide'}
      >
        <View style={[styles.container, styles.modalBackgroundStyle]}>
          <Text>Böö</Text>
        </View>
      </Modal>
    );
  }
}

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:0,
    paddingBottom:IOS ? 49 : 0
  },
  modalBackgroundStyle: {
    backgroundColor: theme.secondary
  }
});

const select = store => {
  return {
    isCheckInViewOpen: store.competition.get('isCheckInViewOpen')
  };
};

export default connect(select)(CheckInActionView);
