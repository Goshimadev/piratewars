'use strict'

var GameEngine = require('./game_engine.js');
var GameComponent = require('./game_component.js');

function InputComponent() {
	console.log("inside InputComp constr");
	this.key = "input";
};

///
InputComponent.prototype = Object.create(GameComponent.prototype);
InputComponent.prototype.constructor = InputComponent;
///

InputComponent.prototype.processCommand = function(command) {
	var body = this.owner.components.get("physics").body;
    // console.log(body);

	for (var i in command) {
		switch (command[i]) {
			case 'arrowUp':
                body.force[0] = 500*Math.cos(body.angle*Math.PI/180);
                body.force[1] = 500*Math.sin(body.angle*Math.PI/180);
//				body.force[0] = player_properties.linear_force*Math.cos(this.body.angle*Math.PI/180);
//	        	body.force[1] = player_properties.linear_force*Math.sin(this.body.angle*Math.PI/180);
                break;
            case 'arrowDown':
                break;
            case 'arrowLeft':
                body.angularForce = -100000//player_properties.angular_force;
                break;
            case 'arrowRight':
                body.angularForce = 100000 //player_properties.angular_force;
                break;
            case 'space':
            	//shoot projectile
            default:
                break;
		}
	}
};

module.exports = InputComponent;