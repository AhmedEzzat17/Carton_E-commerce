import CryptoJS from "crypto-js";

const SECRET_KEY = "fikriti-secret-key-2025"; // غيرها لحاجة خاصة بيك واحتفظ بيها سرية

// تشفير
export const encryptData = (data) => {
  return CryptoJS.AES.encrypt(data.toString(), SECRET_KEY).toString();
};

// فك التشفير
export const decryptData = (encryptedData) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
