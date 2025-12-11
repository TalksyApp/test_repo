const bcrypt = require('bcryptjs');
const pass = '123456';
bcrypt.hash(pass, 10, function (err, hash) {
    if (err) console.error(err);
    console.log("HASH:", hash);
});
