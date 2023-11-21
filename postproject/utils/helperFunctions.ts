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

function sortPostBy(posts: DecoratedPost[], sortBy: string) : [DecoratedPost[], string] {
  if (sortBy === "top") {
    return [posts.sort((a, b) => b.score - a.score), "top"];
  }
  if (sortBy === "controversial") {
    return [posts.sort((a, b) => b.votes.length - a.votes.length), "controversial"];
  }
  if (sortBy === "hot") {
    return [posts.sort(
      (a, b) => b.score / b.votes.length - a.score / a.votes.length
    ), "hot"];
  }
  return [posts.sort((a, b) => b.timestamp - a.timestamp), "date"];
}

export { canEditPost, canEditComment, isLoggedIn, sortPostBy };
