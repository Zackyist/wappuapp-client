import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight
} from 'react-native'

import { connect } from 'react-redux';

import { openCitySelection, getCityId } from '../../concepts/city';

import theme from '../../style/theme';
import MdIcon from 'react-native-vector-icons/MaterialIcons';

const CitySelector = ({
  currentCity,
  openCitySelection
}) => (
  <TouchableHighlight
    underlayColor={'transparent'}
    onPress={() => openCitySelection() }>
    <Text style={styles.filterText}>
      <MdIcon name='map' style={styles.filterIcon} /> {currentCity}
    </Text>
  </TouchableHighlight>
);

var styles = StyleSheet.create({
  filterText: {
    color: theme.white,
    fontSize: 10,
    paddingTop: 10,
    paddingLeft: 18,
  },
  filterIcon: {
    fontSize: 24,
  }
});


const mapDispatchToProps = { openCitySelection };

const select = state => {
  return {
    currentCity: getCityId(state),
    currentTab: state.navigation.get('currentTab')
  }
};

export default connect(select, mapDispatchToProps)(CitySelector);
