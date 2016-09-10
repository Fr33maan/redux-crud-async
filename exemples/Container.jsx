
import React, {Component, PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {findChannel, isFindingChannel, findChannels, isFindingChannels, createChannel} from '../actions'

class ChannelApp extends Component {

  componentDidMount() {
    this.props.actions.findChannels()
  }

  render() {
    const {actions, channels, isFindingChannels} = this.props;
    return (
      <div>

        {isFindingChannels && channels.length === 0 &&
          <h2>Loading...</h2>
        }
        {!isFindingChannels && channels.length === 0 &&
          <h2>Empty.</h2>
        }
        {channels.length > 0 &&
          <div style={{opacity: isFindingChannels ? 0.5 : 1}}>
            {channels.map((channel, i) =>
              <div key={i}> {channel.foo} </div>
            )}
          </div>
        }
      </div>
    )
  }
}

ChannelApp.propTypes = {
  actions          : PropTypes.object.isRequired,
  channel          : PropTypes.object.isRequired,
  isFindingChannel : PropTypes.bool.isRequired,
  channels         : PropTypes.array.isRequired,
  isFindingChannels: PropTypes.bool.isRequired
};
function mapStateToProps(state) {
  const props = {
    channel          : state.channel,
    isFindingChannel : state.isFindingChannel,
    channels         : state.channels,
    isFindingChannels: state.isFindingChannels
  };
  return props
}

function mapDispatchToProps(dispatch) {
  const actions = {
    findChannel,
    findChannels,
    createChannel
  }
  const actionMap = {
    actions: bindActionCreators(actions, dispatch)
  }
  return actionMap
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelApp)
