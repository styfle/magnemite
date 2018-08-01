export function toArrayBuffer(blob: Blob) {
    return new Promise<ArrayBuffer>((resolve, reject) => {
        let fileReader = new FileReader();
        fileReader.onload = function(ev) {
            let arrayBuffer = this.result;
            if (arrayBuffer instanceof ArrayBuffer) {
                resolve(arrayBuffer);
            } else {
                reject(new Error('Failed to convert Blob to ArrayBuffer'));
            }
        };
        fileReader.readAsArrayBuffer(blob);
    });
}

export function toTypedArray(ab: ArrayBuffer) {
    return new Uint8Array(ab);
}

export function toBuffer(ab: ArrayBuffer) {
    let buffer = Buffer.alloc(ab.byteLength);
    let arr = new Uint8Array(ab); // TODO: can we just return Uint8Array?
    for (let i = 0; i < arr.byteLength; i++) {
        buffer[i] = arr[i];
    }
    return buffer;
}
