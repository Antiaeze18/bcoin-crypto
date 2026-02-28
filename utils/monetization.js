// Monetization functions for ads and CPA offers

const watchAd = () => {
    try {
        // Trigger PropellerAds popunder/interstitial - exact implementation as specified
        window.open("https://bcoin-382da.web.app", "_blank");
        console.log('PropellerAds triggered successfully');
        return true;
    } catch (error) {
        console.error('Error triggering PropellerAds:', error);
        return false;
    }
};

const openSurveyOffer = () => {
    try {
        // Open CPA survey offer - exact link as specified
        window.open("https://singingfiles.com/show.php?l=0&u=2399646&id=69339", "_blank");
        console.log('CPA survey offer opened successfully');
        return true;
    } catch (error) {
        console.error('Error opening CPA survey offer:', error);
        return false;
    }
};

const trackTaskCompletion = async (userId, taskType, reward) => {
    try {
        // Log task completion in Firebase for analytics
        await window.db.collection('taskCompletions').add({
            userId: userId,
            taskType: taskType,
            reward: reward,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            status: 'completed'
        });
        
        console.log(`Task ${taskType} completion tracked for user ${userId}`);
        return true;
    } catch (error) {
        console.error('Error tracking task completion:', error);
        return false;
    }
};

const openAppInstallOffer = () => {
    try {
        // Placeholder for future app install CPA offers
        window.open("https://play.google.com/store", "_blank");
        console.log('App install offer opened');
        return true;
    } catch (error) {
        console.error('Error opening app install offer:', error);
        return false;
    }
};

const openSocialMediaTask = (platform) => {
    try {
        const socialLinks = {
            facebook: "https://facebook.com/bcoin",
            twitter: "https://twitter.com/bcoin", 
            instagram: "https://instagram.com/bcoin",
            youtube: "https://youtube.com/@bcoin"
        };
        
        const link = socialLinks[platform] || "https://facebook.com";
        window.open(link, "_blank");
        console.log(`${platform} social media task opened`);
        return true;
    } catch (error) {
        console.error(`Error opening ${platform} task:`, error);
        return false;
    }
};

// Make functions globally available
window.watchAd = watchAd;
window.openSurveyOffer = openSurveyOffer;
window.trackTaskCompletion = trackTaskCompletion;
window.openAppInstallOffer = openAppInstallOffer;
window.openSocialMediaTask = openSocialMediaTask;
