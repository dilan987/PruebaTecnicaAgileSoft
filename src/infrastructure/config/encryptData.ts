
import crypto from 'crypto'


const algorithm = 'aes-256-cbc';
const key = Buffer.from('e5df86a2f37417eca6a4b5bf5d390277291464be89ae8317d3cd1ebcddab4f68', 'hex');

export function encrypt(text: string): string {
    console.log(key)
    const iv = crypto.randomBytes(16); 
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text: string): string {
    const [ivHex, encryptedHex] = text.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedText = Buffer.from(encryptedHex, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
