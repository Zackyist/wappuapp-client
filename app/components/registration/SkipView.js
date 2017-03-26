'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
  ScrollView,
  Dimensions
} from 'react-native';
import theme from '../../style/theme';
import Button from '../../components/common/Button';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

const IOS = Platform.OS === 'ios';

class SkipView extends Component {

  render() {

    return (
       <View style={styles.container}>
          <ScrollView style={{flex:1, width: null, height: null}}>
              <View style={{alignItems: 'center'}}>
                <Image style={{marginTop: 80, height: 180, width: 180}}  source={require('../../../assets/whappu-text.png')}/>
              </View>

              <View style={styles.content}>
                <View style={styles.textContainer}>
                  <Text style={styles.subTitle}>To join or not to join?</Text>
                  <Text style={styles.text}>
                    <Text style={{fontWeight: 'bold'}}>Join </Text>
                    <Text>by finishing up your registration. Just looking around? It's okay, just</Text>
                    <Text style={{fontWeight: 'bold'}}> skip. </Text>
                    <Text>You can always register later.</Text>
                  </Text>
                </View>
              </View>
            </ScrollView>
            <TouchableWithoutFeedback onPress={this.props.skip}>
              <View style={styles.cancelButton}>
                <Text style={{fontSize: 16, fontWeight: 'bold', color: theme.white}}>SKIP</Text>
              </View>
            </TouchableWithoutFeedback>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.secondary,
    alignSelf: 'stretch',
    paddingBottom: 30,
  },
  content: {
    marginTop: 30,
    margin: 20,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    flex: 1,
    color: 'white',
    alignItems: 'center',
    textAlign: 'center',
  },
  textContainer: {
    flex: 3,
    marginHorizontal: 40,
    flexDirection: 'column'
  },
  subTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
    // fontFamily: 'arial',
    color: 'white',
    fontSize: 22,
  },
  text: {
    fontSize: 12,
    color: 'white'
  },
  cancelButton: {
    position: 'absolute',
    bottom: 80,
    left: width/2-60,
    padding: 5,
    paddingTop: 8,
    paddingBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: theme.grey,
    backgroundColor: theme.primary,
    width: 120,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 1,
    shadowOffset: {
      height: 5,
      width: 0
    }
  }

});

export default SkipView;
