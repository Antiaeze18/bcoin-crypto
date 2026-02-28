function App() {
    try {
        const [user, setUser] = React.useState(null);
        const [userData, setUserData] = React.useState(null);
        const [loading, setLoading] = React.useState(true);
        const [currentView, setCurrentView] = React.useState('dashboard');

        React.useEffect(() => {
            // Wait for Firebase to be ready
            const checkFirebase = () => {
                if (window.auth) {
                    const unsubscribe = window.auth.onAuthStateChanged(async (user) => {
                        try {
                            if (user) {
                                setUser(user);
                                const data = await window.getCurrentUserData(user.uid);
                                setUserData(data);
                            } else {
                                setUser(null);
                                setUserData(null);
                            }
                        } catch (error) {
                            console.error('Auth state change error:', error);
                        } finally {
                            setLoading(false);
                        }
                    });

                    return () => unsubscribe();
                } else {
                    setTimeout(checkFirebase, 100);
                }
            };

            checkFirebase();
        }, []);

        React.useEffect(() => {
            const urlParams = new URLSearchParams(window.location.search);
            const refCode = urlParams.get('ref');
            if (refCode) {
                localStorage.setItem('referralCode', refCode);
            }
        }, []);

        const handleLogin = (user) => {
            setUser(user);
        };

        const handleSignOut = async () => {
            try {
                await window.signOutUser();
                setUser(null);
                setUserData(null);
                setCurrentView('dashboard');
            } catch (error) {
                console.error('Sign out error:', error);
            }
        };

        const refreshUserData = async () => {
            if (user) {
                try {
                    const data = await window.getCurrentUserData(user.uid);
                    setUserData(data);
                } catch (error) {
                    console.error('Error refreshing user data:', error);
                }
            }
        };

        const renderCurrentView = () => {
            switch (currentView) {
                case 'dashboard':
                    return <Dashboard user={user} userData={userData} onUserDataUpdate={refreshUserData} />;
                case 'tasks':
                    return <TasksPanel user={user} userData={userData} onUserDataUpdate={refreshUserData} />;
                case 'referrals':
                    return <ReferralPanel user={user} userData={userData} />;
                case 'profile':
                    return <ProfilePanel user={user} userData={userData} />;
                case 'withdrawal':
                    return <WithdrawalPanel user={user} userData={userData} onUserDataUpdate={refreshUserData} />;
                case 'leaderboard':
                    return <Leaderboard />;
                case 'admin':
                    return userData?.isAdmin ? <AdminPanel user={user} /> : <Dashboard user={user} userData={userData} onUserDataUpdate={refreshUserData} />;
                default:
                    return <Dashboard user={user} userData={userData} onUserDataUpdate={refreshUserData} />;
            }
        };

        if (loading) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading Bcoin...</p>
                    </div>
                </div>
            );
        }

        if (!user) {
            return <LoginForm onLogin={handleLogin} />;
        }

        return (
            <div className="min-h-screen p-4 max-w-4xl mx-auto">
                <Header 
                    user={user} 
                    userData={userData} 
                    currentView={currentView} 
                    setCurrentView={setCurrentView}
                    onSignOut={handleSignOut}
                />
                {renderCurrentView()}
            </div>
        );
    } catch (error) {
        console.error('App component error:', error);
        reportError(error);
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
