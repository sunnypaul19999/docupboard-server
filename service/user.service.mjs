import { queryUser, persistUserIfNotExists } from '../model/user.model.mjs';

async function getUser(userEmail) {
    try {
        return await queryUser(userEmail);
    } catch (err) {
        console.error(err, 'Failed to load user from persistent storage');
        throw new Error('Failed to load user from persistent storage');
    }
}

async function addUser(userId, userEmail) {
    try {
        return await persistUserIfNotExists(userId, userEmail);
    } catch (err) {
        console.error(err, 'Failed to persist user');
        throw new Error('Failed to persist user');
    }
}


export { getUser, addUser };