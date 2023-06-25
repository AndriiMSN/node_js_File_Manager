import readline from 'readline';
import {chdir} from 'node:process';
import {homedir} from 'node:os'
import {pwd, up, cd, list, cat, add, rn, cp, mv, rm, os, hash, compress, decompress} from "./utils.js";

let username = 'anonym';
let usernameArgv = process.argv.slice(2).find(el => el.startsWith('--username='));
if (usernameArgv) {
    username = usernameArgv.split('=')[1]
}
chdir(homedir())

console.log(`Welcome to the File Manager, ${username}!`);
pwd()

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


rl.on('line', async (line) => {
    // console.log(line)
    const formattedLine = line.replace(/\s+/g, ' ').trim().split(' ');
    const command = formattedLine[0];
    const arg = formattedLine?.splice(1) || null;

    switch (command) {
        case 'up':
            up();
            break;
        case 'cd':
            cd(arg?.[0]);
            break
        case 'list':
            await list();
            break
        case 'cat':
            await cat(arg?.[0]);
            break;
        case 'add':
            await add(arg?.[0]);
            break;
        case 'rn':
            await rn(arg?.[0], arg?.[1]);
            break;
        case 'cp':
            await cp(arg?.[0], arg?.[1]);
            break;
        case 'mv':
            await mv(arg?.[0], arg?.[1]);
            break;
        case 'rm':
            await rm(arg?.[0]);
            break;
        case 'os':
            await os(arg?.[0], username);
            break
        case 'hash':
            await hash(arg?.[0]);
            break;
        case 'compress':
            await compress(arg?.[0], arg?.[1]);
            break;
        case 'decompress':
            await decompress(arg?.[0], arg?.[1]);
            break;
        default:
            console.log('unknown command');
    }

    pwd()

}).on('close', () => {
    console.log(`Thank you for using File Manager, ${username}, goodbye!`);
    process.exit(0);
});