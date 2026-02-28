const signUpUser = async (email, password, referralCode = null) => {
    try {
        console.log('Attempting to sign up user:', email);
        const userCredential = await window.auth.createUserWithEmailAndPassword(email, password);
        console.log('User created successfully:', userCredential.user.uid);
        
        await window.createUserDocument(userCredential.user, referralCode);
        console.log('User document created successfully');
        
        return userCredential.user;
    } catch (error) {
        console.error('Sign up error:', error.code, error.message);
        throw error;
    }
};

const signInUser = async (email, password) => {
    try {
        console.log('Attempting to sign in user:', email);
        const userCredential = await window.auth.signInWithEmailAndPassword(email, password);
        console.log('User signed in successfully:', userCredential.user.uid);
        
        return userCredential.user;
    } catch (error) {
        console.error('Sign in error:', error.code, error.message);
        throw error;
    }
};

const signOutUser = async () => {
    try {
        await window.auth.signOut();
        console.log('User signed out successfully');
    } catch (error) {
        console.error('Sign out error:', error);
        throw error;
    }
};

const getCurrentUserData = async (uid) => {
    try {
        const userDoc = await window.db.collection('users').doc(uid).get();
        if (userDoc.exists) {
            console.log('User data retrieved successfully');
            return { id: userDoc.id, ...userDoc.data() };
        }
        console.log('User document not found, creating new document');
        return null;
    } catch (error) {
        console.error('Error getting user data:', error);
        throw error;
    }
};

const updateUserBalance = async (uid, amount) => {
    try {
        await window.db.collection('users').doc(uid).update({
            balance: firebase.firestore.FieldValue.increment(amount)
        });
        console.log('User balance updated successfully');
    } catch (error) {
        console.error('Error updating balance:', error);
        throw error;
    }
};

window.signUpUser = signUpUser;
window.signInUser = signInUser;
window.signOutUser = signOutUser;
window.getCurrentUserData = getCurrentUserData;
window.updateUserBalance = updateUserBalance;
