"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const temp = require('temp');
function createTemp() {
    return new Promise((resolve, reject) => {
        temp.mkdir('com.ceriously.magnemite', (err, dirPath) => {
            if (err) {
                reject(err);
            }
            else {
                temp.track();
                resolve(dirPath);
            }
        });
    });
}
exports.createTemp = createTemp;
//# sourceMappingURL=temporary.js.map