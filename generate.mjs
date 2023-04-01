import fs from 'fs';

const path = './images';

fs.readdir(path, (err, files) => {
    if (err) {
        console.error(`error opening ${path}`);
        return;
    }

    console.log(`
        export const images = [
    ${files.map((file) => `'./images/${file}'`).join(",\n    ")}
];
    `.trim());
})