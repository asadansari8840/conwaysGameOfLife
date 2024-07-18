import React from 'react';
import Header from './components/Header';
import GameBoard from './components/GameBoard';

const App: React.FC = () => {
    return (
        <main className="h-screen">
            <Header />
            <GameBoard />
        </main>
    );
};

export default App;
