import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from './ui/Button';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  return (
    <header className="flex justify-between items-center mb-10">
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-2">OK Salary & Budget</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Your all-in-one financial planning tool.</p>
      </div>
      <Button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 w-auto">
        {theme === 'light' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
      </Button>
    </header>
  );
};

export default Header;
