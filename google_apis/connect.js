import fs from "fs";
import { google } from "googleapis";
import apikeys from "../apikey.json" assert  {type : "json"};
import { PassThrough } from 'stream';
const SCOPES = ['https://www.googleapis.com/auth/drive'];

const authorize = async () => {
    try {
        const jwtClient = new google.auth.JWT(
            apikeys.client_email,
            null,
            apikeys.private_key,
            SCOPES
        );

        await jwtClient.authorize();
        return jwtClient;
    } catch (error) {
        console.error("Authorization error:", error);
        return null;
    }
};

/**
 * Check 
 * Cần check xem có phải host không ? 
 */
const uploadFile = async (req,res) => {
    try {
        const uid = res.locals.uid;
        const file = req.file;
        console.log(req.file);
        if(!file) {
            return res.send( { status: 404, message: "Internal server error" });
        }
        const authClient = await authorize()
        const drive = google.drive({ version: 'v3', auth: authClient });
        const uidDrive = await createFolder(uid,drive);
        const fileMetaData = {
            name: file.originalname,
            mimeType: file.mimetype,
            parents: [`${uidDrive}`], // Set the parent folder ID,
        };
        const media = {
            mimeType :  file.mimetype,
            body: bufferToStream(file.buffer),
        };
        
        console.log('Uploading file. Metadata:', fileMetaData);
        const response = await drive.files.create({
            resource: fileMetaData,
            media: media,
            fields: "id,webViewLink"
        });

        console.log('Upload successful. Response:', response.data);

        return res.send({ status: 200, message: "File uploaded successfully", data : {
            id : response.data.id,
            url : response.data.webViewLink
        }})
    } catch (error) {
        console.error("File upload error:", error);
        return res.send( { status: 500, message: "Internal server error" });
    }
};

const bufferToStream = (buffer) => {
    const stream = new PassThrough();
    stream.end(buffer);
    return stream;
};

const getFolderId = async (uid,drive) => {
    try {
        
       
        
        const response = await drive.files.list({
            q: `name='${uid}' and mimeType='application/vnd.google-apps.folder'`,
            fields: 'files(id)',
        });

        if (response.data.files.length > 0) {
            // Thư mục đã tồn tại, trả về ID của nó
            return response.data.files[0].id;
        } else {
            // Thư mục chưa tồn tại
            return null;
        }
    } catch (error) {
        console.error('Error checking folder existence:', error);
        return null;
    }
}
 const createFolder = async(uid,drive) => {
    try {
        
        // Kiểm tra xem thư mục đã tồn tại chưa
        const existingFolderId = await getFolderId(uid,drive);
      
        if (existingFolderId) {
            console.log(`Folder with ID ${existingFolderId} already exists for UID ${uid}`);
            return existingFolderId;
        }

        // Nếu thư mục chưa tồn tại, tạo mới trong thư mục cha có ID là '1hSeNhcO4GNMGgjyFEk6jFg_r7q2SCKq9'
        const folderName = uid;
        const parentFolderId = '1hSeNhcO4GNMGgjyFEk6jFg_r7q2SCKq9';

        const folderMetadata = {
            name: folderName,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [parentFolderId],
        };

        const folder = await drive.files.create({
            resource: folderMetadata,
            fields: 'id',
        });

        console.log(`Folder created with ID: ${folder.data.id}`);
        return folder.data.id;
    } catch (error) {
        return null;
    }
}

export {  uploadFile,createFolder };
