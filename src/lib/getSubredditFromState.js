import get from 'lodash/get';

export default function getSubreddit(state) {
  if (state.platform.currentPage.urlParams.subredditName) {
    return state.platform.currentPage.urlParams.subredditName;
  }

  if (!state.platform.currentPage.urlParams.postId) {
    return null;
  }

  const current = state.commentsPages.data.current;
  if (!current) {
    return null;
  }

  const currentResults = state.commentsPages.data[current];
  if (!currentResults || currentResults.length === 0) {
    return null;
  }

  const comment = state.comments.data[currentResults[0].uuid];
  if (!comment) {
    return null;
  }

  return comment.subreddit;
}

export function getSubredditNamePrefixed(state) {
  const subredditName = getSubreddit(state);
  if (!subredditName) {
    return;
  }
  return get(state,
    `subreddits.${subredditName.toLowerCase()}.displayNamePrefixed`,
    `r/${subredditName}`,
  );
}
