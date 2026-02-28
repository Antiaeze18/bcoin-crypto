function WithdrawalPanel({ user, userData, onUserDataUpdate }) {
    try {
        const [amount, setAmount] = React.useState('');
        const [paymentMethod, setPaymentMethod] = React.useState('paypal');
        const [paymentDetails, setPaymentDetails] = React.useState('');
        const [loading, setLoading] = React.useState(false);
        const [message, setMessage] = React.useState('');
        const [requests, setRequests] = React.useState([]);

        const MIN_WITHDRAWAL = 100;

        React.useEffect(() => {
            const fetchWithdrawalRequests = async () => {
                try {
                    const requestsQuery = await db.collection('withdrawalRequests')
                        .where('userId', '==', user.uid)
                        .orderBy('timestamp', 'desc')
                        .limit(10)
                        .get();
                    
                    const requestsList = requestsQuery.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setRequests(requestsList);
                } catch (error) {
                    console.error('Error fetching withdrawal requests:', error);
                }
            };

            fetchWithdrawalRequests();
        }, [user.uid]);

        const handleWithdrawal = async (e) => {
            e.preventDefault();
            setLoading(true);
            setMessage('');

            try {
                const withdrawalAmount = parseFloat(amount);
                
                if (withdrawalAmount < MIN_WITHDRAWAL) {
                    throw new Error(`Minimum withdrawal amount is ${MIN_WITHDRAWAL} BC`);
                }
                
                if (withdrawalAmount > (userData?.balance || 0)) {
                    throw new Error('Insufficient balance');
                }

                await db.collection('withdrawalRequests').add({
                    userId: user.uid,
                    userEmail: user.email,
                    amount: withdrawalAmount,
                    paymentMethod: paymentMethod,
                    paymentDetails: paymentDetails,
                    status: 'pending',
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });

                setMessage('✅ Withdrawal request submitted successfully!');
                setAmount('');
                setPaymentDetails('');
                
                // Refresh requests list
                setTimeout(() => {
                    window.location.reload();
                }, 2000);

            } catch (error) {
                setMessage(`❌ ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        return (
            <div data-name="withdrawal-panel" data-file="components/WithdrawalPanel.js" className="space-y-6">
                <div className="panel-card rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">💰 Withdrawal Request</h2>
                    <p className="text-gray-600 mb-6">Minimum withdrawal: {MIN_WITHDRAWAL} BC</p>

                    {message && (
                        <div className={`mb-4 p-3 rounded-lg ${
                            message.includes('successfully') 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                        }`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleWithdrawal} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Amount (BC)</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                min={MIN_WITHDRAWAL}
                                max={userData?.balance || 0}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">Available: {userData?.balance || 0} BC</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="paypal">PayPal</option>
                                <option value="crypto">Cryptocurrency</option>
                                <option value="bank">Bank Transfer</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Details</label>
                            <input
                                type="text"
                                value={paymentDetails}
                                onChange={(e) => setPaymentDetails(e.target.value)}
                                placeholder="Enter your payment details"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || (userData?.balance || 0) < MIN_WITHDRAWAL}
                            className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-green-600 hover:to-blue-700 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : 'Submit Withdrawal Request'}
                        </button>
                    </form>
                </div>

                <div className="panel-card rounded-lg p-6">
                    <h3 className="text-lg font-bold mb-4">📋 Withdrawal History</h3>
                    {requests.length > 0 ? (
                        <div className="space-y-3">
                            {requests.map(request => (
                                <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium">{request.amount} BC</p>
                                        <p className="text-sm text-gray-500">
                                            {request.timestamp ? new Date(request.timestamp.toDate()).toLocaleDateString() : 'Recently'}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                        request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {request.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No withdrawal requests yet</p>
                    )}
                </div>
            </div>
        );
    } catch (error) {
        console.error('WithdrawalPanel component error:', error);
        reportError(error);
    }
}
