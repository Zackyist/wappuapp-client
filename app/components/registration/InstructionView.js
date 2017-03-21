'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  ScrollView
} from 'react-native';
import theme from '../../style/theme';
import Toolbar from './RegistrationToolbar';
import Button from '../../components/common/Button';
import Row from '../../components/common/Row';
import Icon from 'react-native-vector-icons/Ionicons';

const IOS = Platform.OS === 'ios';

class InstructionView extends Component {
  render() {
    const { simplified } = this.props;
    const containerStyles = [styles.container, styles.modalBackgroundStyle, simplified && styles.simplified];

    return (
      <View style={containerStyles}>
          <ScrollView style={{flex:1, width: null, height: null}}>
            <View style={[styles.container, styles.contentContainer]}>
              <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={styles.header}>
                  How to
                </Text>
                <Image style={{marginTop: 30, marginLeft: 10, height: 110, width: 110}}  source={require('../../../assets/whappu-text.png')}/>
              </View>

              <Row
                style={{paddingTop: 20}}
                icon={IOS ? 'ios-star': 'md-star'}
                number={1}
                title={'Whappu hard & Share it'}
                text={'Guild with the best Whappu-buzz wins a juicy prize!'}/>

              <Row
                icon={IOS ? 'ios-wine' : 'md-wine'}
                number={2}
                title={'Enjoy sima'}
                text={'Because otherwise you might get thirsty.'}/>

              <Row
                icon={IOS ? 'ios-trophy' : 'md-trophy'}
                number={3}
                title={'Winner takes it all'}
                text={'Competition ends at 12:00AM on 1st of May.'}
                secondaryText={'Winner will be announced later on the day.'}/>
              <Text style={styles.text}>
                <Text style={{fontWeight: 'bold'}}>Join </Text>
                <Text>by finishing up your registration. Just looking around? It's okay, just</Text>
                <Text style={{fontWeight: 'bold'}}> skip. </Text>
              </Text>
            </View>
          </ScrollView>

        {!simplified &&
          <View style={styles.bottomButtons}>
            <Button onPress={this.props.onDismiss} style={styles.modalButton}>
              Got it
            </Button>
          </View>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.secondary,
    paddingBottom: 30
  },
  simplified: {
    // marginBottom: 40,
    alignSelf: 'stretch'
  },
  innerContainer: {
    flex: 1,
    paddingTop: IOS ? 15 : 15,
  },
  header: {
    // fontWeight: 'bold',
    textAlignVertical: 'center',
    // fontFamily: 'arial',
    color: theme.white,
    marginTop: 15,
    // marginLeft: IOS ? 25 : 15,
    fontSize: 25
  },
  text: {
    textAlign: 'center',
    color: theme.white,
    fontSize: 17,
    padding: 30
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
