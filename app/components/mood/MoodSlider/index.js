import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  Image,
  TouchableHighlight,
  Dimensions,
  Animated,
  Easing,
  PanResponder,
  Platform,
  KeyboardAvoidingView
} from 'react-native';

import { connect } from 'react-redux';
import MdIcon from 'react-native-vector-icons/MaterialIcons';
import { isNil } from 'lodash';

import { submitMood } from '../../../concepts/mood';
import Header from '../../common/Header';
import theme from '../../../style/theme';
import getVibeDescription from '../../../services/vibe-descriptions';


const { height, width } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';

const headerHeight = 60;
const footerHeight = 60;
const sliderHeight = height;
const scale = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

class MoodSlider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mood: null,
      bubblePosition: new Animated.Value(0),
      buttonScale: new Animated.Value(0),
      confirmScale: new Animated.Value(0),
      showConfirm: false,
      description: '',
    };

    this.moodSlider = this.moodSlider.bind(this);
    this.confirm = this.confirm.bind(this);
    this.submit = this.submit.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
  }



  componentDidMount() {

    setTimeout(() => {
      this.animateBubbles();
    }, 200);

  }

  animateBubbles() {
    const { mood } = this.state;
    const moodPercentage = (mood - footerHeight) / (sliderHeight - headerHeight - footerHeight);
    const speed = moodPercentage >= 0.95 ? 1500 : 3000;

    Animated.timing(
      this.state.bubblePosition,
      {
        toValue: 1,
        duration: speed,
        easing: Easing.linear
      }
      ).start(() => {
        Animated.timing(
          this.state.bubblePosition,
          {
            toValue: 0,
            duration: 0,
          }
          ).start(() => {
            this.animateBubbles(); // repeating
          });
        });
    }




  _panResponder = {};

  componentWillMount() {
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!

        this.moodSlider(gestureState.y0 - 10);

        // gestureState.d{x,y} will be set to zero now
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}

        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
        this.moodSlider(gestureState.moveY - 10);
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
    });
  }

  moodSlider(position) {
    const oldMood = this.state.mood;
    const mood = Math.max(
      footerHeight,
      Math.min(sliderHeight - position, sliderHeight - headerHeight)
    );

    this.setState({ mood, showConfirm: false });

    // Animate submit button
    if (isNil(oldMood)) {
      this.animateButton();
    }
  }

  animateButton() {
     Animated.spring(this.state.buttonScale, { toValue: 1, duration: 550 }).start();
  }

  confirm() {
    this.setState({ showConfirm: true });
    Animated.spring(this.state.confirmScale, { toValue: 1, duration: 200 }).start();
  }

  submit() {
    const { mood, description } = this.state;
    const { navigator } = this.props;
    const rating = parseInt((mood - footerHeight) / (sliderHeight - headerHeight - footerHeight) * 100, 10) / 10;

    const moodSubmitPackage = Object.assign(
      { rating },
      description ? { description } : {}
    );

    this.props.submitMood(moodSubmitPackage)
    .then(a => {
      navigator.pop();
    });

  }

  onChangeText(description) {
    this.setState({ description })
  }


  render() {

    const { mood, bubblePosition, showConfirm, buttonScale, confirmScale } = this.state;

    const bubbleVerticalPositions = [
      bubblePosition.interpolate({ inputRange: [0, 0.25, 0.5, 0.75, 1], outputRange: [100, 50, 20, -20, -40] }),
      bubblePosition.interpolate({ inputRange: [0, 0.25, 0.5, 0.75, 1], outputRange: [120, 110, 80, 50, 10] }),
      bubblePosition.interpolate({ inputRange: [0, 0.25, 0.5, 0.75, 1], outputRange: [200, 180, 140, 120, 80] })
    ]

    const bubbleHorizontalPositions = [
      bubblePosition.interpolate({ inputRange: [0, 0.25, 0.5, 0.75, 1], outputRange: [30, 22, 30, 24, 26] }),
      bubblePosition.interpolate({ inputRange: [0, 0.25, 0.5, 0.75, 1], outputRange: [10, 16, 10, 14, 12] }),
      bubblePosition.interpolate({ inputRange: [0, 0.25, 0.5, 0.75, 1], outputRange: [30, 22, 30, 24, 26] })
    ]

    const bubbleOpacity = [
      bubblePosition.interpolate({ inputRange: [0, 0.25, 0.5, 0.75, 1], outputRange: [0.8, 1, 0.4, 0.1, 0] }),
      bubblePosition.interpolate({ inputRange: [0, 0.25, 0.5, 0.75, 1], outputRange: [0, 0.5, 1, 0.6, 0] }),
      bubblePosition.interpolate({ inputRange: [0, 0.25, 0.5, 0.75, 1], outputRange: [0, 0, 1, 0.8, 0] })
    ];

    const sliderEffectiveHeight = sliderHeight - headerHeight - footerHeight - 5;

    const moodPercentage = (mood - footerHeight) / (sliderHeight - headerHeight - footerHeight);
    const moodResult = parseInt(moodPercentage * 100, 10);
    const vibeDescription = getVibeDescription(moodResult);

    return (
      <View style={styles.container}>

        {!isIOS && <Header backgroundColor={theme.secondary} title="Rate your Wappuvibe" navigator={this.props.navigator} />}


        {!showConfirm && mood !== null &&
          <Animated.View style={[styles.buttonWrap, { transform: [{ scale: buttonScale }] }]}>
            <TouchableHighlight underlayColor={'#f2f2f2'} onPress={this.confirm} style={styles.button}>
              <Text style={styles.buttonText}>
                <MdIcon size={30} name="keyboard-arrow-right" />
              </Text>
            </TouchableHighlight>
          </Animated.View>
        }

        {showConfirm &&
          <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={-40} style={styles.confirmForm}>

            <Animated.View style={[styles.confirmFormBg, { opacity: confirmScale, transform:[ { scale: confirmScale }] }]}>
            <TextInput
              autoFocus={false}
              multiLine={true}
              autoCapitalize={'sentences'}
              underlineColorAndroid={'transparent'}
              clearButtonMode={'while-editing'}
              returnKeyType={'send'}
              onSubmitEditing={this.submit}
              onChangeText={this.onChangeText}
              style={styles.inputField}
              numberOfLines={3}
              placeholderTextColor={'rgba(0,0,0, 0.3)'}
              placeholder="Describe Your Wappuvibe..."
              value={this.state.description}
            />

            <View style={styles.buttonWrap}>
              <TouchableHighlight underlayColor={theme.primary} onPress={this.submit} style={[styles.button, styles.submitButton]}>
                <Text style={[styles.buttonText, styles.submitButtonText]}>
                  <MdIcon size={30} name={'done'} />
                </Text>
              </TouchableHighlight>
            </View>
            </Animated.View>
          </KeyboardAvoidingView>

        }

        <View style={styles.main} {...this._panResponder.panHandlers}>
          {mood !== null
            ? <View style={styles.moodNumberWrap}>
                <Text style={[styles.moodNumber, moodPercentage >= 0.95 ? { color: theme.black } : {}]}>
                  {moodResult}<Text style={styles.decimals}>%</Text>
                </Text>
                <Text style={styles.vibeDescription}>"{vibeDescription}"</Text>
              </View>
            : <View style={styles.guideWrap}>
                <MdIcon style={styles.guideIcon} size={60} name="swap-vert" />
                <Text style={styles.guide}>Start by touching the screen...</Text>
              </View>
          }

          <View style={styles.yAxis}>
            {scale.map((i, index) =>
              <View key={i} style={[styles.axisLabel, {
                  bottom: sliderEffectiveHeight * (i * 10 / 100),
              }]}>
              <Text
                style={styles.axisLabelText}
              >
                {i * 10}
              </Text>
              </View>
            )}
          </View>

          {mood !== null &&
          <View style={[styles.moodSection, { height: mood }]}>
            <Animated.View style={[styles.moodSlide,
               { transform: [
                { rotate: bubblePosition.interpolate({ inputRange: [0, 0.5, 1], outputRange: ['-2.5deg', '2.5deg', '-2.5deg'] }) },
                { scale: bubblePosition.interpolate({ inputRange: [0, 0.25, 0.5, 0.75, 1], outputRange: [1, 1.02, 1, 0.98, 1] }) }] }
            ]} />

            <Animated.View style={[styles.raisin,
              { top: (mood / 2.5) + 50, transform: [
                { translateY: bubbleOpacity[1].interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 5, 0] }) },
                { rotate: bubbleOpacity[0].interpolate({ inputRange: [0, 0.5, 1], outputRange: ['-4deg', '0deg', '-4deg'] }) },
                { scale: bubbleOpacity[0].interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.03, 1] }) }] }]} >
              <Image style={{width: 70, height: 35 }} source={require('../../../../assets/raisin.png')} />
            </Animated.View>

            {isIOS &&
              <Animated.View style={[styles.raisin,
                { opacity: 0.2, left: 50, right: null, bottom: (mood / 1.5) + 160, transform: [
                  { translateY: bubbleOpacity[2].interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 5, 0] }) },
                  { rotate: bubbleOpacity[1].interpolate({ inputRange: [0, 0.5, 1], outputRange: ['-5deg', '0deg', '-5deg'] }) },
                  { scale: bubbleOpacity[2].interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.9, 0.85, 0.9] }) }] }]} >
                <Image style={{width: 70, height: 35 }} source={require('../../../../assets/raisin.png')} />
              </Animated.View>
            }


          {isIOS &&
            <Animated.View style={[styles.bubbleSet, { bottom: 100, left: width / 2 - 50, opacity: 1}]} >
              <Animated.View style={[styles.bubble, { width: 30, height: 30, borderRadius: 15, transform: [{ translateX: bubbleHorizontalPositions[0] }, { translateY: bubbleVerticalPositions[0] }], opacity: bubbleOpacity[0], borderWidth: 4, borderTopWidth:5, borderRightWidth:6, backgroundColor:'rgba(255,255,255, .3)'}]} />
              <Animated.View style={[styles.bubble, { width: 28, height: 28, borderRadius: 14, transform: [{ translateX: bubbleHorizontalPositions[1] }, { translateY: bubbleVerticalPositions[1] }], opacity: bubbleOpacity[1], borderWidth: 5, borderTopWidth:6, borderRightWidth:7, backgroundColor:'rgba(255,255,255, .3)'}]} />
              <Animated.View style={[styles.bubble, { width: 30, height: 30, borderRadius: 15, transform: [{ translateX: bubbleHorizontalPositions[2] }, { translateY: bubbleVerticalPositions[2] }], opacity: bubbleOpacity[2], borderWidth: 6, borderTopWidth:7, borderRightWidth:8, backgroundColor:'rgba(255,255,255, .3)'}]} />
            </Animated.View>
          }

          {isIOS &&
            <Animated.View style={[styles.bubbleSet, { top: width / 1.5 , left: width / 4 - 30, opacity: 1}]} >
              <Animated.View style={[styles.bubble, { width: 15, height: 15, borderRadius: 8, transform: [{ translateX: bubbleHorizontalPositions[2] }, { translateY: bubbleVerticalPositions[1] }], opacity: bubbleOpacity[0], borderWidth: 4, borderTopWidth:5, borderRightWidth:6, backgroundColor:'rgba(255,255,255, .3)'}]} />
              <Animated.View style={[styles.bubble, { width: 33, height: 33, borderRadius: 17, transform: [{ translateX: bubbleHorizontalPositions[0] }, { translateY: bubbleVerticalPositions[2] }], opacity: bubbleOpacity[1], borderWidth: 5, borderTopWidth:6, borderRightWidth:7, backgroundColor:'rgba(255,255,255, .3)'}]} />
            </Animated.View>
          }

          {isIOS &&
            <Animated.View style={[styles.bubbleSet, { top: width, left: width / 2 - 50, opacity: 1} ]} >
              <Animated.View style={[styles.bubble, { width: 10, height: 10, borderRadius: 5,  transform: [{ translateX: bubbleHorizontalPositions[1] }, { translateY: bubbleVerticalPositions[1] }], opacity: bubbleOpacity[2], borderWidth: 4, borderTopWidth:5, borderRightWidth:5, backgroundColor:'rgba(255,255,255, .25)'}]} />
              <Animated.View style={[styles.bubble, { width: 20, height: 20, borderRadius: 10, transform: [{ translateX: bubbleHorizontalPositions[2] }, { translateY: bubbleVerticalPositions[2] }], opacity: bubbleOpacity[1], borderWidth: 4, borderTopWidth:5, borderRightWidth:5, backgroundColor:'rgba(255,255,255, .25)'}]} />
              <Animated.View style={[styles.bubble, { width: 10, height: 10, borderRadius: 5, transform: [{ translateX: bubbleHorizontalPositions[0] }, { translateY: bubbleVerticalPositions[0] }], opacity: bubbleOpacity[0], borderWidth: 4, borderTopWidth:5, borderRightWidth:5, backgroundColor:'rgba(255,255,255, .25)'}]} />
            </Animated.View>
          }

          {isIOS &&
            <Animated.View style={[styles.bubbleSet, { top: 0, left: width / 1.5 - 50, opacity: 1} ]} >
              <Animated.View style={[styles.bubble, { width: 20, height: 20, borderRadius: 10,  transform: [{ translateX: bubbleHorizontalPositions[1] }, { translateY: bubbleVerticalPositions[2] }], opacity: bubbleOpacity[1], borderWidth: 4, borderTopWidth:5, borderRightWidth:6, backgroundColor:'rgba(255,255,255, .3)'}]} />
              <Animated.View style={[styles.bubble, { width: 30, height: 30, borderRadius: 15, transform: [{ translateX: bubbleHorizontalPositions[2] }, { translateY: bubbleVerticalPositions[0] }], opacity: bubbleOpacity[2], borderWidth: 5, borderTopWidth:6, borderRightWidth:7, backgroundColor:'rgba(255,255,255, .3)'}]} />
              <Animated.View style={[styles.bubble, { width: 10, height: 10, borderRadius: 5, transform: [{ translateX: bubbleHorizontalPositions[0] }, { translateY: bubbleVerticalPositions[1] }], opacity: bubbleOpacity[0], borderWidth: 6, borderTopWidth:7, borderRightWidth:8, backgroundColor:'rgba(255,255,255, .3)'}]} />
            </Animated.View>
          }

          {isIOS &&
            <Animated.View style={[styles.bubbleSet, { top: 150, left: width - 100, opacity: 1}]} >
              <Animated.View style={[styles.bubble, { width: 10, height: 10, borderRadius: 5,  transform: [{ translateX: bubbleHorizontalPositions[2] }, { translateY: bubbleVerticalPositions[1] }], opacity: bubbleOpacity[1], borderWidth: 4, borderTopWidth:5, borderRightWidth:6, backgroundColor:'rgba(255,255,255, .2)'}]} />
              <Animated.View style={[styles.bubble, { width: 15, height: 15, borderRadius: 7, transform: [{ translateX: bubbleHorizontalPositions[1] }, { translateY: bubbleVerticalPositions[0] }], opacity: bubbleOpacity[2], borderWidth: 5, borderTopWidth:6, borderRightWidth:7, backgroundColor:'rgba(255,255,255, .4)'}]} />
              <Animated.View style={[styles.bubble, { width: 13, height: 13, borderRadius: 8, transform: [{ translateX: bubbleHorizontalPositions[0] }, { translateY: bubbleVerticalPositions[2] }], opacity: bubbleOpacity[0], borderWidth: 6, borderTopWidth:7, borderRightWidth:8, backgroundColor:'rgba(255,255,255, .3)'}]} />
            </Animated.View>
          }

          </View>
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#eee',
  },
  main: {
    flexGrow: 1,
    backgroundColor: '#eee',
    width,
    overflow: 'hidden',
    // alignItems: 'center',
    justifyContent: 'center',
  },

  moodSection: {
    position: 'absolute',
    left: -10,
    right: -10,
    bottom: -10,
    zIndex: 1,
    overflow: 'hidden',
    borderTopWidth: 2,
    borderColor: '#fff',
    backgroundColor: theme.simaDark
  },

  moodSlide: {
    backgroundColor: theme.sima,
    flexGrow: 1,
    borderTopWidth: 2,
    borderColor: theme.simaDark,
  },

  raisin: {
    opacity: 0.3,
    zIndex:10,
    position: 'absolute',
    top: height - 380,
    backgroundColor: 'transparent',
    width: 70,
    height: 40,
    right: 100,
    zIndex: 9,
  },

  bubbleSet: {
    width: width / 1.5,
    height: height / 1.3,
    overflow: 'visible',
    position:'absolute',
    zIndex: 10,
  },

  bubble: {
    position:'absolute',
    borderColor: 'rgba(255, 255, 255, .05)'
  },
  moodNumberWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    flexGrow: 1,
    // top: -100,
    // right: (width / 2) - 80,z
    backgroundColor: 'transparent',
    zIndex: 9,
  },
  moodNumber: {
    backgroundColor: 'transparent',
    fontSize: 90,
    textAlign: 'right',
    fontWeight: '100',
    fontFamily: !isIOS ? 'sans-serif-light' : undefined,
    color: 'rgba(0,0,0,.5)',
  },
  vibeDescription: {
    fontSize: 12,
    opacity: 0.8,
    backgroundColor: 'transparent',
  },
  decimals: {
    color: 'rgba(0,0,0,.3)',
    fontSize: 90,
    fontWeight: '100',
    textAlign: 'right',
    marginLeft: 10
  },
  guideWrap: {
    flexDirection: 'column',
    alignItems: 'center',
    opacity: 0.6
  },
  guideIcon: {
    zIndex: 2,
    backgroundColor: 'transparent',
    fontSize: 110,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    color: theme.secondaryLight
  },
  guide: {
    zIndex: 2,
    backgroundColor: 'transparent',
    fontSize: 15,
    top: 0, // height / 2 - headerHeight,
    textAlign: 'center',
    fontWeight: 'bold',
    color: theme.secondaryLight
  },
  yAxis: {
    position: 'absolute',
    left: 0,
    width: 38,
    top: 0,
    bottom: footerHeight - 15,
    zIndex: 2
  },
  axisLabel: {
    position: 'absolute',
    left: 0,
    right: 0,
    flex: 1,
    paddingTop: 5,
    alignItems: 'center',
    // borderTopWidth: 1,
    // opacity: 1,
    // borderStyle: 'solid'
  },
  axisLabelText: {
    backgroundColor: 'transparent',
    fontSize: 10,
    fontWeight: 'bold',
    color: 'rgba(0,0,0,.4)',
  },
  buttonWrap: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    height: 54,
    width: 54,
    borderRadius: 27,
    zIndex: 9,
  },
  button: {
    backgroundColor: theme.stable,
    height: 66,
    width: 66,
    borderRadius: 33,
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.075,
    shadowRadius: 1,
    shadowOffset: {
      height: 2,
      width: 0
    },
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    backgroundColor: 'transparent',
    fontSize: 25,
    fontWeight: 'bold',
    color: theme.primary
  },
  submitButton: {
    backgroundColor: theme.primaryLight,
  },
  submitButtonText: {
    color: theme.white,
  },
  confirmForm: {
    backgroundColor: theme.white,
    position: 'absolute',
    // width: 60,
    height: 100,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 8,
    justifyContent: 'center'
  },
  confirmFormBg: {
    height: 100,
    backgroundColor: theme.white,
    justifyContent: 'center',
    paddingRight: 120,
  },
  inputField: {
    backgroundColor: theme.lightgrey,
    height: 40,
    fontSize: 14,
    position: 'relative',
    borderRadius: 5,
    padding: 10,
    left: 15,
  }
});

const mapDispatchToProps = { submitMood };
const mapStateToProps = state => ({});

export default connect(mapStateToProps, mapDispatchToProps)(MoodSlider);

