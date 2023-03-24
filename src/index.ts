//util functions
const isNode = typeof window === "undefined";

const U8FromView = function(view: ArrayBufferView): Uint8Array{
    if(view instanceof Uint8Array){
        return view;
    }
    return new Uint8Array(view.buffer,view.byteOffset,view.byteLength);
};

const allocUnsafe: (n: number) => Uint8Array = isNode?function(n){
    return new Uint8Array(Buffer.allocUnsafe(n).buffer,0,n);
}:function(n){
    return new Uint8Array(new ArrayBuffer(n));
};


const BE_writer_2 = function(u81: Uint8Array, u82: Uint8Array, offset: number){
    u81[offset] = u82[1];
    u81[offset+1] = u82[0];
};

const BE_writer_4 = function(u81: Uint8Array, u82: Uint8Array, offset: number){
    u81[offset] = u82[3];
    u81[offset+1] = u82[2];
    u81[offset+2] = u82[1];
    u81[offset+3] = u82[0];
};

const BE_writer_8 = function(u81: Uint8Array, u82: Uint8Array, offset: number){
    u81[offset] = u82[7];
    u81[offset+1] = u82[6];
    u81[offset+2] = u82[5];
    u81[offset+3] = u82[4];
    u81[offset+4] = u82[3];
    u81[offset+5] = u82[2];
    u81[offset+6] = u82[1];
    u81[offset+7] = u82[0];
};

// constants
const VERBOSE = false;
// auto generated constants. Souce at src/index.pts
const view_U16 = new Uint16Array(1);
const view_U16_u8 = new Uint8Array(view_U16);
const view_U32 = new Uint32Array(1);
const view_U32_u8 = new Uint8Array(view_U32);
const view_U64 = new BigUint64Array(1);
const view_U64_u8 = new Uint8Array(view_U64);
const view_I16 = new Int16Array(1);
const view_I16_u8 = new Uint8Array(view_I16);
const view_I32 = new Int32Array(1);
const view_I32_u8 = new Uint8Array(view_I32);
const view_I64 = new BigInt64Array(1);
const view_I64_u8 = new Uint8Array(view_I64);
const view_F32 = new Float32Array(1);
const view_F32_u8 = new Uint8Array(view_F32);
const view_F64 = new Float64Array(1);
const view_F64_u8 = new Uint8Array(view_F64);



