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
##@import globals from autogen_methods



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
    ##@import append_methods         from autogen_methods
    
    // set little endian methods
    ##@import set_methods            from autogen_methods
    
    // set aligned little endian methods
    ##@import set_aligned_methods    from autogen_methods
    
    // append big endian methods
    ##@import BE_append_methods      from autogen_methods

    // set big endian methods
    ##@import BE_set_methods         from autogen_methods

    // set aligned big endian methods
    ##@import BE_set_aligned_methods from autogen_methods
};


##@begin autogen_methods

const types = [
    ["U8" , "Uint8Array"    ],
    ["U16", "Uint16Array"   ],
    ["U32", "Uint32Array"   ],
    ["U64", "BigUint64Array"],
    ["I8" , "Int8Array"     ],
    ["I16", "Int16Array"    ],
    ["I32", "Int32Array"    ],
    ["I64", "BigInt64Array" ],
    ["F32", "Float32Array"  ],
    ["F64", "Float64Array"  ]];

//export const methods = new CodeBlock({spacing:2});// default 0
export const globals = new CodeBlock;
export const append_methods = new CodeBlock;
export const set_methods = new CodeBlock;
export const set_aligned_methods = new CodeBlock;
export const BE_append_methods = new CodeBlock;
export const BE_set_methods = new CodeBlock;
export const BE_set_aligned_methods = new CodeBlock;

for(let [name,constructor] of types){
    const itemType = constructor[0] === "B" ? "bigint" : "number";
    const typeSize = parseInt(name.slice(1))/8;
    
    
    if(typeSize === 1){
        append_methods.add(`
            append_${name}(val: number){
                this.grow(1);
                this.u8[this.length-1] = val;
            }
        `);
        set_methods.add(`
            set_${name}(val: number, offset: number){
                this.growIfNoSpace(offset, ${typeSize});
                this.u8[offset] = val;
            }
        `);
    }else{
        const BE_writer = `BE_writer_${typeSize}`;
        globals.add(`
            const view_${name} = new ${constructor}(1);
            const view_${name}_u8 = new Uint8Array(view_${name}.buffer);
        `);
        append_methods.add(`
            append_${name}(val: ${itemType}){
                view_${name}[0] = val;
                this.grow(${typeSize});
                this.u8.set(view_${name}_u8,this.length-${typeSize});
            }
        `);
        set_methods.add(`
            set_${name}(val: ${itemType}, offset: number){
                view_${name}[0] = val;
                this.growIfNoSpace(offset, ${typeSize});
                this.set_buffer(view_${name}_u8,offset);
            }
        `);
        set_aligned_methods.add(`
            set_${name}_aligned(val: ${itemType}, offset: number){
                view_${name}[0] = val;
                offset *= ${typeSize};
                this.growIfNoSpace(offset, ${typeSize});
                this.set_buffer(view_${name}_u8,offset);
            }
        `);
        BE_append_methods.add(`
            append_${name}BE(val: ${itemType}){
                view_${name}[0] = val;
                this.grow(${typeSize});
                ${BE_writer}(this.u8,view_${name}_u8,this.length-${typeSize});
            }
        `);
        BE_set_methods.add(`
            set_${name}BE(val: ${itemType}, offset: number){
                view_${name}[0] = val;
                this.growIfNoSpace(offset, ${typeSize});
                ${BE_writer}(this.u8,view_${name}_u8,offset);
            }
        `);
        BE_set_aligned_methods.add(`
            set_${name}BE_aligned(val: ${itemType}, offset: number){
                view_${name}[0] = val;
                offset *= ${typeSize};
                this.growIfNoSpace(offset, ${typeSize});
                ${BE_writer}(this.u8,view_${name}_u8,offset);
            }
        `);
    }

}

##@end autogen_methods
