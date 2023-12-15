
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
const uploadFiles = async (req, res) => {
    try {
        const uid = res.locals.uid;
        const files = req.files; // Lấy danh sách các files từ req.files thay vì req.file
        console.log(files);

        if (!files || files.length === 0) {
            return res.send({ status: 404, message: 'Files Not Found' });
        }

        const authClient = await authorize();
        const drive = google.drive({ version: 'v3', auth: authClient });

        const uidDrive = await createFolder(uid, drive);

        // Lặp qua danh sách files và thực hiện upload cho từng file
        const uploadPromises = files.map(async (file) => {
            const fileMetaData = {
                name: file.originalname,
                mimeType: file.mimetype,
                parents: [`${uidDrive}`],
            };

            const media = {
                mimeType: file.mimetype,
                body: bufferToStream(file.buffer),
            };

            console.log('Uploading file. Metadata:', fileMetaData);
            const response = await drive.files.create({
                resource: fileMetaData,
                media: media,
                fields: 'id,webViewLink',
            });

            console.log('Upload successful. Response:', response.data);

            return {
                id: response.data.id,
                url: response.data.webViewLink,
            };
        });

        const results = await Promise.all(uploadPromises);

        return res.status(200).send({
            message: 'Files uploaded successfully',
            data: results,
        });
    } catch (error) {
        console.error('Files upload error:', error);
        return res.status(500).send({ message: 'Internal server error' });
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

export {  uploadFiles,createFolder };
