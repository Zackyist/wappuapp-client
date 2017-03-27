'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions
} from 'react-native';
import { connect } from 'react-redux';

import {
  getOwnMoodData,
  getTeamMoodData,
  getCityMoodData,
  getLimitLineData,
  getKpiValues,
  fetchMoodData
} from '../concepts/mood';

import Notification from '../components/common/Notification';
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

  componentDidMount() {
    this.props.fetchMoodData()
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
    const { cityMoodData, ownMoodData, teamMoodData, limitLineData, moodKpiValues,
      isNotificationVisible, notificationText } = this.props;

    return (
      <View style={styles.container}>
        <MoodChart cityData={cityMoodData} ownData={ownMoodData} teamData={teamMoodData} limitLineData={limitLineData} />

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

        <Notification visible={isNotificationVisible}>
          {notificationText}
        </Notification>
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

const mapDispatchToProps = { fetchMoodData };

const mapStateToProps = state => ({
  cityMoodData: getCityMoodData(state),
  ownMoodData: getOwnMoodData(state),
  teamMoodData: getTeamMoodData(state),
  limitLineData: getLimitLineData(state),
  moodKpiValues: getKpiValues(state),
  isNotificationVisible: state.competition.get('isNotificationVisible'),
  notificationText: state.competition.get('notificationText')
});

export default connect(mapStateToProps, mapDispatchToProps)(MoodView);

