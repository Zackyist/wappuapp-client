
import React from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet
} from 'react-native';
import theme from '../../style/theme';

const styles = StyleSheet.create({
  activityIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 30
  },
  loadMessage: {
    textAlign:'center',
    color:'#999'
  }
});

const Loader = props => (
  <ActivityIndicator
    color={theme.primary}
    animating={true}
    style={styles.activityIndicator}
    size='small' />
);

export default Loader;
