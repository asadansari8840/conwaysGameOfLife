const Header: React.FC<{}> = () => {
    return (
        <header className="h-20 bg-primary-blue flex items-center px-8">
            <h2 className="text-white/70 text-4xl font-semibold">Conway's Game of Life</h2>
        </header>
    );
};

Header.displayName = 'Header';

export default Header;
