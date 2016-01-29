
'use strict';

const scheduleCollection = "FuckExperience.schedule";

class Schedule {

	constructor(_id, githubId, day, week, year, content) {
		this._id = _id;
		this.githubId = githubId;
		this.day = day;
		this.week = week;
		this.year = year;
		this.content = content;
		this.done = false;
		this.time = new Date();
	}

	static findItems(githubId, day, week, year) {
		let collection = _db.collection(scheduleCollection);
		let promise = new Promise((resolve, reject) => {
			let query = {
				githubId: githubId,
				day: day,
				week: week,
				year: year
			}

			// console.log(query)
			
			collection.find(query).toArray((err, docs) => {
		        if (err){
		  	     	reject(err)
		        }else {
		        	resolve(docs);
		        }
			});
		})	
		return promise
	}

	save () {
		let collection = _db.collection(scheduleCollection);
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

	update (updateInfo) {
        let collection = _db.collection(scheduleCollection);
        let promise = new Promise( (resolve, reject) => {    
	        collection.updateOne({"_id": this._id, "githubId": this.githubId}, {$set: updateInfo}, (err, result) => {
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

    deleteItem(){
    	let collection = _db.collection(scheduleCollection);
        let promise = new Promise( (resolve, reject) => {    
	        collection.deleteOne({"_id": this._id, "githubId": this.githubId}, (err, result) => {
	            if (err) {
					reject(err)
				}else {
					resolve(result)	
				}
	        }); 
		})
		return promise; 
    }

}

module.exports = Schedule;