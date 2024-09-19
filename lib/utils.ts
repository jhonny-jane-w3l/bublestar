import fs from 'fs';
import path from 'path';

//Chemin vers le fichier de log
const logFilePath = path.join(process.cwd(), 'auth-logs.txt');

export const writeLogToFile = (message: string) => {
    const logMessage = `${new Date().toISOString()} - ${message}\n`;
    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) {
        console.error('Erreur lors de l\'écriture dans le fichier de log:', err);
        }
    });
};


