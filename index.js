
import { web } from '@am/server';
import asyncBusboy from 'async-busboy';
import path from 'path';
import fs from 'fs';
import crypto from "crypto";

web.on('POST', '/upload',async (context) => {
    await asyncBusboy(context.req, {
        onFile: function(fieldname, file, filename, encoding, mimetype) {
            crypto.pseudoRandomBytes(16, (err, raw) => {
                const hex = raw.toString('hex');
                const destination = `uploads/${hex.substr(0, 2)}/${hex.substr(2, 2)}/`;
                
                fs.promises.mkdir(destination, { recursive: true }).then(() => {
                    file._filename = hex;
                    context.fileStream = file;
                    const saveTo = path.join(process.cwd(), `${destination}/${filename}`);
                    file.pipe(fs.createWriteStream(saveTo));
                    context.send({id: context.fileStream._filename});
                });
            });
        }
      });
});

