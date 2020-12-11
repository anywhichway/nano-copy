(() => {
	const f = function() {},
		_Buffer = typeof(Buffer)==="function" ? Buffer : f,
		_Blob = typeof(Blob)==="function" ? Blob : f,
		_DataView = typeof(DataView)==="function" ? DataView : f,
		cloners = new Set([ArrayBuffer,BigInt,_Blob,Boolean,_Buffer,_DataView,Date,Error,Int8Array,Int16Array,Int32Array,Map,Number,RegExp,Set,String,Uint8Array,Uint16Array,Uint32Array]),
		directs = new Set([Boolean,Error,Number,Promise,String,Symbol,WeakMap,WeakSet]),
		nanoCopy = (data,options={},cloned=new WeakMap()) => {
		const type = typeof(data);
		if(!data || type!=="object" || directs.has(data.constructor) || type==="function" || type==="undefined") {
			if(data && type==="object") cloned.set(data,data);
			return data;
		}
		let clone = cloned.get(data);
		if(clone) return clone;
		if(cloners.has(data.constructor)) {
			clone = data instanceof _Buffer
				? _Buffer.from(data)
				: data instanceof ArrayBuffer
					? data.slice(0)
					: data instanceof _Blob 
						? new _Blob([data],{type:data.type,endings:data.endings})
						: data instanceof _DataView
							? new _DataView(nanoCopy(data.buffer,options,cloned),data.byteOffset,data.byteLength)
							: new data.constructor(data);
			cloned.set(data,clone);
			if(clone instanceof Set || clone instanceof Map) {
				for(const [key,value] of [...clone.entries()]) {
					if(clone instanceof Set) {
						clone.delete(key);
						clone.add(nanoCopy(key,options,cloned));
					} else if(clone instanceof Map) {
						clone.delete(key);
						clone.set(nanoCopy(key,options,cloned),nanoCopy(value,options,cloned));
					}
				}
			}
		} else if(Array.isArray(data)) {
			clone = data.map((item) => nanoCopy(item,options,cloned));
		} else {
			if(data.constructor.from) {
				try {
					clone = data.constructor.from(data);
					return clone;
				} catch(error) {
					// ignore and try Object.create
				}
			}
			clone = Object.create(Object.getPrototypeOf(data));
			cloned.set(data,clone);
			for(const key in data) {
				const value = data[key];
				clone[key] = nanoCopy(value,options,cloned);
			}
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