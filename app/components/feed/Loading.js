
import React from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import ProgressBar from 'ProgressBarAndroid';
import theme from '../../style/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  activityIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 60
  },
  loadMessage: {
    textAlign:'center',
    color:'#999'
  }
});

const Loading = props => {
  return (
    <View style={styles.container}>
      {(Platform.OS === 'android') ?
        <ProgressBar styleAttr='Inverse' color={theme.primary}/>
      :
        <ActivityIndicator
          color={theme.primary}
          animating={true}
          style={styles.activityIndicator}
          size='large' />
      }
      <Text style={ styles.loadMessage}>Loading awesomeness...</Text>
    </View>
  );
};

export default Loading;
