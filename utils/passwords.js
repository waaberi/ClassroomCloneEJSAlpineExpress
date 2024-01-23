const bcrypt = require('bcrypt');

module.exports = {
    hash: async (password) => bcrypt.hash(password, 10),
    compare: async (password, hashedPassword, is_node) => bcrypt.compare(password, hashedPassword)
}