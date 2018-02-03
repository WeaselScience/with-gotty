const { spawn, spawnSync } = require('child_process');

const gottyProcess = spawn('gotty', [
    'tmux',
    'a',
    '-t',
    'with-gotty'
]);

const args = process.argv;
args.shift();
args.shift();
console.log(args);

spawnSync('tmux', [
    'new',
    '-d',
    '-s',
    'with-gotty',
    ...args
]);

const monitorProcess = spawn ('tmux', [
    'wait-for',
    'with-gotty'
], {
    stdio: 'inherit'
});

monitorProcess.on('exit', (code) => {
    process.exit(code);
});

process.on('SIGINT', function() {
    console.log('sigint');
    spawnSync('tmux', [ 'kill-session', 'with-gotty' ]);
    gottyProcess.kill();
    monitorProcess.kill();
    process.exit();
});
