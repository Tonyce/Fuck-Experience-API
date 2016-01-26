
"use strict";

const topicAnswerCollection = "FuckExperience.topicAnswer"

class TopicAnswer {

	/**
	 * _id , topicId:  _ObjectID
	 * answeror 		obj
	 * toUser   		obj
	**/
	constructor(_id, topicId, answeror, toUser, content, isAt) {
		this._id = _id;
		this.topicId = topicId;
		this.answeror = answeror;
		this.toUser = toUser;
		this.content = content;
		this.isAt = isAt;
		this.time = new Date();
	}

	save() {
		let collection = _db.collection(topicAnswerCollection);
		let promise = new Promise( (resolve, reject) => {    
			collection.insertOne(this, (err, result) => {
				if (err) {
					reject(err)
				}else {
					this._id = result.insertedId;
					resolve()	
				}
		    });
		})
		return promise;
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