"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
function writeFileAsync(path, data) {
    return new Promise((resolve, reject) => {
        fs_1.writeFile(path, data, err => {
            if (err)
                reject(err);
            else
                resolve(path);
        });
    });
}
exports.writeFileAsync = writeFileAsync;
function copyFileAsync(src, dst) {
    return new Promise((resolve, reject) => {
        fs_1.readFile(src, (err, data) => {
            if (err || !data) {
                reject(err);
            }
            else {
                fs_1.writeFile(dst, data, err2 => {
                    if (err2)
                        reject(err2);
                    else
                        resolve(dst);
                });
            }
        });
    });
}
exports.copyFileAsync = copyFileAsync;
//# sourceMappingURL=file.js.map