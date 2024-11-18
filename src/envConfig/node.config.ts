import {registerAs} from '@nestjs/config';

export default registerAs('default', () => ({
    environment: process.env.ENVIRONMENT,
    firebaseSecretPath: process.env.FIREBASE_SECRET_PATH,
    uploadedFileUrl: (process.env.UPLOADED_FILE_URL == null) ? "http://192.168.178.44:3001" : process.env.UPLOADED_FILE_URL,
}));
