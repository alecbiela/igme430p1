const videoDB = require('./videos.js');
const url = require('url');
const query = require('querystring');

// sends response back to client
const sendResponse = (req, res, data, status) => {
  const headers = {
    'Content-Type': 'application/json',
    etag: videoDB.getHash,
  };
  // write response using data passed in
  res.writeHead(status, headers);
  res.write(JSON.stringify(data));
  res.end();
};

// sends headers only back to the client
const sendResponseMeta = (req, res, status) => {
  const headers = {
    'Content-Type': 'application/json',
    etag: videoDB.getHash,
  };

  // send message without body
  res.writeHead(status, headers);
  res.end();
};


// gets users and returns them if the DB has not changed
const getVideoQueue = (req, res) => {
  // check if we're trying to get the same file
  if (req.headers['if-none-match'] === videoDB.getHash()) {
    // return 304 (not modified)
    return sendResponseMeta(req, res, 304);
  }

  // if not, send the users back
  return sendResponse(req, res, videoDB.getVideoQueue(), 200);
};

// gets meta data about the users object (no body)
const getVideoQueueMeta = (req, res) => {
  // check if we're trying to get the same file
  if (req.headers['if-none-match'] === videoDB.getHash()) {
    // return 304 (not modified)
    return sendResponseMeta(req, res, 304);
  }

  // if not, send 200 (success) back
  return sendResponseMeta(req, res, 200);
};

// updates a user in the DB
const updateVideo = (req, res, body) => {
  // set up object, by default bad request
  const resObj = {
    message: 'The Link URL MUST be to youtube.com.',
  };

    // check to make sure Title and URL are defined
  if (!body.title || !body.vidUrl) {
    resObj.id = 'missingParams';
    resObj.message = 'You must fill out both title and url!';
    return sendResponse(req, res, resObj, 400);
  }

  // validate body URL
  const pUrl = url.parse(body.vidUrl);
  if (pUrl.hostname !== 'www.youtube.com') {
    resObj.id = 'badWebsite';
    return sendResponse(req, res, resObj, 400);
  }

  // add/update user
  // if this returns true, the added user was NEW, and should return 201 (created)
  // or else, return 204 (updated)
  if (videoDB.updateVideo(body.title, body.vidUrl)) {
    resObj.message = 'Created Successfully';
    return sendResponse(req, res, resObj, 201);
  }

  // 204 has no response data, so we just send head back
  return sendResponseMeta(req, res, 204);
};

//updates a vote in the userDB
const updateVote = (req, res, body) => {
  //decide if user already voted
  const pUrl = url.parse(body.vidUrl);
  const id = query.parse(pUrl.query);  
  const cookies = req.headers.cookie;
  let cookiesJSON = query.parse(cookies, ';');
  console.dir(cookiesJSON);
  
  //user has already voted on video, send back message and do not vote
  if(cookiesJSON.id) {
    const resObj = {
	  id: 'rateLimit',
	  message: 'You have already voted on this video!'	
	};	 
    return sendResponse(req, res, resObj, 200);	
  }
  
  //vote and set cookie
  videoDB.updateVote(body.vidUrl, body.direction); 
  res.setHeader("Set-Cookie", [`${id.v}=voted`]);
  
  //respond 204 (updated)
  return sendResponseMeta(req, res, 204);
};

// 404 (Not Found) with error message
const notFound = (req, res) => {
  const tmp = {
    message: 'The page you were looking for was not found.',
    id: 'notFound',
  };
  return sendResponse(req, res, tmp, 404);
};

// 404 (Not Found) with NO Message
const notFoundMeta = (req, res) => {
  sendResponseMeta(req, res, 404);
};

//if the user has already voted, send back 200 but message that they already voted
const alreadyVoted = (req, res) => {
  const resObj = {
	  id: 'rateLimit',
	  message: 'You have already voted on this video!'
  };
  return sendResponse(req, res, resObj, 200);
};

// export only calls to pages, not the inner workings
module.exports = {
  getVideoQueue,
  getVideoQueueMeta,
  updateVideo,
  updateVote,
  notFound,
  notFoundMeta,
  alreadyVoted
};
