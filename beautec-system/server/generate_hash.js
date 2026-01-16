const bcrypt = require('bcryptjs');

const password = 'SuperAdmin@codebraze';

(async () => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    console.log('Password:', password);
    console.log('Hash:', hash);
})();
