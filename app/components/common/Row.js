'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  PropTypes
} from 'react-native';
import theme from '../../style/theme';
const IOS = Platform.OS === 'ios';
import Icon from 'react-native-vector-icons/Ionicons';


class Row extends Component {

  render() {
    const { title } = this.props;
    return (
    <View style={[styles.row, this.props.style]}>
      {this.props.icon && <View style={styles.rowIconContainer}>
        <Icon name={this.props.icon}  style={[styles.rowIcon, {color: theme.white}]} />
      </View>}

      <View style={styles.rowTextContainer}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.rowTitle}>{this.props.number}. </Text>
          <Text style={styles.rowTitle}>
            {title}
          </Text>
        </View>
        <Text style={styles.rowText}>
          {this.props.text}
        </Text>

        {this.props.secondaryText &&
          <Text style={[styles.rowText, styles.rowSecondaryText]}>
            {this.props.secondaryText}
          </Text>}

      </View>
    </View>);
  }
}

const styles = StyleSheet.create({
  row: {
    padding: 20,
    paddingLeft:15,
    paddingBottom: 20,
    flex: 1,
    flexDirection: 'row'
  },
  rowNumberContainer: {
    paddingLeft: 10,
    paddingTop:6,
    borderWidth:2,
    borderColor:theme.white,
    borderRadius:25,
    width:50,
    height:50,
    paddingRight: 10,
    top: 2
  },
  rowNumberText: {
    fontSize: 28,
    color: theme.white,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
    fontWeight: 'bold'
  },
  rowIconContainer: {
    width: 60,
    height: 60,
    backgroundColor:theme.primary,
    borderRadius:30,
    marginRight:5,
    marginLeft:10,
    justifyContent:'center'
  },
  rowIcon: {
    textAlign:'center',
    backgroundColor: 'rgba(0,0,0,0)',
    fontSize: 28
  },
  rowTextContainer: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20
  },
  rowTitle:{
    color: theme.white,
    fontWeight:'bold',
    fontSize: 18,
    marginBottom: 4,
  },
  rowText: {
    color: IOS ? '#555' : '#888',
    fontSize: 14,
    fontWeight: 'normal'
  },
  rowSecondaryText: {
    marginTop: 8
  }
});

export default Row;
