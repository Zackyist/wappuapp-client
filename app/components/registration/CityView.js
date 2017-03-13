'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView
} from 'react-native';
import theme from '../../style/theme';
import Row from '../../components/common/Row';
import Icon from 'react-native-vector-icons/Ionicons';

const IOS = Platform.OS === 'ios';

class IntroView extends Component {
  render() {
    const { selectedCity } = this.props;
    return (
      <View style={styles.container}>
        <ScrollView style={{flex:1, width: null, height: null}}>
          <View style={styles.container}>
            <Text style={styles.header}>
              Pick a city
            </Text>
            <Text style={styles.text}>
              City you select will have an effect on the feed. You may change your answer whenever you want.
            </Text>
            {this.props.cities.map((city, i) =>
              <TouchableOpacity
                key={i}
                onPress={() => this.props.onSelect(city.get('id'))}>
                <Row
                  title={city.get('name')}
                  selected={selectedCity === city.get('id')}
                  text={''}/>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 30,
    marginBottom: 40,
    alignSelf: 'stretch'
  },
  header: {
    fontWeight: 'bold',
    color: theme.secondary,
    marginTop: 30,
    marginLeft: IOS ? 25 : 15,
    fontSize: 28
  },
  text: {
    padding: 20,
  },
  row: {
    padding: 20,
    paddingLeft:15,
    paddingBottom: 25,
    flex: 1,
    flexDirection: 'row'
  },
});

export default IntroView;
