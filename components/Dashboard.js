function Dashboard({ user, userData, onUserDataUpdate }) {
    try {
        const [nextMiningTime, setNextMiningTime] = React.useState(null);
        const [timeLeft, setTimeLeft] = React.useState('');

        React.useEffect(() => {
            if (userData?.lastMining) {
                const nextTime = getNextMiningTime(userData.lastMining);
                setNextMiningTime(nextTime);
            }
        }, [userData]);

        React.useEffect(() => {
            const timer = setInterval(() => {
                if (nextMiningTime) {
                    const now = new Date().getTime();
                    const timeRemaining = nextMiningTime.getTime() - now;
                    
                    if (timeRemaining > 0) {
                        const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
                        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
                        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
                        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
                    } else {
                        setTimeLeft('');
                        setNextMiningTime(null);
                    }
                }
            }, 1000);

            return () => clearInterval(timer);
        }, [nextMiningTime]);

        return (
            <div data-name="dashboard" data-file="components/Dashboard.js" className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="panel-card rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{userData?.balance || 0}</div>
                        <div className="text-sm text-gray-600">Total Balance</div>
                    </div>
                    <div className="panel-card rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">{userData?.totalMined || 0}</div>
                        <div className="text-sm text-gray-600">Total Mined</div>
                    </div>
                    <div className="panel-card rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">{userData?.referralCount || 0}</div>
                        <div className="text-sm text-gray-600">Referrals</div>
                    </div>
                    <div className="panel-card rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-orange-600">{userData?.tasksCompleted || 0}</div>
                        <div className="text-sm text-gray-600">Tasks Done</div>
                    </div>
                </div>

                <div className="panel-card rounded-lg p-6 text-center">
                    <h2 className="text-xl font-bold mb-4">⛏️ Mining Center</h2>
                    
                    <MiningButton 
                        user={user} 
                        userData={userData} 
                        onUserDataUpdate={onUserDataUpdate}
                        canMineNow={!nextMiningTime}
                    />
                    
                    {timeLeft && (
                        <div className="mt-4 text-gray-600">
                            <p>Next mining available in:</p>
                            <p className="text-lg font-bold text-blue-600">{timeLeft}</p>
                        </div>
                    )}
                </div>

                <div className="panel-card rounded-lg p-6">
                    <h3 className="text-lg font-bold mb-4">📊 Quick Stats</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span>Member Since:</span>
                            <span className="font-medium">
                                {userData?.joinDate ? new Date(userData.joinDate.toDate()).toLocaleDateString() : 'Today'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Mining Reward:</span>
                            <span className="font-medium text-green-600">+{MINING_REWARD} BC</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Referral Bonus:</span>
                            <span className="font-medium text-purple-600">+10 BC each</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Dashboard component error:', error);
        reportError(error);
    }
}
