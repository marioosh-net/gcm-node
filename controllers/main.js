var Joi = require('joi');
var gcm = require('node-gcm');
var Reg = require('mongoose').model('Reg');

var findRegs = function(callback) {
	Reg.find(function(err, regs){
		if(err) {
			throw err;
		}
		callback(regs);
	});
}

var findRegsByRegid = function(regid, callback) {
	Reg.find({regid: regid}, function(err, regs){
		if(err) {
			throw err;
		}
		callback(regs);
	});
}

/**
 * one-page
 */
exports.home = function(request, reply) {
	findRegs(function(regs){
		reply.view('index', {regs: regs});
	});	
};

/**
 * wysyla push notification do wszystkich zarejestrowanych
 */
exports.send = function(request, reply) {
	var message = new gcm.Message();
	message.addData('title', request.payload.title);
	message.addData('message', request.payload.message);
	if(request.payload.time_to_live != '') {
        message.timeToLive = parseInt(request.payload.time_to_live);
	}

	if(request.payload.collapseKey != '') {
        message.collapseKey = request.payload.collapseKey;
	}

	findRegs(function(regs){
		var regIds = [];
		regs.forEach(function(a){
			regIds.push(a.regid);
		});
        console.log('wysylanie push...');
        console.log(message);
		var sender = new gcm.Sender('AIzaSyDh3MXJt_LDTldz1pZC4RRZr84DhD4qmmc');
		sender.send(message, regIds, function (err, result) {
		    if(err) {
		    	console.error(err);
		    	reply(err).code(400);
		    } else {
		    	console.log(result);
		    	reply(JSON.stringify(result,null,2)).code(200);
			}
		});		
	});
}

/**
 * dodaje do listy o ile juz taki regid nie istnieje
 */
exports.register = function(request, reply) {

	/**
	 * validate by joi validator
	 */
	var validation = Joi.validate(request.payload, {
		regid: Joi.string(),
		name: Joi.string()
	});

	if(validation.error == null) {
		findRegsByRegid(request.payload.regid, function(regs){
			if(regs.length == 0) {
				var reg = new Reg(request.payload);
				reg.save(function (err) {
					if (err) {
						reply(err).code(400);
					}
					console.log(request.payload.name + ' zarejestrowany');
					reply().code(201);
				});		
			} else {
				console.log(request.payload.name + ' byl wczesniej rejestrowany');
				reply().code(200);
			}
		});
	} else {
		reply(validation.message).code(400);
	}
};

/**
 *
 */
exports.del = function(request, reply) {
	var conditions = request.params.id ? {_id:request.params.id}:{};
	Reg.remove(conditions, function(err) {
		if (err) {
			reply(err).code(400);
		}
		reply().code(200);
	});
};

exports.list = function(request, reply) {
	findRegs(function(regs){
		reply.view('list', {regs: regs});
	});
};

exports.list_json = function(request, reply) {
	findRegs(function(regs){
		reply(regs);
	});
};
