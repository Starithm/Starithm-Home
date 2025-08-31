import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { 
  setTheme, 
  getTheme, 
  toggleTheme, 
  forceTheme, 
  resetToSystemTheme,
  type Theme 
} from '../utils/themeUtils';

export const ThemeDemo: React.FC = () => {
  const [currentTheme, setCurrentTheme] = React.useState<Theme | null>(getTheme());

  const handleThemeChange = (theme: Theme) => {
    setTheme(theme);
    setCurrentTheme(theme);
  };

  const handleToggle = () => {
    const newTheme = toggleTheme();
    setCurrentTheme(newTheme);
  };

  const handleForceTheme = (theme: Theme) => {
    forceTheme(theme);
    setCurrentTheme(theme);
  };

  const handleReset = () => {
    resetToSystemTheme();
    setCurrentTheme(getTheme());
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Theme Control Demo</CardTitle>
        <CardDescription>
          Programmatic theme switching utilities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-4 bg-gray-100 dark:bg-starithm-bg-black rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">Current Theme</p>
          <p className="text-lg font-semibold text-starithm-electric-violet">
            {currentTheme || 'System Default'}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={() => handleThemeChange('light')}
            variant="outline"
            className="text-sm"
          >
            Set Light
          </Button>
          <Button 
            onClick={() => handleThemeChange('dark')}
            variant="outline"
            className="text-sm"
          >
            Set Dark
          </Button>
        </div>
        
        <Button 
          onClick={handleToggle}
          className="w-full bg-[#9A48FF] hover:bg-[#9A48FF]/90"
        >
          Toggle Theme
        </Button>
        
        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={() => handleForceTheme('light')}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            Force Light
          </Button>
          <Button 
            onClick={() => handleForceTheme('dark')}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            Force Dark
          </Button>
        </div>
        
        <Button 
          onClick={handleReset}
          variant="outline"
          className="w-full"
        >
          Reset to System
        </Button>
        
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          <p>Theme preference is saved in localStorage</p>
          <p>System preference is detected automatically</p>
        </div>
      </CardContent>
    </Card>
  );
};
