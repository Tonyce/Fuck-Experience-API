
'use strict';

const https = require('https');
const url = require('url');
const querystring = require('querystring');

const gitHubClientId = "8764ca998aea75a3e1c7";
const gitHubClientSecret = "d40ff6a3d4140e0f4e19a809647cc6bea41c63eb";

const githubOauthUrl = "https://github.com/login/oauth/authorize";
const githubAccessTokenUrl = "https://github.com/login/oauth/access_token";
const githubUserUrl = "https://api.github.com/user";

const githubCallbackUrl = "http://127.0.0.1/fuckexperience/api/githubAccessToken";
// const githubState = "aaabbb";

class GitHubAuth {

	constructor(state) {
		this.state = state;
		this.redirectUrl =`${githubOauthUrl}?client_id=${gitHubClientId}&redirect_uri=${githubCallbackUrl}&state=${state}`
	}

	// requestAccessToken(code, callback) {
	// 	// console.log("code", code)
	// 	let accessTokenBody = {
	// 		"client_id": gitHubClientId,
	// 		"client_secret": gitHubClientSecret,
	// 		"code": code,
	// 		"redirect_uri": githubCallbackUrl,
	// 		"state": this.state
	// 	}
	// 	httpsReqCallback(githubAccessTokenUrl, "POST", {}, accessTokenBody, (error, response) => {
	// 		if (error) {
	// 			console.log('problem with request: ' + error.message);
	// 			return callback(error);
	// 		}
	// 		let accessTokenObj = querystring.parse(response);
	// 		let accessToken = accessTokenObj.access_token;
	// 		// console.log(accessToken);

	// 		let headers = {
	// 			Authorization: `token ${accessToken}`
	// 		}
	// 		httpsReqCallback(githubUserUrl, "GET", headers, "", (error, response) => {
	// 			callback(error, response)
	// 		});
	// 	})
	// }

	successSet(data) {
		console.log("successSet", new Date().getTime());
		this.data = data;
		this.callback(this.error, this.data)
	}

	errorSet(error) {
		console.log("error", new Date().getTime(), error);
		this.error = error;
		this.callback(this.error, this.data)
	}

	requestAccessToken(code, callback) {
		this.callback = callback;
		let accessTokenBody = {
			"client_id": gitHubClientId,
			"client_secret": gitHubClientSecret,
			"code": code,
			"redirect_uri": githubCallbackUrl,
			"state": this.state
		}

		httpsReq(githubAccessTokenUrl, "POST", "", accessTokenBody).then( this.requestUserInfo.bind(this) ).catch( this.errorSet.bind(this) );
	}

	requestUserInfo( response ) {
		// console.log("response", new Date().getTime(), response)
		let accessTokenObj = querystring.parse(response);
		let accessToken = accessTokenObj.access_token;
		let headers = {
			Authorization: `token ${accessToken}`
		}
		httpsReq(githubUserUrl, "GET", headers, "").then( this.successSet.bind(this) ).catch(this.errorSet.bind(this))
	}
}

module.exports = GitHubAuth;

function httpsReq (urlStr, method, headers, body) {


	let postData = body ? JSON.stringify(body) : "";
	let passHeaders = {
		'User-Agent': 'Fuck Experience',
		'Content-Type': 'application/json',
		'Content-Length': Buffer.byteLength(postData)
	}

	if (headers) {
		for (let key in headers) {
			passHeaders[key] = headers[key];
		}
	}
	
	
  	let urlObject = url.parse(urlStr);


    let options = {
        "host": urlObject.host,
        "path": urlObject.path,
        "method": method,
        "headers": headers
    };

	let promise = new Promise( function  (resolve, reject) {    
    	
		    let req = https.request(options, (res) => {
		        let str = '';
		        res.setEncoding('utf8');
		        res.on('data', (chunk) => {
		            str += chunk;
		        });
		        res.on('end', function () {
		            return resolve(str);
		        });
		    });
		    req.on('error', (e) => {
		    	return reject(e);
		    });
		    req.write(postData);
		    req.end();
		}
	);
	return promise;
}

function httpsReqCallback (urlStr, method, headers, body, callback) {
	
	let postData = body ? JSON.stringify(body) : "";
  	let urlObject = url.parse(urlStr);

	headers['User-Agent'] = 'Fuck Experience';
  	headers['Content-Length'] = Buffer.byteLength(postData)
  	headers['Content-Type'] = 'application/json';

    let options = {
        "host": urlObject.host,
        "path": urlObject.path,
        "method": method,
        "headers": headers
    };

    let req = https.request(options, (res) => {
        let str = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            str += chunk;
        });
        res.on('end', function () {
        	callback(null, str);
        });
    });
    req.on('error', (e) => {
    	callback(e)
    });
    req.write(postData);
    req.end();
}

// callback
	// httpsReq(githubAccessTokenUrl, "POST", {}, accessTokenBody, (error, response) => {
	// 	if (error) {
	// 		console.log('problem with request: ' + e.message);
	// 		return callback(error);
	// 	}
	// 	let accessTokenObj = querystring.parse(response);
	// 	let accessToken = accessTokenObj.access_token;
	// 	// console.log(accessToken);

	// 	let headers = {
	// 		Authorization: `token ${accessToken}`
	// 	}
	// 	httpsReq(githubUserUrl, "GET", headers, "", (error, response) => {
	// 		// console.log(error, response);
	// 		callback(error, response)
	// 	});
	// })