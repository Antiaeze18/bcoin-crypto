function MiningButton({ user, userData, onUserDataUpdate, canMineNow }) {
    try {
        const [mining, setMining] = React.useState(false);
        const [message, setMessage] = React.useState('');

        const handleMining = async () => {
            if (!canMineNow || mining) return;

            setMining(true);
            setMessage('');

            try {
                const reward = await performMining(user.uid);
                setMessage(`🎉 Successfully mined ${reward} BC!`);
                onUserDataUpdate();
            } catch (error) {
                setMessage('❌ Mining failed. Please try again.');
                console.error('Mining error:', error);
            } finally {
                setMining(false);
            }
        };

        return (
            <div data-name="mining-button" data-file="components/MiningButton.js" className="text-center">
                <button
                    onClick={handleMining}
                    disabled={!canMineNow || mining}
                    className={`mining-button text-white font-bold py-4 px-8 rounded-full text-lg transition-all ${
                        !canMineNow || mining ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                    }`}
                >
                    {mining ? (
                        <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Mining...</span>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <i className="fas fa-hammer text-yellow-400"></i>
                            <span>{canMineNow ? 'Mine Now' : 'Mining Cooldown'}</span>
                        </div>
                    )}
                </button>

                {message && (
                    <div className={`mt-4 p-3 rounded-lg ${
                        message.includes('Successfully') 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                    }`}>
                        {message}
                    </div>
                )}
            </div>
        );
    } catch (error) {
        console.error('MiningButton component error:', error);
        reportError(error);
    }
}
