export class BufferBuilder{
    length = 0;
    size = 512;
    buffer;
    u8;
    constructor(size,length=0){
        size = this.size = size || this.size;
        const buffer = this.buffer = new ArrayBuffer(size);
        this.length = length;
        this.refreshViews();
    }
    refreshViews(){
        this.u8 = new Uint8Array(this.buffer);
    }
    alloc(){
        if(this.length < this.size){
            return;
        }
        while(this.length > this.size){
            this.size *= 2;
        }
        const newbuf = new ArrayBuffer(this.size);
        const u8n = new Uint8Array(newbuf);
        u8n.set(this.u8);
        this.buffer = newbuf;
        this.refreshViews();
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
    set(buff,offset = 0){
        this.growIfNoSpace(offset,buff.byteLength);
        this.u8.set(new Uint8Array(buff),offset);
    }
    append_buffer(buff){
        this.set(buff,this.length);
    }
    export(){
        return this.buffer.slice(0,this.length);
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



