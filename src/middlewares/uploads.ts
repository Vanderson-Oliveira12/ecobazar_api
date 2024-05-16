import multer from 'multer';
import path from "path";
import fs from "fs";

export function handleUpload(folderName: string) {

    const folderPath = path.resolve(__dirname, "../", "uploads", folderName);

    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
    }
    
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, folderPath);
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
        }
    })

    return multer({storage: storage});
}