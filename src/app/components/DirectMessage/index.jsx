import './styles.less';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import * as mailActions from 'app/actions/mail';

import DirectMessageHeader from './Header';
import DirectMessageComposition from './Composition';

const T = React.PropTypes;

export function DirectMessage(props) {
  return (
    <div className='DirectMessage'>
      <div className='DirectMessage__header'>
        <DirectMessageHeader/>
      </div>
      <div className='DirectMessage__body'>
        <DirectMessageComposition
          onSubmit={ props.onFormSubmit }
          username={ props.user.name }
          recipient={ props.recipient }
          subject={ props.subject }
          message={ props.message }
        />
      </div>
    </div>
  );
}

DirectMessage.propTypes = {
  user: T.object.isRequired,
  recipient: T.string,
  subject: T.string,
  message: T.string,
};

DirectMessage.defaultProps = {
  recipient: '',
  subject: '',
  message: '',
};

const selector = createSelector(
  state => state.user,
  user => ({ user })
);

const mapDispatchToProps = dispatch => ({
  onFormSubmit: data => dispatch(mailActions.postMessage(data)),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  recipient: ownProps.queryParams.to,
  subject: ownProps.queryParams.subject,
  message: ownProps.queryParams.message,
});

export default connect(selector, mapDispatchToProps, mergeProps)(DirectMessage);
