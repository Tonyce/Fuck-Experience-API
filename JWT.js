
'use strict';

const jwt = require('jsonwebtoken');
const serverTokenSecret = "GoodGoodStudyDayDayUp";

exports.signServerToken = function signServerToken (tokenInfo) {
	let token = ""
	try {
		token = jwt.sign(tokenInfo, serverTokenSecret, {"issuer": "ttangServer"});	
	}catch (err) {
		// console.error("signServerToken err...", err)
	}
	return token;
}

exports.verifyServerToken = function verifyServerToken (token) {
	let tokenInfo = ""
	try {
		tokenInfo = jwt.verify(token, serverTokenSecret);	
	}catch (err) {
		// console.error("verifyServerToken err serverToken illegal..", err);
	}
	return tokenInfo
}

exports.verifyClientToken = function verifyClientToken (token) {
	let tokenInfo = ""
	try {
		tokenInfo = jwt.verify(token, clientTokenSecret);
	} catch(err) {
	  	console.error("illegal client token....", err);
	}
	return tokenInfo
}