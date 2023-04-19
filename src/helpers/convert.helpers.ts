import { Buffer } from 'buffer'

/**
 * Converts a data URI to a Blob object.
 *
 * @param dataURI - The data URI to be converted to a Blob.
 * @param mimeType - The MIME type of the file being converted.
 *
 * @returns A Blob object representing the file.
 */

export function dataUriToBlob(dataURI: string, mimeType: string): Blob {
  const arrayBuffer = Buffer.from(dataURI, 'base64')

  return new Blob([new Uint8Array(arrayBuffer)], {
    type: mimeType,
  })
}

export async function dataUriToBlobViaFetch(dataURI: string): Promise<Blob> {
  const response = await fetch(dataURI)
  const blob = await response.blob()

  return blob
}
