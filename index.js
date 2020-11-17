(function() {
	function nanoCopy(data,options={},cloned=new WeakMap()) {
		const type = typeof(data);
		if(!data || type!=="object" || type=="function") {
			return type === "string" ? String(data) : data;
		}
		if(data instanceof WeakMap || data instanceof WeakSet) {
			cloned.set(data,data);
			return data;
		}
		let clone = cloned.get(data);
		if(clone) return clone;
		const clonable = (nanoCopy.cloners || (nanoCopy.cloners = new Set([BigInt,Boolean,Date,Error,Int8Array,Int16Array,Int32Array,Map,Number,RegExp,Set,String,Uint8Array,Uint16Array,Uint32Array]))).has(data.constructor);
		if(clonable) {
			clone = new data.constructor(data);
			cloned.set(data,clone);
			if(clone instanceof Set || clone instanceof Map) {
				const array = [];
				for(const entry of clone.entries()) {
					array.push(entry);
				}
				array.forEach(([key,value]) => {
					if(clone instanceof Set) {
						clone.delete(key);
						clone.add(nanoCopy(key,options,cloned));
						return
					}
					if(clone instanceof Map) {
						clone.delete(key);
						clone.set(nanoCopy(key,options,cloned),nanoCopy(value,options,cloned));
						return;
					}
				})
			}
		} else if(Array.isArray(data)) {
			clone = new data.constructor();
			for(const item of data) {
				clone.push(nanoCopy(item,options))
			}
		} else {
			clone = Object.create(Object.getPrototypeOf(data));
			cloned.set(data,clone);
			Object.entries(data).reduce((accum,[key,value]) => { 
				accum[key] = nanoCopy(value,options,cloned);
				return accum;
			},clone);
		}
		return clone;
	}
	
	if(typeof(module)!=="undefined") {
		module.nanoCopy = nanoCopy;
		nanoCopy.nanoCopy = nanoCopy;
	}
	if(typeof(globalThis)!=="undefined") {
		globalThis.nanoCopy = nanoCopy;
	}
})();