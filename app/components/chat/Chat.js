'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Platform,
} from 'react-native'

import {connect} from 'react-redux';
import autobind from 'autobind-decorator';

import theme from '../../style/theme';
import * from '../../actions/feed';

const IOS = Platform.OS === 'ios';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: theme.lightgrey
  },
  feedContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
  },
  listView: {
    flex: 1
  },
  actionButtons: {
    position: 'absolute',
    bottom: IOS ? 30 : 0,
    right: 0
  },

});

class Chat extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    //fetch messages etc
  }

  render() {
    return(

    )
  }
}

const mapDispatchToProps = {

}

const select = store => {

  return {

  }
}

export default connect(select, mapDispatchToProps)(Chat);
