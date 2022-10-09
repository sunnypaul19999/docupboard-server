import { queryUserByEmail, persistUserIfNotExists, queryUserById } from '../model/user.model.mjs';

async function getUserByEmail(userEmail) {
    try {
        return await queryUserByEmail(userEmail);
    } catch (err) {
        console.error(err, 'Failed to load user from persistent storage');
        throw new Error('Failed to load user from persistent storage');
    }
}

async function getUserById(userId) {
    try {
        return await queryUserById(userId);
    } catch (err) {
        console.error(err, 'Failed to load user from persistent storage');
        throw new Error('Failed to load user from persistent storage');
    }
}

async function addUser(userEmail) {
    try {
        return await persistUserIfNotExists(userEmail);
    } catch (err) {
        console.error(err, 'Failed to persist user');
        throw new Error('Failed to persist user');
    }
}


export { getUserByEmail, getUserById, addUser };