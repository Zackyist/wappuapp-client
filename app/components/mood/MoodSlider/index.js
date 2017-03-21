import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  Image,
  TouchableHighlight,
  Dimensions,
  Animated,
  Easing,
  PanResponder,
  Platform
} from 'react-native';

const { height, width } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';

const headerHeight = 60;
const sliderHeight = height;

const theme = {
  primary: '#00d7d2',
  secondary: '#ec449c',
  beer: '#e5a74b',
  beerDark: '#e29816',
  beerLight: 'rgba(229, 167, 75, .8)',
}

class MoodSlider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mood: null,
      bubblePosition: new Animated.Value(0)
    };
    this.moodSlider = this.moodSlider.bind(this);
    this.submit = this.submit.bind(this);
  }



  componentDidMount() {

    setTimeout(() => {
      this.animateBubbles();
    }, 200);

  }

  animateBubbles() {
    Animated.timing(
      this.state.bubblePosition,
      {
        toValue: 1,
        duration: 3000,
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

        this.moodSlider(gestureState.y0/* + headerHeight / 2*/);

        // gestureState.d{x,y} will be set to zero now
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}

        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
        this.moodSlider(gestureState.moveY/* + headerHeight / 2*/);
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
    const mood = Math.max(
      0,
      Math.min(sliderHeight - position, sliderHeight - headerHeight)
    );
    this.setState({ mood });
  }

  submit() {
    alert('test');
  }

  render() {

    const { mood, bubblePosition } = this.state;

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

    const moodPercentage = mood / (sliderHeight - headerHeight);

    const moodNumber = parseInt(moodPercentage * 10);
    const moodDecimals = parseInt(((moodPercentage * 10) - moodNumber).toFixed(2) * 100);
    const moodResult = parseInt(moodPercentage * 100, 10);

    return (
      <View style={styles.container}>
        {/*<View style={styles.header}><Text style={styles.headerTitle}>How Wappu?</Text></View>*/}

        <View style={styles.main} {...this._panResponder.panHandlers}>
          {mood !== null
            ? <Text style={styles.moodNumber}>{moodResult}<Text style={styles.decimals}>%</Text></Text>
            : <Text style={styles.guide}>Start by dragging your finger on the screen..</Text>
          }
          {mood !== null &&
          <View style={[styles.moodSection, { height: mood }]}>
            <TouchableHighlight onPress={this.submit} style={styles.button}><Text style={styles.buttonText}>Submit {moodResult}%</Text></TouchableHighlight>
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

            {/*
            <Animated.View style={[styles.foam, { left: 10, marginTop: 30, transform: [{ scale: bubbleOpacity[1].interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.6, 0.67, 0.6] }) }]}]} />

            <Animated.View style={[styles.foam, { left: -10, marginTop: 5, transform: [{ scale: bubbleOpacity[2].interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.05, 1] }) }]}]} />
            <Animated.View style={[styles.foam, { left: 30, marginTop: 0, transform: [{ scale: bubbleOpacity[0].interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.94, 1, 0.94] }) }]}]} />
            <Animated.View style={[styles.foam, { left: 70, marginTop: -2, transform: [{ scale: bubbleOpacity[1].interpolate({ inputRange: [0, 0.75, 1], outputRange: [1, 1.06, 1] }) }] }]} />
            <Animated.View style={[styles.foam, { left: 190, marginTop: -6, transform: [{ scale: bubbleOpacity[2].interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.99, 1.03, 0.99] }) }] }]} />
            <Animated.View style={[styles.foam, { left: 250, marginTop: -4, transform: [{ scale: bubbleOpacity[1].interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.95, 1, 0.95] }) }] }]} />
            <Animated.View style={[styles.foam, { left: 310, marginTop: -3, transform: [{ scale: bubbleOpacity[2].interpolate({ inputRange: [0, 0.25, 1], outputRange: [1, 1.04, 1] }) }] }]} />
            <Animated.View style={[styles.foam, { left: 380, marginTop: -2, transform: [{ scale: bubbleOpacity[0].interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.03, 1] }) }] }]} />
            <Animated.View style={[styles.foam, { left: 450, marginTop: 1, transform: [{ scale: bubbleOpacity[1].interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.2, 1] }) }] }]} />
            */}

            {/*
            <Animated.View style={[styles.waveSet, { transform: [{ translateX: bubblePosition.interpolate({ inputRange: [0, 1], outputRange: [-width, width - 100] }) }] }]} >
              <Animated.View style={[styles.wave, { marginLeft: (- width + 10), transform: [{ scale: bubbleOpacity[1].interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.01, 1] }) }] }]} />
              <Animated.View style={[styles.wave, styles.waveLeft, { marginLeft: (- width - 100), transform: [{ scale: bubbleOpacity[1].interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.01, 1] }) }] }]} />
              <Animated.View style={[styles.wave, { transform: [{ scale: bubbleOpacity[1].interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.01, 1] }) }] }]} />
              <Animated.View style={[styles.wave, styles.waveLeft, { transform: [{ scale: bubbleOpacity[1].interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.01, 1] }) }] }]} />
            </Animated.View>
            */
            }

            <Animated.View style={[styles.bubbleSet, { bottom: 100, left: width / 2 - 50, opacity: 1}]} >
              <Animated.View style={[styles.bubble, { width: 30, height: 30, borderRadius: 15, transform: [{ translateX: bubbleHorizontalPositions[0] }, { translateY: bubbleVerticalPositions[0] }], opacity: bubbleOpacity[0], borderWidth: 4, borderTopWidth:5, borderRightWidth:6, backgroundColor:'rgba(255,255,255, .3)'}]} />
              <Animated.View style={[styles.bubble, { width: 28, height: 28, borderRadius: 14, transform: [{ translateX: bubbleHorizontalPositions[1] }, { translateY: bubbleVerticalPositions[1] }], opacity: bubbleOpacity[1], borderWidth: 5, borderTopWidth:6, borderRightWidth:7, backgroundColor:'rgba(255,255,255, .3)'}]} />
              <Animated.View style={[styles.bubble, { width: 30, height: 30, borderRadius: 15, transform: [{ translateX: bubbleHorizontalPositions[2] }, { translateY: bubbleVerticalPositions[2] }], opacity: bubbleOpacity[2], borderWidth: 6, borderTopWidth:7, borderRightWidth:8, backgroundColor:'rgba(255,255,255, .3)'}]} />
            </Animated.View>

            <Animated.View style={[styles.bubbleSet, { top: width / 4, left: width / 4 - 50, opacity: 1}]} >
              <Animated.View style={[styles.bubble, { width: 15, height: 15, borderRadius: 8, transform: [{ translateX: bubbleHorizontalPositions[2] }, { translateY: bubbleVerticalPositions[1] }], opacity: bubbleOpacity[0], borderWidth: 4, borderTopWidth:5, borderRightWidth:6, backgroundColor:'rgba(255,255,255, .3)'}]} />
              <Animated.View style={[styles.bubble, { width: 33, height: 33, borderRadius: 17, transform: [{ translateX: bubbleHorizontalPositions[0] }, { translateY: bubbleVerticalPositions[2] }], opacity: bubbleOpacity[1], borderWidth: 5, borderTopWidth:6, borderRightWidth:7, backgroundColor:'rgba(255,255,255, .3)'}]} />
            </Animated.View>

            <Animated.View style={[styles.bubbleSet, { top: 0, left: width / 1.5 - 50, opacity: 1} ]} >
              <Animated.View style={[styles.bubble, { width: 20, height: 20, borderRadius: 10,  transform: [{ translateX: bubbleHorizontalPositions[1] }, { translateY: bubbleVerticalPositions[2] }], opacity: bubbleOpacity[1], borderWidth: 4, borderTopWidth:5, borderRightWidth:6, backgroundColor:'rgba(255,255,255, .3)'}]} />
              <Animated.View style={[styles.bubble, { width: 30, height: 30, borderRadius: 15, transform: [{ translateX: bubbleHorizontalPositions[2] }, { translateY: bubbleVerticalPositions[0] }], opacity: bubbleOpacity[2], borderWidth: 5, borderTopWidth:6, borderRightWidth:7, backgroundColor:'rgba(255,255,255, .3)'}]} />
              <Animated.View style={[styles.bubble, { width: 10, height: 10, borderRadius: 5, transform: [{ translateX: bubbleHorizontalPositions[0] }, { translateY: bubbleVerticalPositions[1] }], opacity: bubbleOpacity[0], borderWidth: 6, borderTopWidth:7, borderRightWidth:8, backgroundColor:'rgba(255,255,255, .3)'}]} />
            </Animated.View>


            <Animated.View style={[styles.bubbleSet, { top: 150, left: width - 100, opacity: 1}]} >
              <Animated.View style={[styles.bubble, { width: 10, height: 10, borderRadius: 5,  transform: [{ translateX: bubbleHorizontalPositions[2] }, { translateY: bubbleVerticalPositions[1] }], opacity: bubbleOpacity[1], borderWidth: 4, borderTopWidth:5, borderRightWidth:6, backgroundColor:'rgba(255,255,255, .2)'}]} />
              <Animated.View style={[styles.bubble, { width: 15, height: 15, borderRadius: 7, transform: [{ translateX: bubbleHorizontalPositions[1] }, { translateY: bubbleVerticalPositions[0] }], opacity: bubbleOpacity[2], borderWidth: 5, borderTopWidth:6, borderRightWidth:7, backgroundColor:'rgba(255,255,255, .4)'}]} />
              <Animated.View style={[styles.bubble, { width: 13, height: 13, borderRadius: 8, transform: [{ translateX: bubbleHorizontalPositions[0] }, { translateY: bubbleVerticalPositions[2] }], opacity: bubbleOpacity[0], borderWidth: 6, borderTopWidth:7, borderRightWidth:8, backgroundColor:'rgba(255,255,255, .3)'}]} />
            </Animated.View>

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
    overflow: 'visible',
    borderTopWidth: 2,
    borderColor: '#fff',
    backgroundColor: theme.beerDark
    /*
    borderTopWidth: 3,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderColor: theme.beer,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    */
  },

  moodSlide: {
    backgroundColor: theme.beer,
    flexGrow: 1,
    borderTopWidth: 2,
    borderColor: theme.beerDark,
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

  foam: {
    elevation: 2,
    top: -25,
    left: 0,
    position: 'absolute',
    borderRadius: 25,
    height: 50,
    width: 50,
    backgroundColor: '#fafafa',
    zIndex: 9,
    borderWidth: 10,
    borderBottomWidth: 25,
    borderColor: '#fff',

  },

  waveSet: {
    position:'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },

  wave: {
    position:'absolute',
    left: (width - 100) / 4,
    right: 0,
    width: width + 50,
    height: width + 50,
    top: - (width + 50) + 20,
    zIndex: 0,
    backgroundColor: '#eee',
    borderRadius: (width + 50) / 2,
  },

  waveLeft: {
    position:'absolute',
    left: (-width - 75) / 4,
    top: -20,
    backgroundColor: theme.beer,
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

  moodNumber: {
    zIndex: 2,
    backgroundColor: 'transparent',
    fontSize: 90,
    top: -100,
    right: (width / 2) - 80,
    textAlign: 'right',
    fontWeight: '100',
    fontFamily: !isIOS ? 'sans-serif-light' : undefined,
    color: 'rgba(0,0,0,.5)'
  },
  decimals: {
    color: 'rgba(0,0,0,.3)',
    fontSize: 90,
    fontWeight: '100',
    textAlign: 'right',
    marginLeft: 10
  },
  guide: {
    zIndex: 2,
    backgroundColor: 'transparent',
    fontSize: 15,
    top: 0, // height / 2 - headerHeight,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#bbb'
  },
  button: {
    position: 'absolute',
    top: -20,
    height: 40,
    borderRadius: 20,
    width: width / 2,
    backgroundColor: theme.primary,
    zIndex: 9,
    left: width / 4,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    backgroundColor: 'transparent',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
  }
});

export default MoodSlider;

