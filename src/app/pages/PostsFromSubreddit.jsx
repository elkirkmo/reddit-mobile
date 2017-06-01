import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import CommunityHeader from 'app/components/CommunityHeader';
import LoadingXpromo from 'app/components/LoadingXpromo';
import PostsList from 'app/components/PostsList';
import NSFWInterstitial from 'app/components/NSFWInterstitial';
import SortAndTimeSelector from 'app/components/SortAndTimeSelector';
import SubNav from 'app/components/SubNav';
import Tutorial from 'app/components/Tutorial';
import XPromoListingClickModal from 'app/components/XPromoListingClickModal';

import PostsFromSubredditHandler from 'app/router/handlers/PostsFromSubreddit';
import { paramsToPostsListsId } from 'app/models/PostsList';

import isFakeSubreddit from 'lib/isFakeSubreddit';

const mapStateToProps = createSelector(
  (_, props) => props, // props is the page props splatted.
  state => state.postsLists,
  state => state.subreddits,
  state => state.preferences,
  state => state.modal.id,
  (state, pageProps) => {
    const { loading, loggedout, name } = state.user;
    if (loading || loggedout || state.accounts[name] === undefined) {
      return false;
    }

    const postsListParams = PostsFromSubredditHandler.pageParamsToSubredditPostsParams(pageProps);
    const isFrontPage = !postsListParams.subredditName;
    const hasSubscribed = state.accounts[name].hasSubscribed;

    return isFrontPage && !hasSubscribed;
  },
  (pageProps, postsLists, subreddits, preferences, modalId, shouldShowTutorial) => {
    const postsListParams = PostsFromSubredditHandler.pageParamsToSubredditPostsParams(pageProps);
    const postsListId = paramsToPostsListsId(postsListParams);
    const { subredditName } = postsListParams;

    return {
      postsListId,
      preferences,
      subredditName,
      modalId,
      postsList: postsLists[postsListId],
      subreddit: subreddits[subredditName],
      shouldShowTutorial,
    };
  },
);

// props is pageData
export const PostsFromSubredditPage = connect(mapStateToProps)(props => {
  const {
    postsListId,
    postsList,
    subredditName,
    subreddit,
    preferences,
    shouldShowTutorial,
  } = props;

  const showSubnav = !!postsList && !postsList.loading;
  const forFakeSubreddit = isFakeSubreddit(subredditName);
  const subnavLink = forFakeSubreddit ? null : {
    href: `/r/${subredditName}/about`,
    text: 'About this community',
  };

  const className = 'PostsFromSubredditPage';

  // If this subreddit is over18, then we need to show the NSFWInterstitial
  // before the user sees the actual content.
  // So if we haven't confirmed the users is over 18, wait until
  // the subreddit is loaded to check if we need to show the NSFWInterstitial.
  // We don't need to do this check for fakeSubreddits because individual posts
  // do their own NSFW bluring.
  if (!preferences.over18 && !forFakeSubreddit) {
    if (!subreddit) {
      // Show loading until we know the subreddit is over 18 or not
      return (
        <div className={ className }>
          <LoadingXpromo />
        </div>
      );
    }

    if (subreddit.over18) {
      return (
        <div className={ className } >
          <NSFWInterstitial />
        </div>
      );
    }
  }

  return (
    <div className={ className }>
      { !forFakeSubreddit ? <CommunityHeader subredditName={ subredditName } /> : null }
      { showSubnav ? renderSubNav(subnavLink) : null }
      { shouldShowTutorial
        ? <Tutorial />
        : <PostsList
          postsListId={ postsListId }
          subredditIsNSFW={ !!subreddit && subreddit.over18 }
          subredditShowSpoilers={ !!subreddit && subreddit.spoilersEnabled }
          />
      }
      <XPromoListingClickModal />
    </div>
  );
});

function renderSubNav(subnavLink) {
  return (
    <SubNav rightLink={ subnavLink } showWithoutUser={ true }>
      <SortAndTimeSelector />
    </SubNav>
  );
}
