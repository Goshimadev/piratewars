'use strict'

var _ = require('underscore');
var UUID = require('node-uuid');
var PlayerFactory = require('./player_factory.js');
var SnapshotManager = require('../../shared/core/snapshot_manager.js');
var GameEngine = require('../../shared/game_engine.js');

function Client(socket, room) {
	// console.log("inside client constr");
	this._id =  UUID();
	this.name = null;
	this.chosenTeam = null;
	this.ready = false;
	this._room = room;
	this._socket = socket;
	this._player = null;
	this._snapshots = new SnapshotManager();
	//DEBUG
	this._packagesLost = 0;
	this._lastStep = -1;
}

Client.prototype.init = function() {
	// console.log("client init");
	this._socket.emit('onconnected');
	this._socket.on('client.name', this.onName.bind(this));
	this._socket.on('client.changeTeam', this.onChangeTeam.bind(this));
	this._socket.on('client.ready', this.onReady.bind(this));
	// process.on("SIGINT", function(){
 //    	console.log(this._packagesLost + " from " + this._lastStep + " lost (" + 100*this._packagesLost/this._lastStep + "%)");
	// }.bind(this));
}

/*******************************************************/
/****************** NETWORK CALLBACKS ******************/
/*******************************************************/
Client.prototype.onName = function(name) {
	if (_.isString(name)) {
		this.name = name;
		this.chosenTeam =  this._room.getWeakestChosenTeam();
		this._room.clients.push(this);
	}
	else {
		console.error("Didn't get a string as name from the client");		
	}
}

Client.prototype.onChangeTeam = function(team) {
	if (this._room.validateTeam(team)) {
		this.chosenTeam = team;
	}
	else {
		console.error("Invalid chosen team");		
	}
}

Client.prototype.onReady = function(ready) {
	if (_.isBoolean(ready)) {
		this.ready = ready;
	}
	else {
		console.error("Invalid ready state");		
	}
}


/******************************************************/
/****************** HELPER FUNCTIONS ******************/
/******************************************************/
Client.prototype.createPlayer = function() {
	// console.log("client createPlayer");
	this._player = PlayerFactory.createPlayer(this._socket, this._snapshots);
	this._socket.emit('player.create', 
		{
			id: entity.id,
			transform: entity.transform.getPosition(),
			initialAttrs: entity.initialAttrs.getAll()
		});
	this._socket.on('client.sync', this.queueSyncFromClient.bind(this));
}

Client.prototype.queueSyncFromClient = function(message) {
	// Debug package loss
	if (message.step !== this._lastStep + 1) {
		this._packagesLost += (this._lastStep + 1) - message.step; 
	}
	this._lastStep = message.step;

	this._snapshots.add(message);
}


/****************************************************/
/****************** SYNC FUNCTIONS ******************/
/****************************************************/
Client.prototype.sendGameSync = function(snapshot) {
	this._socket.emit('game.sync', snapshot);
}

Client.prototype.sendChangedState = function(newState) {
	this._socket.emit('game.state', newState);
}

Client.prototype.sendLobbyInfo = function(info) {
	this._socket.emit('lobby.info', info);
}

module.exports = Client;