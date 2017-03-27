'use strict';

import React, { Component } from 'react';
import {
  View,
  Animated,
  Text,
  Image,
  StyleSheet,
  Easing,
  TouchableWithoutFeedback,
  Platform,
  ScrollView
} from 'react-native';
import theme from '../../style/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';

const IOS = Platform.OS === 'ios';

class InstructionView extends Component {
  constructor(props) {
     super(props);
     this.state = {
       springAnim: new Animated.Value(0),
     };
   }

   handlePress(id) {
     this.props.onSelect(id);

     this.state.springAnim.setValue(0);
      Animated.timing(
        this.state.springAnim,
        {
          toValue: 1,
          duration: 800,
          easing: Easing.elastic(1)}
      ).start();
   }

  render() {
    const containerStyles = [styles.container, styles.modalBackgroundStyle];
    const size = this.state.springAnim;

    const active = this.state.springAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.2, 1] });
    const unactive = this.state.springAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1, 1] });

    return (
       <View style={containerStyles}>
          <ScrollView style={{flex:1, width: null, height: null}}>
              <View style={[styles.container, styles.contentContainer]}>

                <View style={{alignItems: 'center'}}>
                  <Image style={{marginTop: 50, height: 140, width: 150}}  source={require('../../../assets/header/4.png')}/>
                </View>

                <View style={styles.content}>
                  <Icon style={styles.icon} name={'location-on'} size={50}/>
                  <View style={styles.textContainer}>
                    <Text style={styles.subTitle}>Pick your city to start</Text>
                    <Text style={styles.text}>
                      City you select will have an effect on the feed. You may change your selection whenever you want.</Text>
                  </View>
                </View>

                <View style={styles.cities}>
                  {this.props.cities.map((city, i) => {
                    return <TouchableWithoutFeedback
                      key={i}
                      onPress={this.handlePress.bind(this, city.get('id'))}>
                      <Animated.View style={[styles.touchable, {transform: [{scale: city.get('id') === this.props.selectedCity ? active : unactive}] }]}>
                        <View style={styles.circle}>
                          <Icon style={styles.cityIcon} name={'location-city'} size={50}/>
                          <Text style={styles.cityTitle}>
                            {city.get('name')}
                          </Text>
                          {this.props.selectedCity === city.get('id') && <Icon name={'check'} style={styles.checked} size={30}/>}
                        </View>
                      </Animated.View>
                    </TouchableWithoutFeedback>}
                  )}
                </View>

              </View>
            </ScrollView>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.secondary,
    alignSelf: 'stretch',
    paddingBottom: 30
  },
  header: {
    fontWeight: 'bold',
    color: theme.secondary,
    marginTop: 30,
    marginLeft: IOS ? 25 : 15,
    fontSize: 28
  },
  content: {
    marginTop: 30,
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
    marginLeft: 0,
    flexDirection: 'column'
  },
  subTitle: {
    fontFamily: 'arial',
    color: 'white',
    fontSize: 22,
  },
  text: {
    fontSize: 12,
    color: 'white',
    paddingRight: 15
  },
  cities: {
    marginTop: 40,
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1
  },
  touchable: {
    height: 120,
    width: 120,
    margin: 10,
    borderRadius: 60,
  },
  circle: {
    flex: 1,
    backgroundColor: theme.primary,
    padding: 20,
    borderWidth: 2,
    borderStyle: 'dotted',
    borderColor: theme.white,
    alignItems: 'center',
    borderRadius: 60,
  },
  cityIcon: {
    color: 'white'
  },
  cityTitle: {
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  checked: {
    position: 'absolute',
    top: 10,
    right: 5,
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0)',
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
    marginLeft:0,
  }
});

export default InstructionView;
