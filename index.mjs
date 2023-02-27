//util functions. will refactor into util npm module in the future
const isNode = typeof window === "undefined";
const BufferFrom = isNode?(...args)=>{
    return Buffer.from(...args);
}:(...args)=>{
    return new Uint8Array(...args);
};

const U8FromView = function(view){
    if(view instanceof Uint8Array){
        return view;
    }
    return new Uint8Array(view.buffer,view.byteOffset,view.byteLength);
};

const allocUnsafe = isNode?function(n){
    return new Uint8Array(Buffer.allocUnsafe(n).buffer,0,n);
}:function(n){
    return new Uint8Array(new ArrayBuffer(n));
};


export class BufferBuilder{
    length = 0;
    u8;
    constructor(size=512,length=0){
        this.u8 = allocUnsafe(size);
        this.length = length;
        if(length !== 0){
            this.u8.fill(0,0,length);
        }
    }
    alloc(){
        if(this.length < this.u8.length){
            return;
        }
        const u8n = allocUnsafe(this.u8.length*2);
        u8n.set(this.u8);
        this.u8 = u8n;
    }
    grow(n){
        this.length += n;
        this.alloc();
    }
    growIfNoSpace(offset,insertLength){
        const newalloc = offset + insertLength - this.length;
        if(newalloc > 0){
            this.grow(newalloc);
        }
    }
    // interface view
    // {buffer,byteLength:int,byteOffser:int}
    set_buffer(view,offset = 0){
        const u8 = U8FromView(view);
        this.growIfNoSpace(offset,u8.length);
        this.u8.set(u8,offset);
    }
    set_BE16_buffer(view,offset = 0){
        const u8 = U8FromView(view);
        this.growIfNoSpace(offset,u8.length);
        for(let i = 0; i+1 < u8.length; i+=2){
            this.u8[offset+i] = u8[i+1];
            this.u8[offset+i+1] = u8[i];
        }
    }
    set_BE32_buffer(view,offset = 0){
        const u8 = U8FromView(view);
        this.growIfNoSpace(offset,u8.length);
        for(let i = 0; i+3 < u8.length; i+=4){
            this.u8[offset+i]   = u8[i+3];
            this.u8[offset+i+1] = u8[i+2];
            this.u8[offset+i+2] = u8[i+1];
            this.u8[offset+i+3] = u8[i];
        }
    }
    set_BE64_buffer(view,offset = 0){
        const u8 = U8FromView(view);
        this.growIfNoSpace(offset,u8.length);
        for(let i = 0; i+7 < u8.length; i+=8){
            this.u8[offset+i]   = u8[i+7];
            this.u8[offset+i+1] = u8[i+6];
            this.u8[offset+i+2] = u8[i+5];
            this.u8[offset+i+3] = u8[i+4];
            this.u8[offset+i+4] = u8[i+3];
            this.u8[offset+i+5] = u8[i+2];
            this.u8[offset+i+6] = u8[i+1];
            this.u8[offset+i+7] = u8[i];
        }
    }

    append_buffer(buff){
        this.set_buffer(buff,this.length);
    }
    append_BE16_buffer(buff){
        this.set_BE16_buffer(buff,this.length);
    }
    append_BE32_buffer(buff){
        this.set_BE32_buffer(buff,this.length);
    }
    append_BE64_buffer(buff){
        this.set_BE64_buffer(buff,this.length);
    }
    export(){
        console.log("exported length:",this.length);
        console.log("background buffer length:",this.u8.length);
        return BufferFrom(this.u8.buffer,0,this.length);
    }
};

const BE_writers = [];
BE_writers[2] = function(u81,u82,offset){
    u81[offset] = u82[1];
    u81[offset+1] = u82[0];
}

BE_writers[4] = function(u81,u82,offset){
    u81[offset] = u82[3];
    u81[offset+1] = u82[2];
    u81[offset+2] = u82[1];
    u81[offset+3] = u82[0];
}

BE_writers[8] = function(u81,u82,offset){
    u81[offset] = u82[7];
    u81[offset+1] = u82[6];
    u81[offset+2] = u82[5];
    u81[offset+3] = u82[4];
    u81[offset+4] = u82[3];
    u81[offset+5] = u82[2];
    u81[offset+6] = u82[1];
    u81[offset+7] = u82[0];
}


for(let [typename,typearr] of [
    ["U8" ,new Uint8Array(1)],
    ["U16",new Uint16Array(1)],
    ["U32",new Uint32Array(1)],
    ["U64",new BigUint64Array(1)],
    ["I8" ,new Int8Array(1)],
    ["I16",new Int16Array(1)],
    ["I32",new Int32Array(1)],
    ["I64",new BigInt64Array(1)],
    ["F32",new Float32Array(1)],
    ["F64",new Float64Array(1)]]){
    const typesize = typearr.buffer.byteLength;
    const u8 = new Uint8Array(typearr.buffer);
    BufferBuilder.prototype["append_"+typename] = function(val){
        typearr[0] = val;
        this.grow(typesize);
        this.u8.set(new Uint8Array(typearr.buffer),this.length-typesize);
    }
    BufferBuilder.prototype["set_"+typename] = function(val,offset){
        typearr[0] = val;
        this.growIfNoSpace(offset,typesize);
        this.set(typearr.buffer,offset);
    }
    if(typesize === 1)continue;
    BufferBuilder.prototype["set_"+typename+"_aligned"] = function(val,offset){
        typearr[0] = val;
        offset *= typesize;
        this.growIfNoSpace(offset,typesize);
        this.set(typearr.buffer,offset);
    }

    const BE_writer = BE_writers[typesize];
    BufferBuilder.prototype["append_"+typename+"BE"] = function(val){
        const length0 = this.length;
        typearr[0] = val;
        this.grow(typesize);
        BE_writer(this.u8,u8,length0);
    }
    BufferBuilder.prototype["set_"+typename+"BE"] = function(val,offset){
        typearr[0] = val;
        this.growIfNoSpace(offset,typesize);
        BE_writer(this.u8,u8,offset);
    }
    BufferBuilder.prototype["set_"+typename+"BE_aligned"] = function(val,offset){
        typearr[0] = val;
        offset *= typesize;
        this.growIfNoSpace(offset,typesize);
        BE_writer(this.u8,u8,offset);
    }
}



