function canEditPost(
  post: Post | DecoratedPost,
  user: Express.User | undefined
) {
  if (typeof post.creator === "number")
    return post.creator === user?.id || false;
  else return post.creator.id === user?.id || false;
}

function canEditComment(
  comment: Comment | DecoratedComment,
  user: Express.User | undefined
) {
  if (typeof comment.creator === "number")
    return comment.creator === user?.id || false;
  else return comment.creator.id === user?.id || false;
}

function isLoggedIn(user: Express.User | undefined) {
  return typeof user !== "undefined" ? true : false;
}

export { canEditPost, canEditComment, isLoggedIn };
