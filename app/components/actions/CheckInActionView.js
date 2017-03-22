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
  TouchableWithoutFeedback,
  Modal
} from 'react-native';
import moment from 'moment';
import location from '../../services/location';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';
import Icon from 'react-native-vector-icons/Ionicons';
import EventListItem from '../calendar/EventListItem';
import { checkIn, closeCheckInView } from '../../actions/competition';

import Button from '../../components/common/Button';
import CheckInButton from './CheckInButton';
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
    };
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
    });
  }

  getContent(events) {
    const currentTime = moment('2017-04-22T11:30:00.000Z');
    // const currentTime = moment();

    const activeEvents = events.filter((event) => {
      if (moment(event.get('startTime')).isBefore(currentTime) && moment(event.get('endTime')).isAfter(currentTime)) {
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
    return (
      <View style={styles.eventContainer}>
        <View style={styles.headerContainer}>
          <Icon name={IOS ? 'ios-pin' : 'md-pin'} style={{color: theme.white}} size={30}/>
          <Text style={styles.title}>CHECK IN</Text>
        </View>

        <View style={{height: 60}}>
          <Text style={[styles.text, {padding: 10}]}>You can only check-in to events if you are in the event area.</Text>
        </View>

        <ListView
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderHeader={this.renderHeader}
          stickyHeaderIndices={[0]}
          renderSectionHeader={this.renderSectionHeader}
          renderRow={this.renderListItem.bind(this)}
          style={styles.listView}
        />

        <TouchableWithoutFeedback onPress={this.props.closeCheckInView}>
          <View style={styles.cancelButton}>
            <Text style={{fontSize: 17, color: theme.white}}>CANCEL</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  renderListItem(item, sectionId, rowId) {
    const { userLocation, checkIn } = this.props;
    const eventLocation = {
      longitude: item.location.x,
      latitude: item.location.y
    }
    let validLocation = false;

    if ( userLocation && eventLocation ) {
      const distance = location.getDiscanceInMeters(userLocation, eventLocation);
      const radius = item.radius*1000;
      validLocation = radius > distance;
    }

    return (
      <View style={{marginBottom: 5}}>
        <EventListItem item={item} rowId={+rowId} hideStatus={true}/>
        <CheckInButton validLocation={validLocation} checkIn={() => checkIn(item.id)} />
      </View>);
  }

  renderHeader() {
    return (
      <View style={styles.listHeader}>
        <Text style={[styles.title, {fontSize: 20}]}>ONGOING</Text>
      </View>
    );

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:30,
  },
  modalBackgroundStyle: {
    backgroundColor: theme.secondary
  },
  eventContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1
  },
  headerContainer: {
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
  listHeader: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: theme.primaryDarker,
    alignSelf: 'stretch'
  },
  cancelButton: {
    position: 'relative',
    bottom: 15,
    padding: 5,
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: theme.primaryDarker,
    width: 120,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 1,
    shadowOffset: {
      height: 5,
      width: 0
    }
  },
  listView: {
    flexGrow: 1,
    marginTop: 0,
  }
});

const mapDispatchToProps = {
  checkIn,
  closeCheckInView,
};

const select = store => {
  return {
    isCheckInViewOpen: store.competition.get('isCheckInViewOpen'),
    events: store.event.get('list'),
    userLocation: store.location.get('currentLocation')
  };
};

export default connect(select, mapDispatchToProps)(CheckInActionView);
