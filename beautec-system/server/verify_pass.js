
const bcrypt = require('bcryptjs');
const hash = '$2b$10$tpyAGcPaf9VHQaGQhOgMOuMYegRSDpUW2FA.PK4RecpzM56ME.LZ2';
const password = 'admin';

bcrypt.compare(password, hash).then(res => {
    console.log(`Password 'admin' match: ${res}`);
});
