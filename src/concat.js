
const {writeFile, readFile} = require('fs');

function readFileAsync(buffers, i) {
    console.log('readFileAsync', i)
    return new Promise((resolve, reject) => {
        readFile(`./videos/video-nav-${i+1}.webm`, (err, data) => {
            if (err)
                reject(err);
            else {
                buffers[i] = data;
                resolve(buffers);
            }
        });
    });
}

function readMultiple(total) {
    console.log('readMultiple', total);
    let buffers = [];
    let promises = [];
    return new Promise((resolve, reject) => {
        for (let i = 0; i < total; i++) {
            promises.push(readFileAsync(buffers, i));
        }

        Promise.all(promises)
            .then(() => resolve(buffers))
            .catch(reject);
    });
}


function writeOutput(buffers) {
    console.log('writeOutput', buffers.length, buffers);
    return new Promise((resolve, reject) => {
        const output = Buffer.concat(buffers, buffers.length);

        writeFile('./videos/full-video.webm', output, (err) => {
            if (err)
                reject(err)
            else
                resolve('success!');
        });
    });
}


readMultiple(4).then(writeOutput).catch(console.error);
