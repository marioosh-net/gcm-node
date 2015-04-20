var Joi = require('joi');
var gcm = require('node-gcm');
var Cat = require('mongoose').model('Cat');
var Reg = require('mongoose').model('Reg');

var findKittens = function(callback) {
	Cat.find(function(err, kittens){
		if(err) {
			throw err;
		}
		callback(kittens);
	});
}

var findRegs = function(callback) {
	Reg.find(function(err, regs){
		if(err) {
			throw err;
		}
		callback(regs);
	});
}

exports.home = function(request, reply) {
	findRegs(function(regs){
		reply.view('index', {regs: regs});
	});	
};

exports.send = function(request, reply) {
	var message = new gcm.Message();
	message.addData('message', request.payload.message);

	findRegs(function(regs){
		var regIds = [];
		regs.forEach(function(a){
			regIds.push(a.regid);
		});
		console.log(regIds);
		var sender = new gcm.Sender('AIzaSyDh3MXJt_LDTldz1pZC4RRZr84DhD4qmmc');
		sender.send(message, regIds, function (err, result) {
		    if(err) {
		    	console.error(err);
		    } else {
		    	console.log(result);
			}
		});		
	});
}

exports.add = function(request, reply) {

	/**
	 * validate by joi validator
	 */
	var validation = Joi.validate(request.payload, {
		regid: Joi.string()
	});

	if(validation.error == null) {
		var reg = new Reg({ regid: request.payload.regid});
		console.log(reg);
		reg.save(function (err) {
			if (err) {
				reply(err).code(400);
			}
			reply().code(200);
		});		
	} else {
		reply(validation.message).code(400);
	}
};

exports.del = function(request, reply) {
	var conditions = request.params.id ? {_id:request.params.id}:{};
	Cat.remove(conditions, function(err) {
		if (err) {
			reply(err).code(400);
		}
		reply().code(200);
	});
};

exports.list = function(request, reply) {
	findKittens(function(kittens){
		reply.view('list', {kittens: kittens});
	});
};

exports.list_json = function(request, reply) {
	findKittens(function(kittens){
		reply(kittens);
	});
};