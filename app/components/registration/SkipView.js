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
import PlatformTouchable from '../../components/common/PlatformTouchable';

const { width, height } = Dimensions.get('window');

const IOS = Platform.OS === 'ios';

class SkipView extends Component {

  render() {

    return (
       <View style={styles.container}>
          {/*
          <View style={styles.topArea}>
            <View style={styles.iconWrap}>
              <Image style={styles.bgImage} source={require('../../../assets/frontpage_header-bg.jpg')} />
              <MdIcon style={styles.icon} name={'loyalty'} />
            </View>
          </View>
          */}

          <ScrollView style={{flex:1, width: null, height: null}}>
              <View style={styles.content}>
                <View style={styles.textContainer}>
                  <Text style={styles.subTitle}>CHOOSE YOUR TEAM</Text>
                    <Text style={styles.text}>
                      <Text style={{fontWeight: 'bold'}}>Edit your profile </Text>
                      to finish registration.
                    </Text>

                    <Text style={styles.text}>Just looking around? It's okay, just
                      <Text style={{fontWeight: 'bold'}}> Skip. </Text>
                      You can always edit your profile later.
                    </Text>

                    <Text style={[styles.text, { fontWeight: 'bold' }]}>Whappu starts now!</Text>
                </View>
                <PlatformTouchable onPress={this.props.onPressProfileLink}>
                  <View style={styles.editButton}>
                    <Text style={{fontSize: 16, fontWeight: 'bold', color: theme.white}}>EDIT YOUR PROFILE</Text>
                  </View>
                </PlatformTouchable>
              </View>
            </ScrollView>

        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: theme.secondary,
  },
  content: {
    margin: 20,
    marginTop: 25,
    marginBottom: 15,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  topArea: {
    backgroundColor: theme.secondary,
    minHeight: height / 2.5,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  iconWrap: {
    overflow: 'hidden',
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,.1)',
    left: width / 2 - 100,
    top: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    // width: 200,
    // left: width / 2 - 100,
    // top: 50,
    // position: 'absolute',
    textAlign: 'center',
    opacity: 1,
    backgroundColor: theme.transparent,
    fontSize: 150,
    width: 150,
    height: 150,
    // tintColor: theme.white,
    color: theme.white,
  },
  subIcon: {
    backgroundColor: theme.transparent,
    color: theme.accentLight,
    fontSize: 60,
    right: 50,
    top: 30,
    position: 'absolute'
  },
  bgImage: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    width: 200,
    height: 200,
    bottom: 0,
    opacity: 0.3
  },

  textContainer: {
    flex: 3,
    marginHorizontal: 40,
    flexDirection: 'column'
  },
  subTitle: {
    textAlign: 'center',
    color: theme.accentLight,
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 15,
  },
  text: {
    marginBottom: 20,
    fontSize: 13,
    lineHeight: 18,
    color: theme.white,
    textAlign: 'center',
  },
  editButton: {
    marginTop: 10,
    marginBottom: 25,
    padding: 5,
    paddingTop: 8,
    paddingBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: IOS ? 25 : 2,
    elevation: 3,
    borderWidth: 0,
    borderColor: theme.grey,
    backgroundColor: theme.primary,
    width: 200,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 1,
    shadowOffset: {
      height: 3,
      width: 0
    }
  }

});

export default SkipView;
