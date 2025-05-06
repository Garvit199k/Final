// In-memory database (for demo purposes)
const database = {
    users: new Map(),
    addUser(username, hashedPassword, gender) {
        this.users.set(username, { username, password: hashedPassword, gender });
    },
    getUser(username) {
        return this.users.get(username);
    },
    userExists(username) {
        return this.users.has(username);
    }
};

module.exports = database; 