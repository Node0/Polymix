// Fee, Fy, Foe, Fum


exports.Mixin = Mixin;
exports.makeMixable = makeMixable;

const Mixin = Object.assign;

function makeMixable(ctx, className) {
/* Automatically enumerates functions of a class and adds them as properties under this of that class's constructor.
*  Which makes these methods accessible via the Mixin pattern.
*/
	Object.getOwnPropertyNames(className.prototype).forEach( (method) => {
		if (typeof method != 'undefined' && method !== 'constructor') {
			ctx[method] = ctx[method];
		}
	});
};



