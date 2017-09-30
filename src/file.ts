import { writeFile } from 'fs';

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