'use strict';

import React, { Component } from 'react';
import {
  View,
  Animated,
  Text,
  Image,
  StyleSheet,
  Easing,
  TouchableOpacity,
  Platform,
  ScrollView,
  Dimensions
} from 'react-native';

import theme from '../../style/theme';

import Icon from 'react-native-vector-icons/Ionicons';
import MdIcon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');
const cityIcons = {
  'helsinki': require('../../../assets/cities/icon-ota-amfi-accent.png'),
  'tampere': require('../../../assets/cities/icon-tampere-accent.png')
};

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
    const { springAnim } = this.state;

    const active = springAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.2, 1] });
    const unactive = springAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1, 1] });

    return (
       <View style={containerStyles}>

          <View style={styles.topArea}>
            <View style={styles.iconWrap}>
              <Image style={styles.bgImage} source={require('../../../assets/frontpage_header-bg.jpg')} />
              <Icon style={styles.icon} name={'md-globe'} />
              <MdIcon style={styles.subIcon} name={'location-on'} />
            </View>
          </View>

          <ScrollView style={{flex:1, width: null, height: null}}>
            <View style={styles.container}>
              <View style={styles.bottomArea}>

                  <View style={styles.content}>
                    <View style={styles.textContainer}>
                      <Text style={styles.subTitle}>PICK YOUR CITY</Text>
                      <Text style={styles.text}>
                      Don't worry, you can change your selection later.</Text>
                    </View>
                  </View>
                  <View style={styles.cities}>
                    {this.props.cities.map((city, i) => {
                      const isCitySelected = city.get('id') === this.props.selectedCity;
                      return <TouchableOpacity
                        key={i}
                        activeOpacity={0.5}
                        style={styles.button}
                        onPress={this.handlePress.bind(this, city.get('id'))}>
                        <Animated.View style={[styles.touchable, {transform: [{ scale: isCitySelected ? active : unactive }] }]}>
                          <View style={styles.circle}>
                            {isCitySelected && <MdIcon name={'done'} style={styles.checked} />}

                            <Image
                              source={(city.get('name') || '').toLowerCase() === 'tampere'
                                ? cityIcons.tampere
                                : cityIcons.helsinki
                              }
                              style={styles.cityIcon}
                            />

                            <Text style={[styles.cityText, isCitySelected ? styles.activeCityText : {}]}>
                              {city.get('name')}
                            </Text>
                          </View>
                        </Animated.View>
                      </TouchableOpacity>}
                    )}
                  </View>
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
    alignSelf: 'stretch'
  },
  area: {
    alignItems: 'stretch'
  },
  topArea: {
    backgroundColor: theme.secondary,
    minHeight: height / 2.5,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  bottomArea: {
    flex: 1,
  },
  iconWrap: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: 'rgba(255,255,255,.1)',
    left: width / 2 - 95,
    top: width / 8,
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
    right: 40,
    top: 10,
    position: 'absolute'
  },
  bgImage: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    width: 190,
    height: 190,
    borderRadius: 95,
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
  subTitle: {
    color: theme.accentLight,
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 15,
  },
  text: {
    fontSize: 13,
    lineHeight: 18,
    color: theme.white,
    textAlign: 'center',
  },
  cities: {
    marginTop: 0,
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1
  },
  button: {
    height: 120,
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    borderRadius: 50,
  },
  touchable: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  circle: {
    flex: 1,
    backgroundColor: theme.secondary,
    padding: 12,
    paddingTop: 16,
    borderWidth: 2,
    borderColor: theme.white,
    alignItems: 'center',
    borderRadius: 50,
  },
  cityIcon: {
    width: 40,
    height: 40,
    zIndex: 4,
  },
  cityText: {
    fontSize: 12,
    color: theme.white,
    fontWeight: '500',
    marginBottom: 10,
    backgroundColor: 'transparent',
    zIndex: 3,
  },
  activeCityText: {
    color: theme.accentLight
  },
  cityTitle: {
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  checked: {
    zIndex: 2,
    position: 'absolute',
    bottom: 5,
    right: 35,
    fontSize: 25,
    color: theme.accentLight,
    opacity: 1,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  bottomButtons:{
    flex:1,
    flexDirection:'column',
    margin:0,
    marginBottom:0,
    marginLeft:0,
    marginRight:0,
    height: 50,
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
