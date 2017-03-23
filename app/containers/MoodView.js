'use strict';

import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  Platform,
  Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Icon from 'react-native-vector-icons/Ionicons';

import {
  getMoodDataForChart,
  getLimitLineData,
  getKpiValues
} from '../concepts/mood';
import MoodChart from '../components/mood/MoodChart';
import MoodKpis from '../components/mood/MoodKpis';
import MoodSlider from '../components/mood/MoodSlider';
import Fab from '../components/common/Fab';
import theme from '../style/theme';
import autobind from 'autobind-decorator';

const IOS = Platform.OS === 'ios';
const { width, height } = Dimensions.get('window');

class MoodView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      test: true
    };
  }

  @autobind
  navigateToMoodSlider() {
    this.props.navigator.push({
      showName: true,
      component: MoodSlider,
      name: 'How Whappu'
    });
  }

  render() {
    const { moodData, limitLineData, moodKpiValues } = this.props;

    return (
      <View style={styles.container}>
        <MoodChart data={moodData} limitLineData={limitLineData} />

        <Fab
          onPress={this.navigateToMoodSlider}
          styles={styles.button}
          disabled={false}
          underlayColor={theme.white}
        >
          <Text style={styles.buttonText}>
            ADD VIBE
          </Text>
        </Fab>

        <MoodKpis kpiValues={moodKpiValues} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: IOS ? 20 : 0,
    backgroundColor: theme.white,
  },
  button: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    position: 'absolute',
    top: (height / 2.5) - (IOS ? 20 : 40),
    zIndex: 2,
    left: (width / 2) - 40,
    backgroundColor: theme.white,
    width: 80,
    height: 80,
    borderRadius: 40,
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 1,
    shadowOffset: {
      height: 2,
      width: 0
    },
  },
  buttonText: {
    color: theme.secondary,
    backgroundColor: 'transparent',
    textAlign: 'center',
    padding: 10,
    fontSize: 16,
  }
});

const mapDispatchToProps = {}

const mapStateToProps = createStructuredSelector({
  moodData: getMoodDataForChart,
  limitLineData: getLimitLineData,
  moodKpiValues: getKpiValues
});

export default connect(mapStateToProps, mapDispatchToProps)(MoodView);

