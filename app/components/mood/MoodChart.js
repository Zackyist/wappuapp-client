'use strict';

import React, { Component } from 'react';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';
import theme from '../../style/theme';
import Chart from './Chart';
const { height } = Dimensions.get('window');

class MoodChart extends Component {
  render() {
    const { data, limitLineData } = this.props;

    return (
      <View style={styles.container}>
        <Chart limitLineData={limitLineData} data={data} height={(height / 2.5) - 50} front={true} lineColor={theme.accent} />
      </View>
    );
  }
};



const styles = StyleSheet.create({
  container: {
    height: height / 2.5,
    paddingTop: 10,
    paddingBottom: 50,
    backgroundColor: theme.secondary
  }
});


export default MoodChart;
