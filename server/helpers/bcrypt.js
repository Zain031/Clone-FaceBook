const { compareSync, hashSync} = require("bcryptjs")
const hashPassword = (password) => {
    return hashSync(password)
}
const comparePassword = (password, password_db) => {
    return compareSync(password, password_db)
}

module.exports = { comparePassword, hashPassword }