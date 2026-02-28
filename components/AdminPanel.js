function AdminPanel({ user }) {
    try {
        const [activeTab, setActiveTab] = React.useState('withdrawals');
        const [withdrawalRequests, setWithdrawalRequests] = React.useState([]);
        const [users, setUsers] = React.useState([]);
        const [loading, setLoading] = React.useState(true);
        const [stats, setStats] = React.useState({});

        React.useEffect(() => {
            fetchData();
        }, [activeTab]);

        const fetchData = async () => {
            setLoading(true);
            try {
                if (activeTab === 'withdrawals') {
                    const withdrawalsQuery = await db.collection('withdrawalRequests')
                        .orderBy('timestamp', 'desc')
                        .limit(20)
                        .get();
                    setWithdrawalRequests(withdrawalsQuery.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                } else if (activeTab === 'users') {
                    const usersQuery = await db.collection('users')
                        .orderBy('joinDate', 'desc')
                        .limit(20)
                        .get();
                    setUsers(usersQuery.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                } else if (activeTab === 'stats') {
                    const usersSnapshot = await db.collection('users').get();
                    const totalUsers = usersSnapshot.size;
                    let totalBalance = 0;
                    usersSnapshot.docs.forEach(doc => {
                        totalBalance += doc.data().balance || 0;
                    });
                    setStats({ totalUsers, totalBalance });
                }
            } catch (error) {
                console.error('Error fetching admin data:', error);
            } finally {
                setLoading(false);
            }
        };

        const updateWithdrawalStatus = async (requestId, status) => {
            try {
                await db.collection('withdrawalRequests').doc(requestId).update({ status });
                fetchData();
            } catch (error) {
                console.error('Error updating withdrawal status:', error);
            }
        };

        const tabs = [
            { id: 'withdrawals', name: '💰 Withdrawals', icon: 'fas fa-money-bill' },
            { id: 'users', name: '👥 Users', icon: 'fas fa-users' },
            { id: 'stats', name: '📊 Statistics', icon: 'fas fa-chart-bar' }
        ];

        return (
            <div data-name="admin-panel" data-file="components/AdminPanel.js" className="space-y-6">
                <div className="panel-card rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-6 text-red-600">🔐 Admin Panel</h2>
                    
                    <div className="flex space-x-2 mb-6 overflow-x-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                                    activeTab === tab.id ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                <i className={`${tab.icon} mr-2`}></i>
                                {tab.name}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
                        </div>
                    ) : (
                        <div>
                            {activeTab === 'withdrawals' && (
                                <div className="space-y-3">
                                    {withdrawalRequests.map(request => (
                                        <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium">{request.userEmail}</p>
                                                <p className="text-sm text-gray-500">{request.amount} BC - {request.paymentMethod}</p>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => updateWithdrawalStatus(request.id, 'approved')}
                                                    className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => updateWithdrawalStatus(request.id, 'rejected')}
                                                    className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            {activeTab === 'users' && (
                                <div className="space-y-3">
                                    {users.map(user => (
                                        <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium">{user.email}</p>
                                                <p className="text-sm text-gray-500">Balance: {user.balance} BC</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm">Referrals: {user.referralCount}</p>
                                                <p className="text-sm">Tasks: {user.tasksCompleted}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            {activeTab === 'stats' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                                        <div className="text-3xl font-bold text-blue-600">{stats.totalUsers}</div>
                                        <div className="text-gray-600">Total Users</div>
                                    </div>
                                    <div className="text-center p-6 bg-green-50 rounded-lg">
                                        <div className="text-3xl font-bold text-green-600">{stats.totalBalance}</div>
                                        <div className="text-gray-600">Total BC in Circulation</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    } catch (error) {
        console.error('AdminPanel component error:', error);
        reportError(error);
    }
}
