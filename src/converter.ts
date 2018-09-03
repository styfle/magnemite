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
    return Buffer.from(ab);
}
