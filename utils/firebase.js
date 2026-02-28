// Wait for Firebase to load
if (typeof firebase === 'undefined') {
    console.error('Firebase not loaded');
    throw new Error('Firebase SDK not loaded');
}

const firebaseConfig = {
    apiKey: "AIzaSyBxAe0q0qiTP8b-xDGu4vUzmARPagMflZw",
    authDomain: "bcoin-382da.firebaseapp.com",
    projectId: "bcoin-382da",
    storageBucket: "bcoin-382da.appspot.com",
    messagingSenderId: "20327148967",
    appId: "1:20327148967:web:5debea0f5b480cb46e9a82"
};

try {
    // Initialize Firebase
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        console.log('Firebase app initialized');
    }
    
    // Initialize services
    window.db = firebase.firestore();
    window.auth = firebase.auth();
    
    // Enable offline persistence for better user experience
    window.db.enablePersistence({ synchronizeTabs: true }).catch((err) => {
        if (err.code === 'failed-precondition') {
            console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
        } else if (err.code === 'unimplemented') {
            console.log('The current browser does not support offline persistence');
        }
    });
    
    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Firebase initialization error:', error);
    reportError(error);
}

const generateReferralCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const createUserDocument = async (user, referralCode = null) => {
    try {
        console.log('Creating user document for:', user.uid);
        const userRef = window.db.collection('users').doc(user.uid);
        const userData = {
            email: user.email,
            balance: referralCode ? 15 : 10,
            referralCode: generateReferralCode(),
            referredBy: referralCode,
            referralCount: 0,
            lastMining: null,
            totalMined: 0,
            tasksCompleted: 0,
            joinDate: firebase.firestore.FieldValue.serverTimestamp(),
            isAdmin: false
        };
        
        await userRef.set(userData);
        console.log('User document created with balance:', userData.balance);
        
        // Handle referral bonus
        if (referralCode) {
            console.log('Processing referral code:', referralCode);
            const referrerQuery = await window.db.collection('users')
                .where('referralCode', '==', referralCode)
                .get();
            
            if (!referrerQuery.empty) {
                const referrerDoc = referrerQuery.docs[0];
                await referrerDoc.ref.update({
                    balance: firebase.firestore.FieldValue.increment(10),
                    referralCount: firebase.firestore.FieldValue.increment(1)
                });
                console.log('Referral bonus awarded to:', referrerDoc.id);
            } else {
                console.log('Referral code not found:', referralCode);
            }
        }
        
        return userData;
    } catch (error) {
        console.error('Error creating user document:', error);
        throw error;
    }
};

window.createUserDocument = createUserDocument;
window.generateReferralCode = generateReferralCode;
