import {BufferBuilder} from "../index.mjs";

const bb = new BufferBuilder();

for(let i = 0; i < 10000; i++){
    bb.append_I64BE(1n);
}

const res = bb.export();
console.log(res);



