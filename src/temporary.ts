const temp = require('temp'); // TODO: add typings

temp.track();

export function createTemp() {
    return new Promise<string>((resolve, reject) => {
        temp.mkdir('com.ceriously.magnemite', (err: Error, dirPath: string) => {
            if (err) {
                reject(err);
            } else {
                resolve(dirPath);
            }
        });
    });
}

export function cleanup() {
    return temp.cleanupSync();
}