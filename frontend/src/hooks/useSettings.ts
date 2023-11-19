import { useContext } from 'react';
import { SettingsContext } from '../providers/Settings.tsx';

function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")
  return context
}

export default useSettings