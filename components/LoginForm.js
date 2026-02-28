function LoginForm({ onLogin }) {
    try {
        const [isLogin, setIsLogin] = React.useState(true);
        const [email, setEmail] = React.useState('');
        const [password, setPassword] = React.useState('');
        const [referralCode, setReferralCode] = React.useState('');
        const [loading, setLoading] = React.useState(false);
        const [error, setError] = React.useState('');

        React.useEffect(() => {
            const savedReferralCode = localStorage.getItem('referralCode');
            if (savedReferralCode && !isLogin) {
                setReferralCode(savedReferralCode);
            }
        }, [isLogin]);

        const getErrorMessage = (errorCode) => {
            switch (errorCode) {
                case 'auth/invalid-login-credentials':
                    return 'Invalid email or password. Please check your credentials or create a new account.';
                case 'auth/user-not-found':
                    return 'No account found with this email. Please sign up first.';
                case 'auth/wrong-password':
                    return 'Incorrect password. Please try again.';
                case 'auth/email-already-in-use':
                    return 'An account with this email already exists. Please sign in instead.';
                case 'auth/weak-password':
                    return 'Password should be at least 6 characters long.';
                case 'auth/invalid-email':
                    return 'Please enter a valid email address.';
                default:
                    return 'Authentication failed. Please try again.';
            }
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true);
            setError('');

            try {
                let user;
                if (isLogin) {
                    user = await window.signInUser(email, password);
                } else {
                    user = await window.signUpUser(email, password, referralCode || null);
                }
                onLogin(user);
            } catch (error) {
                console.error('Authentication error:', error);
                setError(getErrorMessage(error.code));
            } finally {
                setLoading(false);
            }
        };

        return (
            <div data-name="login-form" data-file="components/LoginForm.js" className="min-h-screen flex items-center justify-center p-4">
                <div className="panel-card rounded-xl shadow-2xl p-8 w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-coins text-white text-3xl"></i>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800">Bcoin</h1>
                        <p className="text-gray-600">Start Mining Cryptocurrency</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                placeholder="Password (min 6 characters)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                                minLength="6"
                            />
                        </div>

                        {!isLogin && (
                            <div>
                                <input
                                    type="text"
                                    placeholder="Referral Code (Optional)"
                                    value={referralCode}
                                    onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <p className="text-xs text-green-600 mt-1">💰 Get +15 BC instead of 10 BC with a referral code!</p>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                                <i className="fas fa-exclamation-triangle mr-2"></i>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Loading...
                                </div>
                            ) : (
                                isLogin ? 'Sign In' : 'Create Account & Start Mining'
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                            }}
                            className="w-full text-blue-500 hover:text-blue-700 transition-colors"
                        >
                            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        <p>🎯 New users get 10 BC welcome bonus</p>
                        <p>🤝 Referral users get 15 BC bonus</p>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('LoginForm component error:', error);
        reportError(error);
    }
}
