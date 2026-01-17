import React, { createContext, useContext, useState, useEffect } from 'react';

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        salonName: 'Salonix',
        address: 'Loading...',
        phone: 'Loading...',
        currency: 'LKR',
        logoUrl: ''
    });
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://192.168.1.8:5000'}/api/settings`);
            const data = await res.json();
            if (data.success) {
                // Fix Logo URL for mobile access (replace localhost with actual IP if needed)
                let fixedSettings = data.data;
                if (fixedSettings.logoUrl && fixedSettings.logoUrl.includes('localhost')) {
                    fixedSettings.logoUrl = fixedSettings.logoUrl.replace('localhost', window.location.hostname);
                }
                setSettings(fixedSettings);
            }
        } catch (error) {
            console.error("Failed to fetch shop settings", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const updateSettingsState = (newSettings) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    return (
        <ShopContext.Provider value={{ settings, loading, refreshSettings: fetchSettings, updateSettingsState }}>
            {children}
        </ShopContext.Provider>
    );
};
