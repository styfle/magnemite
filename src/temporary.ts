const temp = require('temp'); // TODO: add typings

export function createTemp() {
    return new Promise<string>((resolve, reject) => {
        temp.mkdir('com.ceriously.magnemite', (err: Error, dirPath: string) => {
            if (err) {
                reject(err);
            } else {
                temp.track();
                resolve(dirPath);
            }
        });
    });
}