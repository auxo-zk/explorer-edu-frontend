import { Buffer } from 'buffer';
export function bytes32ToString(bytes32: string): string {
    // Remove the '0x' prefix
    const hexString = bytes32.slice(2);

    // Convert the hex string to a buffer
    const buffer = Buffer.from(hexString, 'hex');

    // Convert the buffer to a string and trim any null characters
    return buffer.toString('utf8').replace(/\0/g, '');
}
