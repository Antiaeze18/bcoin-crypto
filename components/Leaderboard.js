function Leaderboard() {
    try {
        const [activeTab, setActiveTab] = React.useState('balance');
        const [leaders, setLeaders] = React.useState([]);
        const [loading, setLoading] = React.useState(true);

        React.useEffect(() => {
            const fetchLeaderboard = async () => {
                setLoading(true);
                try {
                    let query;
                    switch (activeTab) {
                        case 'balance':
                            query = db.collection('users').orderBy('balance', 'desc').limit(10);
                            break;
                        case 'referrals':
                            query = db.collection('users').orderBy('referralCount', 'desc').limit(10);
                            break;
                        case 'mining':
                            query = db.collection('users').orderBy('totalMined', 'desc').limit(10);
                            break;
                        default:
                            query = db.collection('users').orderBy('balance', 'desc').limit(10);
                    }

                    const snapshot = await query.get();
                    const leadersList = snapshot.docs.map((doc, index) => ({
                        id: doc.id,
                        rank: index + 1,
                        ...doc.data()
                    }));
                    setLeaders(leadersList);
                } catch (error) {
                    console.error('Error fetching leaderboard:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchLeaderboard();
        }, [activeTab]);

        const tabs = [
            { id: 'balance', name: '💰 Top Balance', icon: 'fas fa-coins' },
            { id: 'referrals', name: '👥 Top Referrals', icon: 'fas fa-users' },
            { id: 'mining', name: '⛏️ Top Miners', icon: 'fas fa-pickaxe' }
        ];

        const getDisplayValue = (user) => {
            switch (activeTab) {
                case 'balance':
                    return `${user.balance || 0} BC`;
                case 'referrals':
                    return `${user.referralCount || 0} referrals`;
                case 'mining':
                    return `${user.totalMined || 0} BC mined`;
                default:
                    return `${user.balance || 0} BC`;
            }
        };

        return (
            <div data-name="leaderboard" data-file="components/Leaderboard.js" className="space-y-6">
                <div className="panel-card rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-6">🏆 Leaderboard</h2>
                    
                    <div className="flex space-x-2 mb-6 overflow-x-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                                    activeTab === tab.id 
                                        ? 'bg-blue-500 text-white' 
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                <i className={`${tab.icon} mr-2`}></i>
                                {tab.name}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="text-gray-500 mt-2">Loading leaderboard...</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {leaders.map(user => (
                                <div key={user.id} className={`flex items-center justify-between p-4 rounded-lg ${
                                    user.rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200' : 'bg-gray-50'
                                }`}>
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                            user.rank === 1 ? 'bg-yellow-500 text-white' :
                                            user.rank === 2 ? 'bg-gray-400 text-white' :
                                            user.rank === 3 ? 'bg-orange-500 text-white' :
                                            'bg-gray-200 text-gray-700'
                                        }`}>
                                            {user.rank}
                                        </div>
                                        <div>
                                            <p className="font-medium">{user.email?.split('@')[0] || 'Anonymous'}</p>
                                            <p className="text-sm text-gray-500">
                                                Member since {user.joinDate ? new Date(user.joinDate.toDate()).toLocaleDateString() : 'Recently'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg">{getDisplayValue(user)}</p>
                                        {user.rank <= 3 && (
                                            <p className="text-xs text-yellow-600">🏆 Top Performer</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && leaders.length === 0 && (
                        <p className="text-gray-500 text-center py-8">No data available yet</p>
                    )}
                </div>
            </div>
        );
    } catch (error) {
        console.error('Leaderboard component error:', error);
        reportError(error);
    }
}
