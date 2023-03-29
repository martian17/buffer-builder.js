//util functions
const isNode = typeof window === "undefined";
const U8FromView = function (view) {
    if (view instanceof Uint8Array) {
        return view;
    }
    return new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
};
const allocUnsafe = isNode ? function (n) {
    return new Uint8Array(Buffer.allocUnsafe(n).buffer, 0, n);
} : function (n) {
    return new Uint8Array(new ArrayBuffer(n));
};
const BE_writer_2 = function (u81, u82, offset) {
    u81[offset] = u82[1];
    u81[offset + 1] = u82[0];
};
const BE_writer_4 = function (u81, u82, offset) {
    u81[offset] = u82[3];
    u81[offset + 1] = u82[2];
    u81[offset + 2] = u82[1];
    u81[offset + 3] = u82[0];
};
const BE_writer_8 = function (u81, u82, offset) {
    u81[offset] = u82[7];
    u81[offset + 1] = u82[6];
    u81[offset + 2] = u82[5];
    u81[offset + 3] = u82[4];
    u81[offset + 4] = u82[3];
    u81[offset + 5] = u82[2];
    u81[offset + 6] = u82[1];
    u81[offset + 7] = u82[0];
};
// constants
const VERBOSE = false;
// auto generated constants. Souce at src/index.pts
const view_U16 = new Uint16Array(1);
const view_U16_u8 = new Uint8Array(view_U16.buffer);
const view_U32 = new Uint32Array(1);
const view_U32_u8 = new Uint8Array(view_U32.buffer);
const view_U64 = new BigUint64Array(1);
const view_U64_u8 = new Uint8Array(view_U64.buffer);
const view_I16 = new Int16Array(1);
const view_I16_u8 = new Uint8Array(view_I16.buffer);
const view_I32 = new Int32Array(1);
const view_I32_u8 = new Uint8Array(view_I32.buffer);
const view_I64 = new BigInt64Array(1);
const view_I64_u8 = new Uint8Array(view_I64.buffer);
const view_F32 = new Float32Array(1);
const view_F32_u8 = new Uint8Array(view_F32.buffer);
const view_F64 = new Float64Array(1);
const view_F64_u8 = new Uint8Array(view_F64.buffer);
export class BufferBuilder {
    length = 0;
    u8;
    constructor(size = 512, length = 0) {
        this.u8 = allocUnsafe(size);
        this.length = length;
        if (length !== 0) {
            this.u8.fill(0, 0, length);
        }
    }
    alloc() {
        if (this.length < this.u8.length) {
            return;
        }
        let len = this.u8.length;
        while (len < this.length) {
            len *= 2;
        }
        const u8n = allocUnsafe(len);
        u8n.set(this.u8);
        this.u8 = u8n;
    }
    grow(n) {
        this.length += n;
        this.alloc();
    }
    growIfNoSpace(offset, insertLength) {
        const newalloc = offset + insertLength - this.length;
        if (newalloc > 0) {
            this.grow(newalloc);
        }
    }
    set_buffer(view, offset = 0) {
        const u8 = U8FromView(view);
        this.growIfNoSpace(offset, u8.length);
        this.u8.set(u8, offset);
    }
    set_BE16_buffer(view, offset = 0) {
        const u8 = U8FromView(view);
        this.growIfNoSpace(offset, u8.length);
        for (let i = 0; i + 1 < u8.length; i += 2) {
            this.u8[offset + i] = u8[i + 1];
            this.u8[offset + i + 1] = u8[i];
        }
    }
    set_BE32_buffer(view, offset = 0) {
        const u8 = U8FromView(view);
        this.growIfNoSpace(offset, u8.length);
        for (let i = 0; i + 3 < u8.length; i += 4) {
            this.u8[offset + i] = u8[i + 3];
            this.u8[offset + i + 1] = u8[i + 2];
            this.u8[offset + i + 2] = u8[i + 1];
            this.u8[offset + i + 3] = u8[i];
        }
    }
    set_BE64_buffer(view, offset = 0) {
        const u8 = U8FromView(view);
        this.growIfNoSpace(offset, u8.length);
        for (let i = 0; i + 7 < u8.length; i += 8) {
            this.u8[offset + i] = u8[i + 7];
            this.u8[offset + i + 1] = u8[i + 6];
            this.u8[offset + i + 2] = u8[i + 5];
            this.u8[offset + i + 3] = u8[i + 4];
            this.u8[offset + i + 4] = u8[i + 3];
            this.u8[offset + i + 5] = u8[i + 2];
            this.u8[offset + i + 6] = u8[i + 1];
            this.u8[offset + i + 7] = u8[i];
        }
    }
    append_buffer(buff) {
        this.set_buffer(buff, this.length);
    }
    append_BE16_buffer(buff) {
        this.set_BE16_buffer(buff, this.length);
    }
    append_BE32_buffer(buff) {
        this.set_BE32_buffer(buff, this.length);
    }
    append_BE64_buffer(buff) {
        this.set_BE64_buffer(buff, this.length);
    }
    export_u8() {
        return this.u8.subarray(0, this.length);
    }
    export_buffer() {
        return Buffer.from(this.u8.buffer, this.u8.byteOffset, this.length);
    }
    export() {
        if (isNode) {
            return this.export_buffer();
        }
        else {
            return this.export_u8();
        }
    }
    // these append/set methods are auto generated using build script at src/index.pts
    // append little endian methods
    append_U8(val) {
        this.grow(1);
        this.u8[this.length - 1] = val;
    }
    append_U16(val) {
        view_U16[0] = val;
        this.grow(2);
        this.u8.set(view_U16_u8, this.length - 2);
    }
    append_U32(val) {
        view_U32[0] = val;
        this.grow(4);
        this.u8.set(view_U32_u8, this.length - 4);
    }
    append_U64(val) {
        view_U64[0] = val;
        this.grow(8);
        this.u8.set(view_U64_u8, this.length - 8);
    }
    append_I8(val) {
        this.grow(1);
        this.u8[this.length - 1] = val;
    }
    append_I16(val) {
        view_I16[0] = val;
        this.grow(2);
        this.u8.set(view_I16_u8, this.length - 2);
    }
    append_I32(val) {
        view_I32[0] = val;
        this.grow(4);
        this.u8.set(view_I32_u8, this.length - 4);
    }
    append_I64(val) {
        view_I64[0] = val;
        this.grow(8);
        this.u8.set(view_I64_u8, this.length - 8);
    }
    append_F32(val) {
        view_F32[0] = val;
        this.grow(4);
        this.u8.set(view_F32_u8, this.length - 4);
    }
    append_F64(val) {
        view_F64[0] = val;
        this.grow(8);
        this.u8.set(view_F64_u8, this.length - 8);
    }
    // set little endian methods
    set_U8(val, offset) {
        this.growIfNoSpace(offset, 1);
        this.u8[offset] = val;
    }
    set_U16(val, offset) {
        view_U16[0] = val;
        this.growIfNoSpace(offset, 2);
        this.set_buffer(view_U16_u8, offset);
    }
    set_U32(val, offset) {
        view_U32[0] = val;
        this.growIfNoSpace(offset, 4);
        this.set_buffer(view_U32_u8, offset);
    }
    set_U64(val, offset) {
        view_U64[0] = val;
        this.growIfNoSpace(offset, 8);
        this.set_buffer(view_U64_u8, offset);
    }
    set_I8(val, offset) {
        this.growIfNoSpace(offset, 1);
        this.u8[offset] = val;
    }
    set_I16(val, offset) {
        view_I16[0] = val;
        this.growIfNoSpace(offset, 2);
        this.set_buffer(view_I16_u8, offset);
    }
    set_I32(val, offset) {
        view_I32[0] = val;
        this.growIfNoSpace(offset, 4);
        this.set_buffer(view_I32_u8, offset);
    }
    set_I64(val, offset) {
        view_I64[0] = val;
        this.growIfNoSpace(offset, 8);
        this.set_buffer(view_I64_u8, offset);
    }
    set_F32(val, offset) {
        view_F32[0] = val;
        this.growIfNoSpace(offset, 4);
        this.set_buffer(view_F32_u8, offset);
    }
    set_F64(val, offset) {
        view_F64[0] = val;
        this.growIfNoSpace(offset, 8);
        this.set_buffer(view_F64_u8, offset);
    }
    // set aligned little endian methods
    set_U16_aligned(val, offset) {
        view_U16[0] = val;
        offset *= 2;
        this.growIfNoSpace(offset, 2);
        this.set_buffer(view_U16_u8, offset);
    }
    set_U32_aligned(val, offset) {
        view_U32[0] = val;
        offset *= 4;
        this.growIfNoSpace(offset, 4);
        this.set_buffer(view_U32_u8, offset);
    }
    set_U64_aligned(val, offset) {
        view_U64[0] = val;
        offset *= 8;
        this.growIfNoSpace(offset, 8);
        this.set_buffer(view_U64_u8, offset);
    }
    set_I16_aligned(val, offset) {
        view_I16[0] = val;
        offset *= 2;
        this.growIfNoSpace(offset, 2);
        this.set_buffer(view_I16_u8, offset);
    }
    set_I32_aligned(val, offset) {
        view_I32[0] = val;
        offset *= 4;
        this.growIfNoSpace(offset, 4);
        this.set_buffer(view_I32_u8, offset);
    }
    set_I64_aligned(val, offset) {
        view_I64[0] = val;
        offset *= 8;
        this.growIfNoSpace(offset, 8);
        this.set_buffer(view_I64_u8, offset);
    }
    set_F32_aligned(val, offset) {
        view_F32[0] = val;
        offset *= 4;
        this.growIfNoSpace(offset, 4);
        this.set_buffer(view_F32_u8, offset);
    }
    set_F64_aligned(val, offset) {
        view_F64[0] = val;
        offset *= 8;
        this.growIfNoSpace(offset, 8);
        this.set_buffer(view_F64_u8, offset);
    }
    // append big endian methods
    append_U16BE(val) {
        view_U16[0] = val;
        this.grow(2);
        BE_writer_2(this.u8, view_U16_u8, this.length - 2);
    }
    append_U32BE(val) {
        view_U32[0] = val;
        this.grow(4);
        BE_writer_4(this.u8, view_U32_u8, this.length - 4);
    }
    append_U64BE(val) {
        view_U64[0] = val;
        this.grow(8);
        BE_writer_8(this.u8, view_U64_u8, this.length - 8);
    }
    append_I16BE(val) {
        view_I16[0] = val;
        this.grow(2);
        BE_writer_2(this.u8, view_I16_u8, this.length - 2);
    }
    append_I32BE(val) {
        view_I32[0] = val;
        this.grow(4);
        BE_writer_4(this.u8, view_I32_u8, this.length - 4);
    }
    append_I64BE(val) {
        view_I64[0] = val;
        this.grow(8);
        BE_writer_8(this.u8, view_I64_u8, this.length - 8);
    }
    append_F32BE(val) {
        view_F32[0] = val;
        this.grow(4);
        BE_writer_4(this.u8, view_F32_u8, this.length - 4);
    }
    append_F64BE(val) {
        view_F64[0] = val;
        this.grow(8);
        BE_writer_8(this.u8, view_F64_u8, this.length - 8);
    }
    // set big endian methods
    set_U16BE(val, offset) {
        view_U16[0] = val;
        this.growIfNoSpace(offset, 2);
        BE_writer_2(this.u8, view_U16_u8, offset);
    }
    set_U32BE(val, offset) {
        view_U32[0] = val;
        this.growIfNoSpace(offset, 4);
        BE_writer_4(this.u8, view_U32_u8, offset);
    }
    set_U64BE(val, offset) {
        view_U64[0] = val;
        this.growIfNoSpace(offset, 8);
        BE_writer_8(this.u8, view_U64_u8, offset);
    }
    set_I16BE(val, offset) {
        view_I16[0] = val;
        this.growIfNoSpace(offset, 2);
        BE_writer_2(this.u8, view_I16_u8, offset);
    }
    set_I32BE(val, offset) {
        view_I32[0] = val;
        this.growIfNoSpace(offset, 4);
        BE_writer_4(this.u8, view_I32_u8, offset);
    }
    set_I64BE(val, offset) {
        view_I64[0] = val;
        this.growIfNoSpace(offset, 8);
        BE_writer_8(this.u8, view_I64_u8, offset);
    }
    set_F32BE(val, offset) {
        view_F32[0] = val;
        this.growIfNoSpace(offset, 4);
        BE_writer_4(this.u8, view_F32_u8, offset);
    }
    set_F64BE(val, offset) {
        view_F64[0] = val;
        this.growIfNoSpace(offset, 8);
        BE_writer_8(this.u8, view_F64_u8, offset);
    }
    // set aligned big endian methods
    set_U16BE_aligned(val, offset) {
        view_U16[0] = val;
        offset *= 2;
        this.growIfNoSpace(offset, 2);
        BE_writer_2(this.u8, view_U16_u8, offset);
    }
    set_U32BE_aligned(val, offset) {
        view_U32[0] = val;
        offset *= 4;
        this.growIfNoSpace(offset, 4);
        BE_writer_4(this.u8, view_U32_u8, offset);
    }
    set_U64BE_aligned(val, offset) {
        view_U64[0] = val;
        offset *= 8;
        this.growIfNoSpace(offset, 8);
        BE_writer_8(this.u8, view_U64_u8, offset);
    }
    set_I16BE_aligned(val, offset) {
        view_I16[0] = val;
        offset *= 2;
        this.growIfNoSpace(offset, 2);
        BE_writer_2(this.u8, view_I16_u8, offset);
    }
    set_I32BE_aligned(val, offset) {
        view_I32[0] = val;
        offset *= 4;
        this.growIfNoSpace(offset, 4);
        BE_writer_4(this.u8, view_I32_u8, offset);
    }
    set_I64BE_aligned(val, offset) {
        view_I64[0] = val;
        offset *= 8;
        this.growIfNoSpace(offset, 8);
        BE_writer_8(this.u8, view_I64_u8, offset);
    }
    set_F32BE_aligned(val, offset) {
        view_F32[0] = val;
        offset *= 4;
        this.growIfNoSpace(offset, 4);
        BE_writer_4(this.u8, view_F32_u8, offset);
    }
    set_F64BE_aligned(val, offset) {
        view_F64[0] = val;
        offset *= 8;
        this.growIfNoSpace(offset, 8);
        BE_writer_8(this.u8, view_F64_u8, offset);
    }
}
;
