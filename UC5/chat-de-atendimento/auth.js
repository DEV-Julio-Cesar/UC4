// auth.js
const VALID_USERS = {
    'admin': '123456',
    'user': 'senha123'
};

/**
 * Valida o usuário e a senha.
 * @param {string} username 
 * @param {string} password 
 * @returns {boolean}
 */
function validateCredentials(username, password) {
    const expectedPassword = VALID_USERS[username];
    // Simples comparação: em produção, use hashing (bcrypt, etc.)
    return expectedPassword && expectedPassword === password;
}

module.exports = { validateCredentials };