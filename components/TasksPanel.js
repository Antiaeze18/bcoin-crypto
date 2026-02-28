function TasksPanel({ user, userData, onUserDataUpdate }) {
    try {
        const [completingTask, setCompletingTask] = React.useState('');
        const [message, setMessage] = React.useState('');
        const [pendingTasks, setPendingTasks] = React.useState(new Set());

        // Watch Ads function exactly as specified
        const watchAd = () => {
            window.open("https://bcoin-382da.web.app", "_blank"); // triggers popunder ad
            setPendingTasks(prev => new Set([...prev, 'watch_ad']));
            setMessage('🎥 Ad opened! Click "Task Complete" after watching to earn 10 BC');
        };

        const handleTaskComplete = async (taskId, reward) => {
            setCompletingTask(taskId);
            setMessage('');

            try {
                await window.completeTask(user.uid, taskId, reward);
                setMessage(`🎉 Task completed! Earned ${reward} BC`);
                setPendingTasks(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(taskId);
                    return newSet;
                });
                onUserDataUpdate();
            } catch (error) {
                setMessage('❌ Task completion failed. Please try again.');
                console.error('Task completion error:', error);
            } finally {
                setCompletingTask('');
            }
        };

        const tasks = [
            { id: 'watch_ad', name: '📺 Watch Video Ad', reward: 10, icon: 'fas fa-play-circle' },
            { id: 'app_install', name: '📱 Install App', reward: 20, icon: 'fas fa-mobile-alt' },
            { id: 'social_follow', name: '👥 Follow Social Media', reward: 8, icon: 'fas fa-heart' },
            { id: 'share_post', name: '📤 Share Post', reward: 5, icon: 'fas fa-share' },
            { id: 'rate_app', name: '⭐ Rate Our App', reward: 12, icon: 'fas fa-star' }
        ];

        return (
            <div data-name="tasks-panel" data-file="components/TasksPanel.js" className="space-y-6">
                <div className="panel-card rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">🎯 Daily Tasks</h2>
                    <p className="text-gray-600 mb-6">Complete tasks to earn extra Bcoin rewards!</p>

                    {message && (
                        <div className={`mb-4 p-3 rounded-lg ${
                            message.includes('completed') || message.includes('opened')
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                        }`}>
                            {message}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Watch Ads Button - PropellerAds Integration */}
                        <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-3">
                                    <i className="fas fa-play-circle text-blue-500 text-lg"></i>
                                    <div>
                                        <h3 className="font-medium">📺 Watch Video Ad</h3>
                                        <p className="text-sm text-green-600">+10 BC</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={watchAd}
                                    className="task-button text-white px-4 py-2 rounded-lg text-sm font-medium flex-1"
                                >
                                    Watch Ads 🎥
                                </button>
                                {pendingTasks.has('watch_ad') && (
                                    <button
                                        onClick={() => handleTaskComplete('watch_ad', 10)}
                                        disabled={completingTask === 'watch_ad'}
                                        className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                                    >
                                        {completingTask === 'watch_ad' ? 'Loading...' : 'Task Complete'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Survey Task Button - CPA Offer Integration */}
                        <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-3">
                                    <i className="fas fa-clipboard-list text-blue-500 text-lg"></i>
                                    <div>
                                        <h3 className="font-medium">📝 Complete Survey</h3>
                                        <p className="text-sm text-green-600">+15 BC</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <a href="https://singingfiles.com/show.php?l=0&u=2399646&id=69339" target="_blank" className="flex-1">
                                    <button
                                        onClick={() => {
                                            setPendingTasks(prev => new Set([...prev, 'survey']));
                                            setMessage('📝 Survey opened! Click "Task Complete" after finishing to earn 15 BC');
                                        }}
                                        className="task-button text-white px-4 py-2 rounded-lg text-sm font-medium w-full"
                                    >
                                        Survey Task 📋
                                    </button>
                                </a>
                                {pendingTasks.has('survey') && (
                                    <button
                                        onClick={() => handleTaskComplete('survey', 15)}
                                        disabled={completingTask === 'survey'}
                                        className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                                    >
                                        {completingTask === 'survey' ? 'Loading...' : 'Task Complete'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Other Tasks */}
                        {tasks.map(task => (
                            <div key={task.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <i className={`${task.icon} text-blue-500 text-lg`}></i>
                                        <div>
                                            <h3 className="font-medium">{task.name}</h3>
                                            <p className="text-sm text-green-600">+{task.reward} BC</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleTaskComplete(task.id, task.reward)}
                                        disabled={completingTask === task.id}
                                        className="task-button text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                                    >
                                        {completingTask === task.id ? 'Loading...' : 'Complete'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('TasksPanel component error:', error);
        reportError(error);
    }
}
