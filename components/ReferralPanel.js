function ReferralPanel({ user, userData }) {
    try {
        const [copied, setCopied] = React.useState(false);
        const [referrals, setReferrals] = React.useState([]);

        const referralLink = `${window.location.origin}?ref=${userData?.referralCode}`;

        const copyToClipboard = async () => {
            try {
                await navigator.clipboard.writeText(referralLink);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (error) {
                console.error('Copy failed:', error);
            }
        };

        React.useEffect(() => {
            const fetchReferrals = async () => {
                try {
                    if (userData?.referralCode) {
                        const referralsQuery = await db.collection('users')
                            .where('referredBy', '==', userData.referralCode)
                            .orderBy('joinDate', 'desc')
                            .limit(10)
                            .get();
                        
                        const referralsList = referralsQuery.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data()
                        }));
                        setReferrals(referralsList);
                    }
                } catch (error) {
                    console.error('Error fetching referrals:', error);
                }
            };

            fetchReferrals();
        }, [userData]);

        return (
            <div data-name="referral-panel" data-file="components/ReferralPanel.js" className="space-y-6">
                <div className="panel-card rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">🤝 Referral Program</h2>
                    <p className="text-gray-600 mb-6">Invite friends and earn 10 BC for each successful referral!</p>
                    
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white mb-6">
                        <h3 className="text-lg font-bold mb-2">Your Referral Stats</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold">{userData?.referralCount || 0}</div>
                                <div className="text-sm opacity-90">Total Referrals</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold">{(userData?.referralCount || 0) * 10}</div>
                                <div className="text-sm opacity-90">BC Earned</div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Your Referral Code</label>
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={userData?.referralCode || ''}
                                    readOnly
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                />
                                <button
                                    onClick={copyToClipboard}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    {copied ? '✓' : 'Copy'}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Referral Link</label>
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={referralLink}
                                    readOnly
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                                />
                                <button
                                    onClick={copyToClipboard}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                >
                                    Share
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="panel-card rounded-lg p-6">
                    <h3 className="text-lg font-bold mb-4">👥 Your Referrals</h3>
                    {referrals.length > 0 ? (
                        <div className="space-y-3">
                            {referrals.map(referral => (
                                <div key={referral.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium">{referral.email}</p>
                                        <p className="text-sm text-gray-500">
                                            Joined: {referral.joinDate ? new Date(referral.joinDate.toDate()).toLocaleDateString() : 'Recently'}
                                        </p>
                                    </div>
                                    <div className="text-green-600 font-medium">+10 BC</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No referrals yet. Start inviting friends!</p>
                    )}
                </div>
            </div>
        );
    } catch (error) {
        console.error('ReferralPanel component error:', error);
        reportError(error);
    }
}
