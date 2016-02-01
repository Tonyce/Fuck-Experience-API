"use strict";

const MongoBase = require('./MongoBase');

const topicCollection = "FuckExperience.topic"

class Topic extends MongoBase {
	constructor(_id, title, author, content) {
		super(_id)
		this.title = title;
		this.author = author;
		this.read = 0;
		this.content = content;
		this.collection = _db.collection(topicCollection); 
	}

	static findTitles (id) {
		let collection = _db.collection(topicCollection); 
		let promise = new Promise((resolve, reject) => {
			let query = {}
			if (id) {
				try {
					id = new _ObjectID(id);
				}catch (err) {
					reject(err)
				}
				query = {_id: {$lt: id}}
			}
			collection.find(query, {"title": 1, "author": 1, "time": 1}).sort({"time": -1}).limit(10).toArray((err, docs) => {
		        if (err){
		  	     	reject(err)
		        }else {
		        	resolve(docs);
		        }
			});
		})	
		return promise
	}

	find () {
		let promise = new Promise( (resolve, reject)=> {
			this.incRead(() => {
				this.collection.findOne({_id: this._id}, (err, doc) => {
					if (err) {
						reject(err)
					}else {
				        this.title = doc.title;
				        this.author = doc.author;
				        this.content = doc.content;
				        this.read = doc.read;
				        this.time = doc.time;
				        resolve()
				    }
				});
			})
		});
		return promise;
	}

    incRead (callback) {
        this.collection.update({"_id": this._id}, { $inc: { read: 1} }, (err, result) => {
            //console.log(result); //{ result: { ok: 1, nModified: 1, n: 1 },
            callback()
        }); 
    }

	insertComment (comment, ip, callback) {


		if (!comment) {
			callback({"err":"不接受空的"});
			return;
		};

		// check ip time;
		let time = new Date();
		let compareTime = new Date().addDates(-1);

		this.findComment(ip, compareTime, (err, comments) => {
			
			if (err || comments) {
				callback({"err":"限制时间段内（24小时内一次）不能提交"});
				return
			}
			let commentBody = {
				"ip": ip,
				"comment": comment,
				"time": time
			}

			this.collection.update({_id: this._id}, {$push: {"comments": commentBody}}, (err, result) => {
		        callback(null, {"time": time});
		    });
		});
	}

	findComment(ip, compareTime, callback) {
		let query = {
			"_id": this._id, 	
			"comments": { 
				"$elemMatch": { 
					"ip": ip, 
					"time": { $gt: compareTime } 
				}
			} 
		}

		this.collection.findOne(query, (err, doc) => {
			callback(err, doc && doc.comments)
		});
	}
}

Date.prototype.addDates= function(d){
    this.setDate(this.getDate() + d);
    return this;
}

module.exports = Topic;