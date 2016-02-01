
"use strict";

const MongoBase = require('./MongoBase');
const topicAnswerCollection = "FuckExperience.topicAnswer"

class TopicAnswer extends MongoBase {

	/**
	 * _id , topicId:  _ObjectID
	 * answeror 		obj
	 * toUser   		obj
	**/
	constructor(_id, topicId, answeror, toUser, content, isAt) {
		super(_id)
		this.topicId = topicId;
		this.answeror = answeror;
		this.toUser = toUser;
		this.content = content;
		this.isAt = isAt;
		this.collection = _db.collection(topicAnswerCollection); 
	}

	static find(topicId) {
		let collection = _db.collection(topicAnswerCollection);
		let promise = new Promise( (resolve, reject) => {    
			collection.find({topicId: topicId}).toArray((err, docs) => {
		        if (err){
		  	     	reject(err)
		        }else {
			      	resolve(docs);
		        }
			});
		})
		return promise;
	}
}

module.exports = TopicAnswer;