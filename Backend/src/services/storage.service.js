import ImageKit from '@imagekit/nodejs';
import { config } from '../config/config.js';

const client = new ImageKit({
  privateKey: config.IMAGEKIT_PRIVATE_KEY, // This is the default and can be omitted
});

export async function uploadFile(buffer, fileName, folder = "snitch") {
    const result = await client.upload({
        file: await ImageKit.toFile(buffer),
        fileName,
        folder
    })

    return result
}