// // @ts-nocheck
const users = {
  1: {
    id: 1,
    uname: "alice",
    password: "alpha",
  },
  2: {
    id: 2,
    uname: "theo",
    password: "123",
  },
  3: {
    id: 3,
    uname: "prime",
    password: "123",
  },
  4: {
    id: 4,
    uname: "leerob",
    password: "123",
  },
};

const posts = {
  101: {
    id: 101,
    title: "Mochido opens its new location in Coquitlam this week",
    link: "https://dailyhive.com/vancouver/mochido-coquitlam-open",
    description:
      "New mochi donut shop, Mochido, is set to open later this week.",
    creator: 1,
    subgroup: "food",
    timestamp: 1643648446955,
  },
  102: {
    id: 102,
    title: "2023 State of Databases for Serverless & Edge",
    link: "https://leerob.io/blog/backend",
    description:
      "An overview of databases that pair well with modern application and compute providers.",
    creator: 4,
    subgroup: "coding",
    timestamp: 1642611742010,
  },
};

const comments = {
  9001: {
    id: 9001,
    post_id: 102,
    creator: 1,
    description: "Actually I learned a lot :pepega:",
    timestamp: 1642691742010,
  },
};

const votes = [
  { user_id: 2, post_id: 101, value: +1 },
  { user_id: 3, post_id: 101, value: +1 },
  { user_id: 4, post_id: 101, value: +1 },
  { user_id: 3, post_id: 102, value: -1 },
];

function debug() {
  console.log("==== DB DEBUGING ====");
  console.log("users", users);
  console.log("posts", posts);
  console.log("comments", comments);
  console.log("votes", votes);
  console.log("==== DB DEBUGING ====");
}

function getUser(id: number) : Express.User {
  return users[id as keyof typeof users];
}

function getUserByUsername(uname: string) : Express.User {
  return getUser(
    Object.values(users).filter((user) => user.uname === uname)[0].id
  );
}

function getVotesForPost(post_id: number) : Vote[] {
  return votes.filter((vote) => vote.post_id === post_id);
}

function decoratePost(post: Post) : DecoratedPost {
  const decoratedPost = {
    ...post,
    creator: users[post.creator as keyof typeof users],
    votes: getVotesForPost(post.id),
    comments: Object.values(comments)
      .filter((comment) => comment.post_id === post.id)
      .map((comment) => ({
        ...comment,
        creator: users[comment.creator as keyof typeof users],
      })),
  };
  return decoratedPost;
}

/**
 * @param {*} n how many posts to get, defaults to 5
 * @param {*} sub which sub to fetch, defaults to all subs
 */
function getPosts(n = 5, sub: string) {
  let allPosts = Object.values(posts);
  if (sub) {
    allPosts = allPosts.filter((post) => post.subgroup === sub);
  }
  const allPostsDisplay = allPosts.map((post) => ({
    ...post,
    username: getUser(post.creator).uname,
  }));
  allPostsDisplay.sort((a, b) => b.timestamp - a.timestamp);
  return allPostsDisplay.slice(0, n);
}

function getPost(id: number) {
  return decoratePost(posts[id as keyof typeof posts]);
}

function addPost(
  title: string,
  link: string,
  creator: number,
  description: string,
  subgroup: string
) : Post {
  let id = Math.max(...Object.keys(posts).map(Number)) + 1;
  let post = {
    id,
    title,
    link,
    description,
    creator,
    subgroup,
    timestamp: Date.now(),
  };
  posts[id as keyof typeof posts] = post;
  return post;
}

function editPost(
  post_id: number,
  changes: {
    title?: string;
    link?: string;
    description?: string;
    subgroup?: string;
  }
) {
  let post = posts[post_id as keyof typeof posts];
  if (changes.title) {
    post.title = changes.title;
  }
  if (changes.link) {
    post.link = changes.link;
  }
  if (changes.description) {
    post.description = changes.description;
  }
  if (changes.subgroup) {
    post.subgroup = changes.subgroup;
  }
}

function deletePost(post_id: number) {
  delete posts[post_id as keyof typeof posts];
}

function getSubs() {
  return Array.from(new Set(Object.values(posts).map((post) => post.subgroup)));
}

function addComment(post_id: number, creator: number, description: string) {
  let id = Math.max(...Object.keys(comments).map(Number)) + 1;
  let comment = {
    id,
    post_id: post_id,
    creator: creator,
    description,
    timestamp: Date.now(),
  };
  comments[id as keyof typeof comments] = comment;
  return comment;
}

function getCommentsByPostId(postId: number) : Comment[] {
  let allComments = Object.values(comments);
  allComments = allComments.filter((comment) => comment.post_id == postId);
  const allCommentsDisplay = allComments.map((comment) => ({
    ...comment,
    username: getUser(comment.creator).uname,
  }));
  allCommentsDisplay.sort((a, b) => b.timestamp - a.timestamp);
  return allCommentsDisplay;
}

function getComment(commentId: number) : Comment | null {
  if (commentId in comments) {
    const comment = comments[commentId as keyof typeof comments];
    const decoratedComment = {
      ...comment,
      username: getUser(comment.creator).uname,
    };
    return decoratedComment;
  } else return null;
}

export {
  debug,
  getUser,
  getUserByUsername,
  getPosts,
  getPost,
  addPost,
  editPost,
  deletePost,
  getSubs,
  addComment,
  decoratePost,
  getCommentsByPostId,
  getComment,
};
