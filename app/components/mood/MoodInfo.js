'use strict';

import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import theme from '../../style/theme';
import MDIcon from 'react-native-vector-icons/MaterialIcons';

class MoodInfo extends Component {
  render() {

    return (
      <ScrollView style={styles.container}>
        <View style={styles.iconWrap}>
          <View style={styles.iconCircle}>
            <MDIcon name="trending-up" style={styles.icon} />
          </View>
        </View>

        <Text style={styles.paragraph}>In practice, subjective fuzzy Wappu means that Wappu is not either binary true or false but each individual has their own Wappu feeling between the closed interval of <Text style={styles.bold}>[0, 100]</Text>. For instance, Wappu vibe of <Text style={styles.bold}>0%</Text> means that one has no Wappu feeling at all, <Text style={styles.bold}>71%</Text> means that one has quite awesome Wappu feeling already and <Text style={styles.bold}>100%</Text> means that one is going full ahead!</Text>

        <Text style={styles.paragraph}>The meaning of this Wappu vibe is to collect the feelings of Wappu-goers. Vibe data can be used to analyse the Wappu behaviour of different Wappu-subgroups. Ultimately, the meaning is to share great Wappu vibe with others.</Text>

        <Text style={styles.paragraph}>You can add one vibe per day. You will get information of the progress Wappu Vibe of your own, your team, your city. Start by <Text style={styles.bold}>adding your first vibe!</Text></Text>

      </ScrollView>
    );
  }
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    paddingTop: 10,
    paddingBottom: 50,
    backgroundColor: theme.secondary
  },
  paragraph: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 20,
    color: theme.white
  },
  bold: {
    fontWeight: 'bold'
  },
  iconWrap: {
    margin: 20,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    color: theme.accentLight,
    fontSize: 120,
    alignItems: 'center'
  }
});


export default MoodInfo;
