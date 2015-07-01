'use strict'

var BaseComponent = require('../../shared/components/mine_controller.js');

var mine_settings = require('../../shared/settings/mine.json');

function MineController(shape) {
	BaseComponent.call(this, shape);
};

///
MineController.prototype = Object.create(BaseComponent.prototype);
MineController.prototype.constructor = MineController;
///

MineController.prototype.update = function(){ 
	// console.log(this.owner.components.get('physics').body);
	BaseComponent.prototype.update.call(this);
}

module.exports = MineController;