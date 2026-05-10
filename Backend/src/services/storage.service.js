import ImageKit, { toFile } from '@imagekit/nodejs';
import { config } from '../config/config.js';

const client = new ImageKit({
  privateKey: config.IMAGEKIT_PRIVATE_KEY, // This is the default and can be omitted
});

export async function uploadFile(buffer, fileName, folder = "snitch") {
  if (!buffer) {
    throw new Error('Missing file buffer for upload')
  }

  const file = await toFile(buffer, fileName)

  const result = await client.files.upload({
    file,
    fileName,
    folder
  })

  return result
}