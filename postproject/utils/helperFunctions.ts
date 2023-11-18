function canEditPost(postCreatorId: number, user: Express.User | undefined) {
  return postCreatorId === user?.id || false;
}

function isLoggedIn(user: Express.User | undefined) {
  return typeof user !== 'undefined' ? true : false;
}

export { canEditPost, isLoggedIn };
