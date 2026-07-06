import multer from "multer";
import fs from "fs";

export const Multer = (allowedExtension = []) => {
  const storage = multer.diskStorage({});
  const fileFilter = (req, file, cb) => {
    if (!allowedExtension.includes(file.mimetype)) {
      return cb(new Error("Invalid file type"), false);
    }
    cb(null, true);
  };

    const upload = multer({ fileFilter, storage: storage });
    return upload;
};