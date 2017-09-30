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
