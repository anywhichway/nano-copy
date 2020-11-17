(function() {
	function nanoCopy(data,cloned=new Map()) {
		const type = typeof(data);
		if(!data || type!=="object") {
			return type === "string" ? String(data) : data;
		}
		const clonable = (nanoClone.cloners || (nanoClone.cloners = new Set([BigInt,Boolean,Date,Error,Map,Number,RegExp,Set,String,WeakMap,WeakSet]))).has(data.constructor);
		let clone = cloned.get(data);
		if(clone) return clone;
		clone = clonable
			? new data.constructor(data)
			: Object.entries(data).reduce((accum,[key,value]) => { accum[key] = nanoClone(value,cloned); return accum; },Object.create(Object.getPrototypeOf(data)));
		cloned.set(data,clone);
		return clone;
	}
	
	if(typeof(module)!=="undefined") {
		module.nanoCopy = nanoCopy;
		naoCopy.nanoCopy = nanoCopy;
	}
	if(typeof(globalThis)!=="undefined") {
		globalThis.nanoCopy = nanoCopy;
	}
})();