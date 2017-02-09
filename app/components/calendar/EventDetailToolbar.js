'use strict';

import React, { Component, PropTypes } from 'react';
import { ToolbarAndroid, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../../style/theme';

// TODO re-enable
// const toolbarActions = [
//   {title: 'Share', id:'share'}
// ];

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: 'rgba(206,62,138,.25)',
    position:'absolute',
    left:0,
    top:0,
    right:0,
    elevation:2,
    height: 56,
  }
});

class EventDetailToolbar extends Component {
  propTypes: {
    title: PropTypes.string.isRequired,
    navigator: PropTypes.object.isRequired
  }

  _goBack() {
    this.props.navigator.pop();
  }

  _onActionSelected(position) {
    //TODO switch toolbarActions[position]
  }

  render() {
    return (
      <Icon.ToolbarAndroid
      //actions={toolbarActions} TODO - SHARE
      //onActionSelected={this._onActionSelected}
      onIconClicked={this._goBack}
      navIconName={'arrow-back'}
      titleColor={theme.light}
      iconColor={theme.light}
      style={styles.toolbar}
      title={this.props.title}
      />
    );
  }
}

module.exports = EventDetailToolbar;
