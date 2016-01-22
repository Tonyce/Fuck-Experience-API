
'use strict';

const https = require('https');
const url = require('url');
const querystring = require('querystring');

const gitHubClientId = "8764ca998aea75a3e1c7";
const gitHubClientSecret = "d40ff6a3d4140e0f4e19a809647cc6bea41c63eb";

const githubOauthUrl = "https://github.com/login/oauth/authorize";
const githubAccessTokenUrl = "https://github.com/login/oauth/access_token";
const githubUserUrl = "https://api.github.com/user";

const githubCallbackUrl = "http://www.tonyce.top/fuckexperience/auth.html";

//http://127.0.0.1/fuckexperience/?code=c6258567016bf54ea0e6&state=aaabbb#/?_k=iu647t

class GitHubAuth {

	constructor(state) {
		this.state = state;
		this.redirectUrl =`${githubOauthUrl}?client_id=${gitHubClientId}&redirect_uri=${githubCallbackUrl}&state=${state}`
	}

	requestAccessToken(code) {
		let accessTokenBody = {
			"client_id": gitHubClientId,
			"client_secret": gitHubClientSecret,
			"code": code,
			"redirect_uri": githubCallbackUrl,
			"state": this.state
		}

		return httpsReq(githubAccessTokenUrl, "POST", "", accessTokenBody)
	}

	requestUserInfo( response ) {
		let accessTokenObj = querystring.parse(response);
		let accessToken = accessTokenObj.access_token;
		let headers = {
			Authorization: `token ${accessToken}`
		}
		return httpsReq(githubUserUrl, "GET", headers, "");
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
        "headers": passHeaders
    };
	let promise = new Promise( function  (resolve, reject) {    
		    let req = https.request(options, (res) => {
		        let str = '';
		        res.setEncoding('utf8');
		        res.on('data', (chunk) => {
		            str += chunk;
		        });
		        res.on('end', function () {
		        	// console.log("str", str)
		            resolve(str);
		        });
		    });
		    req.on('error', (e) => {
		    	// console.log("e", e)
		    	reject(e);
		    });
		    req.write(postData);
		    req.end();
		}
	);
	return promise;
}
