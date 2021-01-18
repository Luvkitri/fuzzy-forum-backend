const jsonwebtoken = require('jsonwebtoken');
const { promises: fs, readFileSync } = require('fs');
const path = require('path');

async function getPrivateKey() {
    if (process.env.NODE_ENV === "development") {
        const pathToFile = path.join(__dirname, '..', '/config/id_rsa_priv.pem');
        return await fs.readFile(pathToFile, 'utf8');
    }

    return process.env.PRIVATE_KEY;
}

function getPublicKey() {
    if (process.env.NODE_ENV === "development") {
        const pathToFile = path.join(__dirname, '..', '/config/id_rsa_pub.pem');
        return readFileSync(pathToFile, 'utf8');
    }

    return process.env.PUBLIC_KEY;
}

async function issueJWT(user) {
    const PRIV_KEY = await getPrivateKey();
    const id = user.id;
    const expiresIn = '1m';

    const payload = {
        sub: id,
        iat: Date.now()
    };

    const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
        expiresIn: expiresIn,
        algorithm: 'RS256'
    });

    return {
        token: `Bearer ${signedToken}`,
        expires: expiresIn
    }
}

function firstLetter(word) {
    return word.replace(/^.{1}/g, word[0].toUpperCase());
}

module.exports = {
    issueJWT: issueJWT,
    getPrivateKey: getPrivateKey,
    getPublicKey: getPublicKey,
    firstLetter: firstLetter
};