export class BufferBuilder{
    length:number = 0;
    u8: Uint8Array;
    constructor(size: number = 512,length: number = 0){
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
        let len = this.u8.length;
        while(len < this.length){
            len *= 2;
        }
        const u8n = allocUnsafe(len);
        u8n.set(this.u8);
        this.u8 = u8n;
    }
    grow(n: number){
        this.length += n;
        this.alloc();
    }
    growIfNoSpace(offset: number, insertLength: number){
        const newalloc = offset + insertLength - this.length;
        if(newalloc > 0){
            this.grow(newalloc);
        }
    }
    set_buffer(view: ArrayBufferView, offset: number = 0){
        const u8 = U8FromView(view);
        this.growIfNoSpace(offset,u8.length);
        this.u8.set(u8,offset);
    }
    set_BE16_buffer(view: ArrayBufferView, offset: number = 0){
        const u8 = U8FromView(view);
        this.growIfNoSpace(offset,u8.length);
        for(let i = 0; i+1 < u8.length; i+=2){
            this.u8[offset+i] = u8[i+1];
            this.u8[offset+i+1] = u8[i];
        }
    }
    set_BE32_buffer(view: ArrayBufferView, offset: number = 0){
        const u8 = U8FromView(view);
        this.growIfNoSpace(offset,u8.length);
        for(let i = 0; i+3 < u8.length; i+=4){
            this.u8[offset+i]   = u8[i+3];
            this.u8[offset+i+1] = u8[i+2];
            this.u8[offset+i+2] = u8[i+1];
            this.u8[offset+i+3] = u8[i];
        }
    }
    set_BE64_buffer(view: ArrayBufferView, offset: number = 0){
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

    append_buffer(buff: ArrayBufferView){
        this.set_buffer(buff,this.length);
    }
    append_BE16_buffer(buff: ArrayBufferView){
        this.set_BE16_buffer(buff,this.length);
    }
    append_BE32_buffer(buff: ArrayBufferView){
        this.set_BE32_buffer(buff,this.length);
    }
    append_BE64_buffer(buff: ArrayBufferView){
        this.set_BE64_buffer(buff,this.length);
    }
    export_u8(): Uint8Array {
        if(VERBOSE)console.log("exported length:",this.length);
        if(VERBOSE)console.log("background buffer length:",this.u8.length);
        return this.u8.subarray(0,this.length);
    }
    export_buffer(): Buffer {
        return Buffer.from(this.u8,0,this.length);
    }
    export(): Uint8Array | Buffer {
        if(isNode){
            return Buffer.from(this.u8,0,this.length);
        }else{
            return this.u8.subarray(0,this.length);
        }
    }

    // these append/set methods are auto generated using build script at src/index.pts
    // append little endian methods
    append_U8(val: number){
        this.grow(1);
        this.u8[this.length-1] = val;
    }
    append_U16(val: number){
        view_U16[0] = val;
        this.grow(2);
        this.u8.set(view_U16_u8,this.length-2);
    }
    append_U32(val: number){
        view_U32[0] = val;
        this.grow(4);
        this.u8.set(view_U32_u8,this.length-4);
    }
    append_U64(val: bigint){
        view_U64[0] = val;
        this.grow(8);
        this.u8.set(view_U64_u8,this.length-8);
    }
    append_I8(val: number){
        this.grow(1);
        this.u8[this.length-1] = val;
    }
    append_I16(val: number){
        view_I16[0] = val;
        this.grow(2);
        this.u8.set(view_I16_u8,this.length-2);
    }
    append_I32(val: number){
        view_I32[0] = val;
        this.grow(4);
        this.u8.set(view_I32_u8,this.length-4);
    }
    append_I64(val: bigint){
        view_I64[0] = val;
        this.grow(8);
        this.u8.set(view_I64_u8,this.length-8);
    }
    append_F32(val: number){
        view_F32[0] = val;
        this.grow(4);
        this.u8.set(view_F32_u8,this.length-4);
    }
    append_F64(val: number){
        view_F64[0] = val;
        this.grow(8);
        this.u8.set(view_F64_u8,this.length-8);
    }
    
    // set little endian methods
    set_U8(val: number, offset: number){
        this.growIfNoSpace(offset, 1);
        this.u8[offset] = val;
    }
    set_U16(val: number, offset: number){
        view_U16[0] = val;
        this.growIfNoSpace(offset, 2);
        this.set_buffer(view_U16_u8,offset);
    }
    set_U32(val: number, offset: number){
        view_U32[0] = val;
        this.growIfNoSpace(offset, 4);
        this.set_buffer(view_U32_u8,offset);
    }
    set_U64(val: bigint, offset: number){
        view_U64[0] = val;
        this.growIfNoSpace(offset, 8);
        this.set_buffer(view_U64_u8,offset);
    }
    set_I8(val: number, offset: number){
        this.growIfNoSpace(offset, 1);
        this.u8[offset] = val;
    }
    set_I16(val: number, offset: number){
        view_I16[0] = val;
        this.growIfNoSpace(offset, 2);
        this.set_buffer(view_I16_u8,offset);
    }
    set_I32(val: number, offset: number){
        view_I32[0] = val;
        this.growIfNoSpace(offset, 4);
        this.set_buffer(view_I32_u8,offset);
    }
    set_I64(val: bigint, offset: number){
        view_I64[0] = val;
        this.growIfNoSpace(offset, 8);
        this.set_buffer(view_I64_u8,offset);
    }
    set_F32(val: number, offset: number){
        view_F32[0] = val;
        this.growIfNoSpace(offset, 4);
        this.set_buffer(view_F32_u8,offset);
    }
    set_F64(val: number, offset: number){
        view_F64[0] = val;
        this.growIfNoSpace(offset, 8);
        this.set_buffer(view_F64_u8,offset);
    }
    
    // set aligned little endian methods
    set_U16_aligned(val: number, offset: number){
        view_U16[0] = val;
        offset *= 2;
        this.growIfNoSpace(offset, 2);
        this.set_buffer(view_U16_u8,offset);
    }
    set_U32_aligned(val: number, offset: number){
        view_U32[0] = val;
        offset *= 4;
        this.growIfNoSpace(offset, 4);
        this.set_buffer(view_U32_u8,offset);
    }
    set_U64_aligned(val: bigint, offset: number){
        view_U64[0] = val;
        offset *= 8;
        this.growIfNoSpace(offset, 8);
        this.set_buffer(view_U64_u8,offset);
    }
    set_I16_aligned(val: number, offset: number){
        view_I16[0] = val;
        offset *= 2;
        this.growIfNoSpace(offset, 2);
        this.set_buffer(view_I16_u8,offset);
    }
    set_I32_aligned(val: number, offset: number){
        view_I32[0] = val;
        offset *= 4;
        this.growIfNoSpace(offset, 4);
        this.set_buffer(view_I32_u8,offset);
    }
    set_I64_aligned(val: bigint, offset: number){
        view_I64[0] = val;
        offset *= 8;
        this.growIfNoSpace(offset, 8);
        this.set_buffer(view_I64_u8,offset);
    }
    set_F32_aligned(val: number, offset: number){
        view_F32[0] = val;
        offset *= 4;
        this.growIfNoSpace(offset, 4);
        this.set_buffer(view_F32_u8,offset);
    }
    set_F64_aligned(val: number, offset: number){
        view_F64[0] = val;
        offset *= 8;
        this.growIfNoSpace(offset, 8);
        this.set_buffer(view_F64_u8,offset);
    }
    
    // append big endian methods
    append_U16BE(val: number){
        view_U16[0] = val;
        this.grow(2);
        BE_writer_2(this.u8,view_U16_u8,this.length-2);
    }
    append_U32BE(val: number){
        view_U32[0] = val;
        this.grow(4);
        BE_writer_4(this.u8,view_U32_u8,this.length-4);
    }
    append_U64BE(val: bigint){
        view_U64[0] = val;
        this.grow(8);
        BE_writer_8(this.u8,view_U64_u8,this.length-8);
    }
    append_I16BE(val: number){
        view_I16[0] = val;
        this.grow(2);
        BE_writer_2(this.u8,view_I16_u8,this.length-2);
    }
    append_I32BE(val: number){
        view_I32[0] = val;
        this.grow(4);
        BE_writer_4(this.u8,view_I32_u8,this.length-4);
    }
    append_I64BE(val: bigint){
        view_I64[0] = val;
        this.grow(8);
        BE_writer_8(this.u8,view_I64_u8,this.length-8);
    }
    append_F32BE(val: number){
        view_F32[0] = val;
        this.grow(4);
        BE_writer_4(this.u8,view_F32_u8,this.length-4);
    }
    append_F64BE(val: number){
        view_F64[0] = val;
        this.grow(8);
        BE_writer_8(this.u8,view_F64_u8,this.length-8);
    }

    // set big endian methods
    set_U16BE(val: number, offset: number){
        view_U16[0] = val;
        this.growIfNoSpace(offset, 2);
        BE_writer_2(this.u8,view_U16_u8,offset);
    }
    set_U32BE(val: number, offset: number){
        view_U32[0] = val;
        this.growIfNoSpace(offset, 4);
        BE_writer_4(this.u8,view_U32_u8,offset);
    }
    set_U64BE(val: bigint, offset: number){
        view_U64[0] = val;
        this.growIfNoSpace(offset, 8);
        BE_writer_8(this.u8,view_U64_u8,offset);
    }
    set_I16BE(val: number, offset: number){
        view_I16[0] = val;
        this.growIfNoSpace(offset, 2);
        BE_writer_2(this.u8,view_I16_u8,offset);
    }
    set_I32BE(val: number, offset: number){
        view_I32[0] = val;
        this.growIfNoSpace(offset, 4);
        BE_writer_4(this.u8,view_I32_u8,offset);
    }
    set_I64BE(val: bigint, offset: number){
        view_I64[0] = val;
        this.growIfNoSpace(offset, 8);
        BE_writer_8(this.u8,view_I64_u8,offset);
    }
    set_F32BE(val: number, offset: number){
        view_F32[0] = val;
        this.growIfNoSpace(offset, 4);
        BE_writer_4(this.u8,view_F32_u8,offset);
    }
    set_F64BE(val: number, offset: number){
        view_F64[0] = val;
        this.growIfNoSpace(offset, 8);
        BE_writer_8(this.u8,view_F64_u8,offset);
    }

    // set aligned big endian methods
    set_U16BE_aligned(val: number, offset: number){
        view_U16[0] = val;
        offset *= 2;
        this.growIfNoSpace(offset, 2);
        BE_writer_2(this.u8,view_U16_u8,offset);
    }
    set_U32BE_aligned(val: number, offset: number){
        view_U32[0] = val;
        offset *= 4;
        this.growIfNoSpace(offset, 4);
        BE_writer_4(this.u8,view_U32_u8,offset);
    }
    set_U64BE_aligned(val: bigint, offset: number){
        view_U64[0] = val;
        offset *= 8;
        this.growIfNoSpace(offset, 8);
        BE_writer_8(this.u8,view_U64_u8,offset);
    }
    set_I16BE_aligned(val: number, offset: number){
        view_I16[0] = val;
        offset *= 2;
        this.growIfNoSpace(offset, 2);
        BE_writer_2(this.u8,view_I16_u8,offset);
    }
    set_I32BE_aligned(val: number, offset: number){
        view_I32[0] = val;
        offset *= 4;
        this.growIfNoSpace(offset, 4);
        BE_writer_4(this.u8,view_I32_u8,offset);
    }
    set_I64BE_aligned(val: bigint, offset: number){
        view_I64[0] = val;
        offset *= 8;
        this.growIfNoSpace(offset, 8);
        BE_writer_8(this.u8,view_I64_u8,offset);
    }
    set_F32BE_aligned(val: number, offset: number){
        view_F32[0] = val;
        offset *= 4;
        this.growIfNoSpace(offset, 4);
        BE_writer_4(this.u8,view_F32_u8,offset);
    }
    set_F64BE_aligned(val: number, offset: number){
        view_F64[0] = val;
        offset *= 8;
        this.growIfNoSpace(offset, 8);
        BE_writer_8(this.u8,view_F64_u8,offset);
    }
};


