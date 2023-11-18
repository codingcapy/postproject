function canEditPost(postCreatorId: number, user: Express.User | undefined) {
  return postCreatorId === user?.id || false;
}

function canEditComment(commentCreatorId: number, user: Express.User | undefined) {
  return  commentCreatorId === user?.id || false;
}

function isLoggedIn(user: Express.User | undefined) {
  return typeof user !== 'undefined' ? true : false;
}

export { canEditPost, canEditComment, isLoggedIn };
