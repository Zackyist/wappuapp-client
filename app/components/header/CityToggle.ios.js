import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight
} from 'react-native'

import { connect } from 'react-redux';

import { openCitySelection, toggleCityPanel, getCityId, getCurrentCityName } from '../../concepts/city';

import theme from '../../style/theme';
// import MdIcon from 'react-native-vector-icons/MaterialIcons';

const cityIcons = {
  'helsinki': require('../../../assets/cities/icon-ota-amfi-accent.png'),
  'tampere': require('../../../assets/cities/icon-tampere-accent.png')
};

const CitySelector = ({
  currentCity,
  toggleCityPanel,
  currentCityName
}) => (
  <TouchableHighlight
    underlayColor={'transparent'}
    onPress={() => toggleCityPanel() }>
    <View>
      <Image
        source={(currentCityName || '').toLowerCase() === 'tampere'
          ? cityIcons.tampere
          : cityIcons.helsinki
        }
        style={styles.cityIcon}
      />
    </View>
    {/*
     <Text style={styles.filterText}>
      <MdIcon name='location-city' style={styles.filterIcon} /> {/*currentCity
    </Text>
    */ }
  </TouchableHighlight>
);

var styles = StyleSheet.create({
  filterText: {
    color: theme.white,
    fontSize: 10,
    paddingTop: 15,
    paddingLeft: 18,
  },
  filterIcon: {
    fontSize: 24,
  },
  cityIcon: {
    // tintColor: theme.white,
    top: 0,
    left: 5,
    width: 40,
    height: 40,
  }
});


const mapDispatchToProps = { openCitySelection, toggleCityPanel };

const select = state => {
  return {
    currentCity: getCityId(state),
    currentCityName: getCurrentCityName(state),
    currentTab: state.navigation.get('currentTab')
  }
};

export default connect(select, mapDispatchToProps)(CitySelector);
