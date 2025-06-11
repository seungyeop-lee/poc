import CryptoJS from 'crypto-js';

/**
 * Creates HMAC-SHA256 hash with Base64 encoding
 *
 * @param plainText - Text to be encrypted
 * @param secretKey - Secret key for HMAC
 * @returns Base64 encoded HMAC value
 */
export function makeHmac(plainText: string, secretKey: string): string {
    if (!plainText || !secretKey) {
        return '';
    }

    const hmac = CryptoJS.HmacSHA256(plainText, secretKey);
    return CryptoJS.enc.Base64.stringify(hmac);
}
