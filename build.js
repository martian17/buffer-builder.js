import { promises as fs } from "fs";
import { importFromString } from "module-from-string";
;
;
class Plain {
    lines = [];
    push(line) {
        this.lines.push(line);
    }
    async render() {
        return this.lines.join("\n");
    }
}
;
class Macro_import {
    indent;
    source;
    name;
    macros;
    constructor(indent, source, name, macros) {
        this.indent = indent;
        this.source = source;
        this.name = name;
        this.macros = macros;
    }
    async render() {
        const { macros, source, name, indent } = this;
        const unit = macros.get(source);
        if (!unit)
            throw new Error(`Unit name ${source} not found`);
        const block = await unit.get(name);
        if (!block)
            throw new Error(`Export of name ${name} not found in the unit ${source}`);
        if (!(block instanceof CodeBlock))
            throw new Error(`Export of name ${name} from the unit ${source} not an instance of CodeBlock`);
        return block.render(indent);
    }
}
;
class Macro_definition {
    lines = [];
    push(line) {
        this.lines.push(line);
    }
    cache;
    async get(name) {
        if (!this.cache) {
            const code = this.lines.join("\n");
            this.cache = await importFromString(code, { globals: { CodeBlock } });
        }
        return this.cache[name];
    }
}
;
// module dependency
class CodeBlock {
    spacing;
    constructor({ spacing = 0 } = {}) {
        this.spacing = spacing;
    }
    lines = [];
    add(text) {
        let lines = text.split("\n");
        //trim off empty lines at the beginning or the end
        let sidx = 0;
        let eidx = lines.length - 1;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.match(/^\s*$/)) {
                sidx++;
            }
            else {
                break;
            }
        }
        for (let i = lines.length - 1; i >= 0; i--) {
            const line = lines[i];
            if (line.match(/^\s*$/)) {
                eidx--;
            }
            else {
                break;
            }
        }
        lines = lines.slice(sidx, eidx + 1);
        //spacing
        if (this.lines.length !== 0) {
            for (let i = 0; i < this.spacing; i++) {
                this.lines.push("");
            }
        }
        //find the common indent
        let baseIndent;
        for (let line of lines) {
            if (line.match(/^\s*$/)) {
                continue;
            }
            let indent = line.match(/^\s*/)[0];
            if (!baseIndent) {
                baseIndent = indent;
                continue;
            }
            if (baseIndent.length > indent.length) {
                baseIndent = baseIndent.slice(0, indent.length);
            }
            else {
                indent = indent.slice(0, baseIndent.length);
            }
            for (let i = 0; i < indent.length; i++) {
                if (indent[i] !== baseIndent[i]) {
                    baseIndent = baseIndent.slice(0, i);
                    break;
                }
            }
        }
        //removing common indent
        for (let line of lines) {
            this.lines.push(line.slice(baseIndent.length));
        }
    }
    render(indent) {
        //loop through the lines, and find the minimum indent
        return this.lines.map(line => indent + line).join("\n");
    }
}
;
const src_path = process.argv[2];
const out_path = process.argv[3];
if (!src_path) {
    console.log("please specify the source file");
}
if (!out_path) {
    console.log("please specify the out file");
}
if (!src_path || !out_path) {
    process.exit();
}
const src = "" + await fs.readFile(src_path);
const lines = src.split("\n");
const slices = [];
const macros = new Map;
let top = new Plain();
slices.push(top);
for (let line of lines) {
    if (!line.match(/^\s*\#\#\@/)) {
        top.push(line);
        continue;
    }
    const indent = line.match(/^\s*/)[0];
    const [command, ...args] = line.trim().slice(3).split(/\s+/);
    if (command === "begin") {
        top = new Macro_definition;
        const name = args[0];
        macros.set(name, top);
    }
    else if (command === "end") {
        top = new Plain;
        slices.push(top);
    }
    else if (command === "import") {
        slices.push(new Macro_import(indent, args[2], args[0], macros));
        top = new Plain;
        slices.push(top);
    }
    else {
        throw new Error(`Unknown macro command: ${command} ${args}`);
    }
}
const code = (await Promise.all(slices.map(async (block) => await block.render()))).join("\n");
await fs.writeFile(out_path, code);
