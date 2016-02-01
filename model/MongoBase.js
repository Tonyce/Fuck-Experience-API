"use strict";


const collection = ""

class MongoBase {
	constructor(_id, collection) {
		this._id = _id;
		this.collection = collection;
		this.time = new Date();
	}

	find () {
		let promise = new Promise( (resolve, reject)=> {
			this.collection.findOne({_id: this._id}, (err, doc) => {
				if (err) {
					reject(err)
				}else {
			        resolve(doc)
			    }
			});
		});
		return promise;
	}

	save () {
		let promise = new Promise( (resolve, reject) => {    
			let collection = this.collection;
			delete this.collection;
			collection.insertOne(this, (err, result) => {
				if (err) {
					reject(err)
				}else {
					this._id = result.insertedId;
					resolve(result)	
				}
		    });
		})
		return promise;
	}

	update (updateInfo, callback) {
		let promise = new Promise( (resolve, reject) => {    
	        this.collection.updateOne({"_id": this._id}, {$set: updateInfo}, (err, result) => {
	        	if (err) {
	        		reject(err)
	        	}else {
	        		resolve(result);
	        	}
	        });   
	    })
	    return promise;
    }
}

module.exports = MongoBase;