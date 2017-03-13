'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';

import { VictoryPie } from 'victory-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../../style/theme';

const IOS = Platform.OS === 'ios';

class MoodKpis extends Component {

  render() {
    const { kpiValues } = this.props;

    const RENDER_VALUES = ['own', 'team', 'total'];

    return (
      <View style={styles.container}>
        {RENDER_VALUES.map(value =>
        <View style={styles.col} key={value}>
          <View style={styles.doughnut}>
          <VictoryPie
            data={[
              {label: '+', value: kpiValues.get(value)},
              {label: '-', value: 100 - kpiValues.get(value) }
            ]}
            style={{
              data: {
              fill: (d) =>
                d.label === '-'
                ? '#eee'
                : (d.y > 50 ? theme.primary : theme.secondary)
              },
              labels: {fontSize: 0}
            }}
            innerRadius={39}
            padding={0}
            width={84}
            height={84}
            x="label"
            y={(datum) => datum.value}
          />
          </View>
          <Text style={styles.label}>{(value||'').toUpperCase()}</Text>
          <Text style={[styles.kpi, { color: kpiValues.get(value) > 50 ? theme.primary : theme.secondary }]}>
            {kpiValues.get(value)}%
          </Text>
        </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    paddingBottom: 10,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row'
  },
  doughnut: {
    position: 'absolute',
    left: 5,
    top: 0,
  },
  col: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  label: {
    color: theme.midgrey,
    fontSize: 10,
  },
  kpi: {
    color: theme.secondary,
    fontWeight: '300',
    fontFamily: !IOS ? 'sans-serif-light' : undefined,
    fontSize: 20,
  }
});

export default MoodKpis;

