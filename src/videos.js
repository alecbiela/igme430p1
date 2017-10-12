const crypto = require('crypto');

const videoQueue = {};
let etag = '';
let digest = '';

// updates a user in the data
// if the user does not exist, make a new one with that age
// Once altered, update the digest
// RETURNS: Whether the user was a new entry or not (t/f)
const updateVideo = (title, url) => {
  const newVideo = !(videoQueue[title]);
  videoQueue[title] = { url };
  etag = crypto.createHash('sha1').update(JSON.stringify(videoQueue));
  digest = etag.digest('hex');
  return newVideo;
};

// gets the object full of current videoQueue
const getVideoQueue = () => videoQueue;

// gets the current hash
const getHash = () => digest;

// only want to be able to update the user and get object back
module.exports = {
  updateVideo,
  getVideoQueue,
  getHash,
};
