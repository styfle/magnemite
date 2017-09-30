import { writeFile, readFile } from 'fs';

export function writeFileAsync(path: string, data: any)  {
    return new Promise<string>((resolve, reject) => {
        writeFile(path, data, err => {
            if (err)
                reject(err);
            else
                resolve(path);
        });
    });
}

export function copyFileAsync(src: string, dst: string) {
    return new Promise<string>((resolve, reject) => {
        readFile(src, (err, data) => {
            if (err || !data) {
                reject(err);
            } else {
                writeFile(dst, data, err2 => {
                    if (err2)
                        reject(err2);
                    else
                        resolve(dst);
                });
            }
        });
    });
}