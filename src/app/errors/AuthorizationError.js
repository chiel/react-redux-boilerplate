'use strict';

export default function AuthorizationError(message) {
	this.name = 'AuthorizationError';
	this.message = message;
	this.status = 401;
}

AuthorizationError.prototype.toString = function() {
	return this.message;
};
