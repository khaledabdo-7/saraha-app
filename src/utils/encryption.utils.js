import CryptoJS from "crypto-js";

export const encryption = async ({ value, secretKey } = {}) => {
  return CryptoJS.AES.encrypt(JSON.stringify(value), secretKey).toString();
};

export const decryption = async ({ cypher, secretKey } = {}) => {
  return CryptoJS.AES.decrypt(cypher, secretKey).toString(CryptoJS.enc.Utf8);
};
