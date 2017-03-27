'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  ScrollView,
  Dimensions
} from 'react-native';
import theme from '../../style/theme';
import Button from '../../components/common/Button';
import Row from '../../components/common/Row';


const { width, height } = Dimensions.get('window');
const IOS = Platform.OS === 'ios';

class InstructionView extends Component {
  render() {

    return (
      <View style={styles.container}>
          <ScrollView style={{flex:1, width: null, height: null}} >
            <View style={[styles.container, styles.contentContainer]}>

              <View style={styles.content} >
                <View style={styles.textContainer}>
                  <Text style={styles.title}>HOW TO WHAPPU</Text>

                  <Text style={styles.subTitle}>Whappu hard & Share it</Text>
                  <Text style={styles.text}>Team with the best Whappu-buzz wins a juicy prize!</Text>
                  <Text style={styles.subTitle}>Enjoy sima</Text>
                  <Text style={styles.text}>Otherwise you might get thirsty!</Text>
                  <Text style={styles.subTitle}>Winner takes it all</Text>
                  <Text style={styles.text}>Competition ends at 12:00AM on 1st of May. Winner will be announced later on the day!</Text>
                </View>
              </View>

            {/*
              <Row
                style={{paddingTop: 20}}
                icon={'md-star'}
                number={1}
                title={'Whappu hard & Share it'}
                text={'Team with the best Whappu-buzz wins a juicy prize!'}/>

              <Row
                icon={'md-wine'}
                number={2}
                title={'Enjoy sima'}
                text={'Because otherwise you might get thirsty.'}/>

              <Row
                icon={'md-trophy'}
                number={3}
                title={'Winner takes it all'}
                text={'Competition ends at 12:00PM on 30th of April.'}
                secondaryText={'Winner will be announced later on the day.'}/>
              */}
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
  simplified: {
    alignSelf: 'stretch'
  },
  innerContainer: {
    flex: 1,
    paddingTop: IOS ? 15 : 15,
  },
  topArea: {
    backgroundColor: theme.secondary,
    minHeight: height / 2.5,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
 iconWrap: {
    // overflow: 'hidden',
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
    fontSize: 90,
    left: 140,
    top: -5,
    position: 'absolute'
  },
  bgImage: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: 'hidden',
    bottom: 0,
    opacity: 0.3
  },
  content: {
    margin: 20,
    marginTop: 25,
    marginBottom: 15,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    flexDirection: 'column'
  },
  title: {
    color: theme.accentLight,
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 15,
  },
  subTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: theme.white,
    textAlign: 'center',
  },
  text: {
    marginBottom: 20,
    fontSize: 13,
    lineHeight: 18,
    color: theme.white,
    textAlign: 'center',
  },
  bottomButtons:{
    flex:1,
    flexDirection:'column',
    margin:0,
    marginBottom:0,
    marginLeft:0,
    marginRight:0,
    height:50,
    alignItems:'stretch',
    position:'absolute',
    bottom:0,
    left:0,
    right:0,
  },
  modalButton: {
    borderRadius:0,
    flex:1,
    backgroundColor: theme.primary,
    marginLeft:0,
  }
});

export default InstructionView;
