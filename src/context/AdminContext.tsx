import React, { createContext, useContext, useState, useEffect } from 'react';
import { businessConfig, BusinessConfig } from '../config/businessConfig';

interface AdminContextType {
  isAdminAuthenticated: boolean;
  adminLoginError: string | null;
  verifyAdminPasscode: (passcode: string) => boolean;
  logoutAdmin: () => void;
  businessSettings: BusinessConfig;
  updateBusinessSettings: (updated: Partial<BusinessConfig>) => void;
  updateContactSettings: (contact: Partial<BusinessConfig['contact']>) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_AUTH_SESSION_KEY = 'deepu_creations_admin_session_token';
const ADMIN_SETTINGS_KEY = 'deepu_creations_admin_settings_v1';

// Configured staging administrator passcode
// In production, this requires an HTTP-only secure cookie and verified backend role authentication.
const STAGING_ADMIN_PASSCODE = 'deepu2026';

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(ADMIN_AUTH_SESSION_KEY) === 'valid_admin_session';
    } catch {
      return false;
    }
  });

  const [adminLoginError, setAdminLoginError] = useState<string | null>(null);

  const [businessSettings, setBusinessSettings] = useState<BusinessConfig>(() => {
    try {
      const stored = localStorage.getItem(ADMIN_SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // If stored contains unconfigured placeholder, upgrade with new official businessConfig
        if (!parsed.contact?.email || parsed.contact.email.includes('[') || !parsed.isSloganConfigured) {
          return businessConfig;
        }
        return parsed;
      }
      return businessConfig;
    } catch {
      return businessConfig;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(ADMIN_SETTINGS_KEY, JSON.stringify(businessSettings));
    } catch (e) {
      console.warn('Failed to save business settings:', e);
    }
  }, [businessSettings]);

  const verifyAdminPasscode = (passcode: string): boolean => {
    if (passcode.trim() === STAGING_ADMIN_PASSCODE) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem(ADMIN_AUTH_SESSION_KEY, 'valid_admin_session');
      setAdminLoginError(null);
      return true;
    }
    setAdminLoginError('Incorrect administration passcode. Please check credentials or consult setup docs.');
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem(ADMIN_AUTH_SESSION_KEY);
  };

  const updateBusinessSettings = (updated: Partial<BusinessConfig>) => {
    setBusinessSettings((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  const updateContactSettings = (contactUpdate: Partial<BusinessConfig['contact']>) => {
    setBusinessSettings((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        ...contactUpdate,
      },
    }));
  };

  return (
    <AdminContext.Provider
      value={{
        isAdminAuthenticated,
        adminLoginError,
        verifyAdminPasscode,
        logoutAdmin,
        businessSettings,
        updateBusinessSettings,
        updateContactSettings,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
