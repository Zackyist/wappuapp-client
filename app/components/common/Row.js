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
    const { selected } = this.props;
    return (
    <View style={[styles.row, this.props.style]}>
      {this.props.icon && <View style={styles.rowIconContainer}>
        <Icon name={this.props.icon}  style={[styles.rowIcon, {color: theme.light}]} />
      </View>}

      <View style={styles.rowTextContainer}>
        <Text style={styles.rowTitle}>
          {this.props.title}
        </Text>
        <Text style={styles.rowText}>
          {this.props.text}
        </Text>
        {selected && <Icon size={40} name={IOS ? 'ios-checkmark' : 'md-checkmark'} style={styles.rowCheck}/>}

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
    paddingBottom: 25,
    flex: 1,
    flexDirection: 'row'
  },
  rowNumberContainer: {
    paddingLeft: 10,
    paddingTop:6,
    borderWidth:2,
    borderColor:theme.secondary,
    borderRadius:25,
    width:50,
    height:50,
    paddingRight: 10,
    top: 2
  },
  rowNumberText: {
    fontSize: 28,
    color: theme.secondary,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
    fontWeight: 'bold'
  },
  rowIconContainer: {
    width: 50,
    height:50,
    backgroundColor:theme.secondary,
    borderRadius:25,
    marginRight:5,
    marginLeft:10,
    justifyContent:'center'
  },
  rowIcon: {
    textAlign:'center',
    color: theme.white,
    backgroundColor: 'rgba(0,0,0,0)',
    fontSize: 24
  },
  rowTextContainer: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20
  },
  rowTitle:{
    color: theme.secondary,
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
  },
  rowCheck: {
    position: 'absolute',
    right: 10,
    color: IOS ? '#555' : '#888',
  }
});

export default Row;
