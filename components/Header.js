function Header({ user, userData, currentView, setCurrentView, onSignOut }) {
    try {
        return (
            <header data-name="header" data-file="components/Header.js" className="panel-card rounded-lg shadow-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <img src="images/profile.jpg.jpg" alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex items-center space-x-2">
                            <img src="images/profile.jpg.jpg" alt="Profile Logo" className="w-8 h-8" />
                            <div>
                                <h1 className="text-xl font-bold text-gray-800">Bcoin</h1>
                                <p className="text-sm text-gray-600">Crypto Mining Platform</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <p className="text-2xl font-bold balance-display">
                                {userData?.balance || 0} BC
                            </p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                        <button
                            onClick={onSignOut}
                            className="text-red-500 hover:text-red-700 transition-colors"
                        >
                            <i className="fas fa-sign-out-alt text-lg"></i>
                        </button>
                    </div>
                </div>
                
                <nav className="mt-4 flex space-x-2 overflow-x-auto">
                    {['dashboard', 'tasks', 'referrals', 'profile', 'withdrawal', 'leaderboard'].map(view => (
                        <button
                            key={view}
                            onClick={() => setCurrentView(view)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                                currentView === view 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {view.charAt(0).toUpperCase() + view.slice(1)}
                        </button>
                    ))}
                    {userData?.isAdmin && (
                        <button
                            onClick={() => setCurrentView('admin')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                                currentView === 'admin' 
                                    ? 'bg-red-500 text-white' 
                                    : 'bg-red-200 text-red-700 hover:bg-red-300'
                            }`}
                        >
                            Admin
                        </button>
                    )}
                </nav>
            </header>
        );
    } catch (error) {
        console.error('Header component error:', error);
        reportError(error);
    }
}
