'use strict';

import React, { Component, PropTypes } from 'react';
import { ToolbarAndroid, StyleSheet } from 'react-native';
import autobind from 'autobind-decorator';

import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../../style/theme';

// const toolbarActions = [
//   {title: 'Share', id:'share'}
// ];

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: 'rgba(0,0,0,.3)',
    position:'absolute',
    left:0,
    top:11,
    right:0,
    elevation:2,
    height: 56,
  }
});

class UserProfileToolbar extends Component {
  propTypes: {
    title: PropTypes.string.isRequired,
    navigator: PropTypes.object.isRequired,
  }

  onActionSelected(position) {
    //TODO switch toolbarActions[position]
  }

  render() {
    const { backgroundColor } = this.props;

    return (
      <Icon.ToolbarAndroid
      // actions={toolbarActions} TODO: SHARE
      // onActionSelected={this._onActionSelected}
      onIconClicked={this.props.closeModal}
      navIconName={'close'}
      titleColor={theme.light}
      iconColor={theme.light}
      style={[styles.toolbar, backgroundColor ? { backgroundColor } : {} ]}
      title={this.props.title}
      />
    );
  }
}

module.exports = UserProfileToolbar;