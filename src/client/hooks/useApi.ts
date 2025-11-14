import { useState, useEffect } from 'react';
import { IChannelItem, ICountry } from '../types';
import ApiService from '../services/ApiService';

/**
 * Hook for fetching channels
 */
export function useChannels() {
    const [channels, setChannels] = useState<IChannelItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadChannels = async () => {
            try {
                setLoading(true);
                const response = await ApiService.fetchChannels(1, 10000);
                setChannels(response.data || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load channels');
            } finally {
                setLoading(false);
            }
        };

        loadChannels();
    }, []);

    return { channels, loading, error };
}

/**
 * Hook for fetching countries
 */
export function useCountries() {
    const [countries, setCountries] = useState<ICountry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCountries = async () => {
            try {
                setLoading(true);
                const data = await ApiService.fetchCountries();
                setCountries(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load countries');
            } finally {
                setLoading(false);
            }
        };

        loadCountries();
    }, []);

    return { countries, loading, error };
}

/**
 * Hook for fetching categories
 */
export function useCategories() {
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                setLoading(true);
                const data = await ApiService.fetchCategories();
                setCategories(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load categories');
            } finally {
                setLoading(false);
            }
        };

        loadCategories();
    }, []);

    return { categories, loading, error };
}
