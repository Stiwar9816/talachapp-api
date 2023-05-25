import * as crypto from 'crypto'
import * as bcrypt from 'bcryptjs';
require('dotenv').config();

const encryptionKey = process.env.JWT_SECRET
const iv = crypto.randomBytes(16)

export const ensureKeyLength = (key: string, length: number): string => {
    const keyBuffer = Buffer.from(key, 'utf8');
    if (keyBuffer.length === length) {
        return key;
    } else if (keyBuffer.length < length) {
        const padding = Buffer.alloc(length - keyBuffer.length);
        return Buffer.concat([keyBuffer, padding]).toString('utf8');
    } else {
        return keyBuffer.slice(0, length).toString('utf8');
    }
}

export const encrypt = (text: string): string => {
    const cipher = crypto.createCipheriv('aes-256-cbc', ensureKeyLength(encryptionKey, 32), iv)
    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    return encrypted
}

export const decrypt = (encryptedText: string): string => {
    const decipher = crypto.createDecipheriv('aes-256-cbc', ensureKeyLength(encryptionKey, 32), iv)
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
}

export const compareEncryptedPasswords = async (encryptedPassword: string, userInput: string): Promise<boolean> => {
    return await bcrypt.compare(userInput, encryptedPassword);
};