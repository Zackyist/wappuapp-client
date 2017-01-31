
import React from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet
} from 'react-native';
import ProgressBar from 'ProgressBarAndroid';
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

const Loader = props => {
  if (Platform.OS === 'android') {
    return <ProgressBar styleAttr='Inverse' color={theme.primary}/>
  }

  return <ActivityIndicator
    color={theme.primary}
    animating={true}
    style={styles.activityIndicator}
    size='small' />;
};

export default Loader;
