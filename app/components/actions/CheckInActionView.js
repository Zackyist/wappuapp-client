'use strict';

import React, { PropTypes, Component } from 'react';

import {
  View,
  Text,
  ListView,
  Platform,
  Dimensions,
  StyleSheet,
  BackAndroid,
  Modal
} from 'react-native';
import moment from 'moment';
import location from '../../services/location';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';
import Icon from 'react-native-vector-icons/Ionicons';
import EventListItem from '../calendar/EventListItem';

import Button from '../../components/common/Button';
import theme from '../../style/theme';
import * as CompetitionActions from '../../actions/competition';
const IOS = Platform.OS === 'ios';

const { width, height } = Dimensions.get('window');

class CheckInActionView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeContentWasFound: false,
      eventContent: [],
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2
      })
    }
  }

  componentWillReceiveProps({events}) {
    this.getContent(events);
  }

  componentDidMount(){
    BackAndroid.addEventListener('hardwareBackPress', () => {
      if (this.props.isCheckInViewOpen) {
        this.onCancel()
        return true;
      }
      return false;
    })
  }

  getContent(events) {
    const fakeNow = moment("2017-04-22T11:30:00.000Z");

    const activeEvents = events.filter((event) => {
      if (moment(event.get('startTime')).isBefore(fakeNow) && moment(event.get('endTime')).isAfter(fakeNow)) {
        return event;
      }
    });

    if (activeEvents.size > 0) {
      this.setState({
        eventContent: activeEvents,
        activeContentWasFound: true,
        dataSource: this.state.dataSource.cloneWithRows(activeEvents.toJS())
      });
    } else {
      this.setState({eventContent: events.get(0), activeContentWasFound: false});
    }
  }

  noActiveEventsView() {

    return (
      <View style={styles.eventContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.noActiveEventsText}>No active events nearby!</Text>
        </View>
        <View style={styles.rowContainer}>
          <View style={styles.iconContainer}>
            <Icon name={IOS ? 'ios-clock' : 'md-clock'}  size={50} style={{color: theme.light}} />
            <Icon name={IOS ? 'ios-locate' : 'md-locate'}  size={50} style={{color: theme.light}} />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>It's all about time & place!</Text>
            <Text style={styles.text}>You can check-in to currently ongoing events that have the same location as you.</Text>
          </View>

        </View>

      </View>
    );
  }

  renderEventList() {
    return (<View style={styles.eventContainer}>
      <View style={styles.headerContainer}>
        <Icon name={IOS ? 'ios-pin' : 'md-pin'} style={{color: theme.white}} size={30}/>
        <Text style={styles.title}>CHECK IN</Text>
      </View>
      <Text style={[styles.text, {textAlign: 'center'}]}>You can only check-in to events that if you are in the event area.</Text>
      <ListView
        enableEmptySections={true}
        dataSource={this.state.dataSource}
        renderSectionHeader={this.renderSectionHeader}
        renderRow={this.renderListItem}
        style={styles.listView}
      />

    </View>);
  }

  renderListItem(item, sectionId, rowId) {
    const currentDistance = null;
    return <View style={{height: 160}}>
      <EventListItem
        item={item}
        rowId={+rowId}
        currentDistance={currentDistance}
      />
      <View style={styles.button}>
        <Icon size={30} name={'ios-checkmark'} style={{color: 'white', marginRight: 5}}/>
        <Text style={{fontSize: 12, textAlign: 'center', color: theme.white}}>CHECK IN</Text>
      </View>
    </View>;
  }

  render() {

    const { isCheckInViewOpen, events } = this.props;

    if (!isCheckInViewOpen) {
      return false;
    }

    return (
      <Modal
        // onRequestClose={this.props.closeCheckInView}
        visible={isCheckInViewOpen}
        animationType={'slide'}
      >
        <View style={[styles.container, styles.modalBackgroundStyle]}>
          {this.state.activeContentWasFound ?
            this.renderEventList()
            :
            this.noActiveEventsView()}
        </View>
      </Modal>
    );
  }
}

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:0,
    paddingBottom:IOS ? 39 : 0
  },
  modalBackgroundStyle: {
    backgroundColor: theme.secondary
  },
  eventContainer: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  noActiveEventsText: {
    fontSize: 27,
    color: theme.light,
    textAlign: 'center',
    fontWeight: 'bold'
  },

  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center'
  },
  textContainer: {
    flex: 5,
    paddingTop: 5,
    paddingLeft: 15,
    alignSelf:'stretch',
  },
  title: {
    color: theme.light,
    fontWeight: 'bold',
    paddingLeft: 10,
    fontSize: 30,
  },
  text: {
    color: theme.light
  },
  header: {
    fontSize: 30,
    color: theme.light,
    textAlign: 'center'
  },
  listView: {
    flexGrow: 1,
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems:'center',
    borderWidth: 2,
    borderColor: theme.white,
    height: 40,
    width: 120,
    position: 'absolute',
    bottom: 10,
    right: 10,
    overflow: 'hidden',
    padding: 2,
    justifyContent: 'center',
    backgroundColor: theme.primaryDarker,
  }
});

const select = store => {
  return {
    isCheckInViewOpen: store.competition.get('isCheckInViewOpen'),
    events: store.event.get('list'),
    userLocation: store.location.get('currentLocation')
  };
};

export default connect(select)(CheckInActionView);
