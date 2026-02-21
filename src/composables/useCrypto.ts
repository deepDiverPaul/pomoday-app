import { JSEncrypt } from 'jsencrypt';
const secret = import.meta.env.VITE_SECRET;

if (!secret) {
  throw new Error('VITE_SECRET is not set');
}
const crypt = new JSEncrypt();
crypt.setPrivateKey(secret);

export function useCrypto() {
  const encrypt = (value: string) => crypt.encrypt(value);
  const decrypt = (value: string) => crypt.decrypt(value);

  return {
    encrypt,
    decrypt,
  };
}
