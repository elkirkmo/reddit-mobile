import mergeAPIModels from './helpers/mergeAPIModels';
import * as loginActions from 'app/actions/login';
import * as accountActions from 'app/actions/accounts';

const DEFAULT = {};

export default function(state=DEFAULT, action={}) {
  switch (action.type) {
    case loginActions.LOGGED_IN:
    case loginActions.LOGGED_OUT: {
      return DEFAULT;
    }

    case accountActions.RECEIVED_ACCOUNT: {
      let { accounts } = action.apiResponse;

      Object.keys(accounts).forEach(accountName => {
        const account = accounts[accountName];
        accounts[accountName] = account.set({
          features: {
            ...(account.features || {}),
            mweb_xpromo_interstitial_comments_android: {
              owner: 'channels',
              experiment_id: 137,
              variant: 'treatment',
            },
          },
        });
      });
      return mergeAPIModels(state, accounts);
    }

    default: return state;
  }
}
