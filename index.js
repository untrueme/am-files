
import { web } from '@am/server';
import BusBoy from 'busboy';
import path from 'path';
import fs from 'fs';
import crypto from "crypto";

web.on('POST', '/upload', (context) => {
    var bb = new BusBoy({ headers: context.req.headers });
    bb.on('file', function (fieldname, file, filename) {
        crypto.pseudoRandomBytes(16, (err, raw) => {
            const hex = raw.toString('hex');
            const destination = `uploads/${hex.substr(0, 2)}/${hex.substr(2, 2)}/`;
            
            fs.promises.mkdir(destination, { recursive: true }).then(() => {
                file._filename = hex;
                context.fileStream = file;
                const saveTo = path.join(process.cwd(), `${destination}/${filename}`);
                file.pipe(fs.createWriteStream(saveTo));
            });
        });
    });

    bb.on('finish', function () {
        context.code(200);
        context.send({id: context.fileStream._filename});
    });

    context.req.pipe(bb);
});

