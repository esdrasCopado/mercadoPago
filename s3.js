import { S3Client, PutObjectCommand, ListObjectsCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { AWS_BUCKET_NAME, AWS_BUCKET_REGION, AWS_PUBLIC_KEY, AWS_SECRET_KEY } from './config.js';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fs from 'fs';


const client = new S3Client({
    region: AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: AWS_PUBLIC_KEY,
        secretAccessKey: AWS_SECRET_KEY
    }
});

export async function upLoadFile(file) {
    const stream = fs.createReadStream(file.tempFilePath);
    const uploadParams = {
        Bucket: AWS_BUCKET_NAME,
        Key: file.name,
        Body: stream
    };
    const comand = new PutObjectCommand(uploadParams);
    return await client.send(comand);
}

export async function getFiles() {
    const command = new ListObjectsCommand({
        Bucket: AWS_BUCKET_NAME
    });
    return (await client.send(command)).Contents;
}

export async function getFileURL() {
    try {
        const files = await getFiles();
        const resultList = new Array; // Inicializar como una cadena vacía
        
        for(let i = 0; i < files.length; i++) {
            const command = new GetObjectCommand({
                Bucket: AWS_BUCKET_NAME,
                Key: files[i].Key
            });
            const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });
            resultList.push(signedUrl); // Agregar la URL al arreglo
        }
        
        return resultList;
    } catch (error) {
        console.error('Error al obtener URLs de objetos en el bucket:', error);
        throw error;
    }
}
