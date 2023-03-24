/// <reference types="node" resolution-mode="require"/>
export declare class BufferBuilder {
    length: number;
    u8: Uint8Array;
    constructor(size?: number, length?: number);
    alloc(): void;
    grow(n: number): void;
    growIfNoSpace(offset: number, insertLength: number): void;
    set_buffer(view: ArrayBufferView, offset?: number): void;
    set_BE16_buffer(view: ArrayBufferView, offset?: number): void;
    set_BE32_buffer(view: ArrayBufferView, offset?: number): void;
    set_BE64_buffer(view: ArrayBufferView, offset?: number): void;
    append_buffer(buff: ArrayBufferView): void;
    append_BE16_buffer(buff: ArrayBufferView): void;
    append_BE32_buffer(buff: ArrayBufferView): void;
    append_BE64_buffer(buff: ArrayBufferView): void;
    export_u8(): Uint8Array;
    export_buffer(): Buffer;
    export(): Uint8Array | Buffer;
    append_U8(val: number): void;
    append_U16(val: number): void;
    append_U32(val: number): void;
    append_U64(val: bigint): void;
    append_I8(val: number): void;
    append_I16(val: number): void;
    append_I32(val: number): void;
    append_I64(val: bigint): void;
    append_F32(val: number): void;
    append_F64(val: number): void;
    set_U8(val: number, offset: number): void;
    set_U16(val: number, offset: number): void;
    set_U32(val: number, offset: number): void;
    set_U64(val: bigint, offset: number): void;
    set_I8(val: number, offset: number): void;
    set_I16(val: number, offset: number): void;
    set_I32(val: number, offset: number): void;
    set_I64(val: bigint, offset: number): void;
    set_F32(val: number, offset: number): void;
    set_F64(val: number, offset: number): void;
    set_U16_aligned(val: number, offset: number): void;
    set_U32_aligned(val: number, offset: number): void;
    set_U64_aligned(val: bigint, offset: number): void;
    set_I16_aligned(val: number, offset: number): void;
    set_I32_aligned(val: number, offset: number): void;
    set_I64_aligned(val: bigint, offset: number): void;
    set_F32_aligned(val: number, offset: number): void;
    set_F64_aligned(val: number, offset: number): void;
    append_U16BE(val: number): void;
    append_U32BE(val: number): void;
    append_U64BE(val: bigint): void;
    append_I16BE(val: number): void;
    append_I32BE(val: number): void;
    append_I64BE(val: bigint): void;
    append_F32BE(val: number): void;
    append_F64BE(val: number): void;
    set_U16BE(val: number, offset: number): void;
    set_U32BE(val: number, offset: number): void;
    set_U64BE(val: bigint, offset: number): void;
    set_I16BE(val: number, offset: number): void;
    set_I32BE(val: number, offset: number): void;
    set_I64BE(val: bigint, offset: number): void;
    set_F32BE(val: number, offset: number): void;
    set_F64BE(val: number, offset: number): void;
    set_U16BE_aligned(val: number, offset: number): void;
    set_U32BE_aligned(val: number, offset: number): void;
    set_U64BE_aligned(val: bigint, offset: number): void;
    set_I16BE_aligned(val: number, offset: number): void;
    set_I32BE_aligned(val: number, offset: number): void;
    set_I64BE_aligned(val: bigint, offset: number): void;
    set_F32BE_aligned(val: number, offset: number): void;
    set_F64BE_aligned(val: number, offset: number): void;
}
//# sourceMappingURL=index.d.ts.map