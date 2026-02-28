const MINING_COOLDOWN = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
const MINING_REWARD = 5;

const canMine = (lastMiningTime) => {
    if (!lastMiningTime) return true;
    const now = new Date().getTime();
    const lastMining = lastMiningTime.toDate().getTime();
    return (now - lastMining) >= MINING_COOLDOWN;
};

const getNextMiningTime = (lastMiningTime) => {
    if (!lastMiningTime) return null;
    const lastMining = lastMiningTime.toDate().getTime();
    return new Date(lastMining + MINING_COOLDOWN);
};

const performMining = async (uid) => {
    try {
        // Check if Firebase is initialized
        if (!window.db || !window.auth) {
            throw new Error('Firebase not initialized. Please refresh the page.');
        }

        // Check if user is authenticated
        const currentUser = window.auth.currentUser;
        if (!currentUser || currentUser.uid !== uid) {
            throw new Error('User not authenticated or UID mismatch.');
        }

        console.log('Starting mining for user:', uid);

        const userRef = window.db.collection('users').doc(uid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            throw new Error('User document not found in database.');
        }

        const userData = userDoc.data();
        console.log('User data retrieved:', { balance: userData.balance, lastMining: userData.lastMining });

        if (!canMine(userData.lastMining)) {
            const nextTime = getNextMiningTime(userData.lastMining);
            throw new Error(`Mining cooldown active. Next mining available at ${nextTime ? nextTime.toLocaleString() : 'unknown'}`);
        }

        const now = firebase.firestore.FieldValue.serverTimestamp();

        console.log('Updating user balance and mining history...');
        await userRef.update({
            balance: firebase.firestore.FieldValue.increment(MINING_REWARD),
            lastMining: now,
            totalMined: firebase.firestore.FieldValue.increment(MINING_REWARD)
        });

        await window.db.collection('miningHistory').add({
            userId: uid,
            amount: MINING_REWARD,
            timestamp: now
        });

        console.log('Mining successful, reward:', MINING_REWARD);
        return MINING_REWARD;
    } catch (error) {
        console.error('Mining error:', error);
        throw error;
    }
};

const completeTask = async (uid, taskType, reward = 10) => {
    try {
        const userRef = window.db.collection('users').doc(uid);
        
        await userRef.update({
            balance: firebase.firestore.FieldValue.increment(reward),
            tasksCompleted: firebase.firestore.FieldValue.increment(1)
        });
        
        await window.db.collection('taskHistory').add({
            userId: uid,
            taskType: taskType,
            reward: reward,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        return reward;
    } catch (error) {
        console.error('Task completion error:', error);
        throw error;
    }
};

window.canMine = canMine;
window.getNextMiningTime = getNextMiningTime;
window.performMining = performMining;
window.completeTask = completeTask;
window.MINING_REWARD = MINING_REWARD;
