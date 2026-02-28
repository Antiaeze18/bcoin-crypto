function ProfilePanel({ user, userData }) {
    try {
        const [copied, setCopied] = React.useState(false);

        const copyReferralCode = async () => {
            try {
                await navigator.clipboard.writeText(userData?.referralCode || '');
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (error) {
                console.error('Copy failed:', error);
            }
        };

        return (
            <div data-name="profile-panel" data-file="components/ProfilePanel.js" className="space-y-6">
                <div className="panel-card rounded-lg p-6">
                    <div className="text-center mb-6">
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-user text-white text-2xl"></i>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Profile Information</h2>
                        <p className="text-gray-600">{user?.email}</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                            <span className="font-medium">Email Address</span>
                            <span className="text-gray-600">{user?.email}</span>
                        </div>

                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                            <span className="font-medium">Member Since</span>
                            <span className="text-gray-600">
                                {userData?.joinDate ? new Date(userData.joinDate.toDate()).toLocaleDateString() : 'Today'}
                            </span>
                        </div>

                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                            <span className="font-medium">Referral Code</span>
                            <div className="flex items-center space-x-2">
                                <span className="text-gray-600 font-mono">{userData?.referralCode}</span>
                                <button
                                    onClick={copyReferralCode}
                                    className="text-blue-500 hover:text-blue-700 transition-colors"
                                >
                                    <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}></i>
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                            <span className="font-medium">Account Status</span>
                            <span className="text-green-600 font-medium">Active</span>
                        </div>
                    </div>
                </div>

                <div className="panel-card rounded-lg p-6">
                    <h3 className="text-lg font-bold mb-4">📊 Account Statistics</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{userData?.balance || 0}</div>
                            <div className="text-sm text-gray-600">Current Balance</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{userData?.totalMined || 0}</div>
                            <div className="text-sm text-gray-600">Total Mined</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">{userData?.referralCount || 0}</div>
                            <div className="text-sm text-gray-600">Referrals</div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                            <div className="text-2xl font-bold text-orange-600">{userData?.tasksCompleted || 0}</div>
                            <div className="text-sm text-gray-600">Tasks Completed</div>
                        </div>
                    </div>
                </div>

                <div className="panel-card rounded-lg p-6">
                    <h3 className="text-lg font-bold mb-4">🔐 Security</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span>Two-Factor Authentication</span>
                            <span className="text-yellow-600">Coming Soon</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Security Circle</span>
                            <span className="text-yellow-600">Coming Soon</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Last Login</span>
                            <span className="text-gray-600">Today</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('ProfilePanel component error:', error);
        reportError(error);
    }
}
