import {chdir} from 'node:process';
import {createReadStream, createWriteStream} from "node:fs";
import {readdir, readFile, open, rename, unlink, stat} from 'node:fs/promises';
import {pipeline} from 'node:stream/promises';
import {EOL, cpus, homedir, arch} from 'node:os';
import {createBrotliCompress, createBrotliDecompress} from "node:zlib";

const {createHash} = await import("node:crypto");

export const pwd = () => {
    console.log(`You are currently in ${process.cwd()}`);
}
export const up = () => {
    try {
        chdir('../')
    } catch (err) {
        console.error(`chdir: ${err}`);
    }
}
export const cd = (path) => {
    try {
        chdir(path)
    } catch (err) {
        console.error(`chdir: ${err}`);
    }
}

export const list = async () => {
    try {
        const files = await readdir(process.cwd(), {withFileTypes: true});
        files.forEach((file, index) => {
            // console.log(file.name)
            files[index] = [files[index].name, file.isDirectory() ? 'directory' : 'file']
        });
        console.table(files)
    } catch (e) {
        console.log(e)
    }
}

export const cat = async (path) => {
    try {
        const content = await readFile(path, {encoding: 'utf-8'});
        console.log(content);
    } catch (e) {
        console.log(e)
    }
}

export const add = async (path) => {
    let filehandle;
    try {
        filehandle = await open(path, 'w')
    } catch (e) {
        console.log(e)
    } finally {
        await filehandle?.close();
    }
}

export const rn = async (path, newPath) => {
    try {
        await rename(path, newPath);
    } catch (e) {
        console.log(e)
    }
}

export const cp = async (path, newPath) => {
    try {
        const readStream = createReadStream(path);
        const writeStream = createWriteStream(newPath);
        await pipeline(readStream, writeStream)
    } catch (e) {
        console.log(e)
    }
}

export const mv = async (path, newPath) => {
    try {
        const readStream = createReadStream(path);
        const writeStream = createWriteStream(newPath);
        await pipeline(readStream, writeStream)
        await unlink(path)
    } catch (e) {
        console.log(e)
    }
}

export const rm = async (path) => {
    try {
        await unlink(path);
    } catch (e) {
        console.log(e)
    }
}

export const os = async (param, username) => {
    if (!param.startsWith('--')) {
        console.log('Params must started with --')
        return
    }
    const params = {
        EOL: JSON.stringify(EOL),
        cpus: cpus(),
        homedir: homedir(),
        username: username,
        architecture: arch()
    }

    const data = params[param.slice(2)];
    if (!data) {
        console.log('unknown OS param');
    } else {
        console.log(data)
    }
}

export const hash = async (path) => {
    try {
        const hash256 = createHash("sha256");
        const content = await readFile(path);
        hash256.update(content);
        console.log(hash256.digest('hex'));
    } catch (err) {
        console.log(err);
    }
}

export const compress = async (path, newPath) => {
    try {
        const zip = createBrotliCompress();

        const srcStream = createReadStream(path);
        const dstStream = createWriteStream(newPath);

        await pipeline(srcStream, zip, dstStream);
    } catch (e) {
        console.log(e)
    }
}

export const decompress = async (path, newPath) => {
    try {
        const unzip = createBrotliDecompress();

        const srcStream = createReadStream(path);
        const dstStream = createWriteStream(newPath);

        await pipeline(srcStream, unzip, dstStream);
    } catch (e) {
        console.log(e)
    }
}