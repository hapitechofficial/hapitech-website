'use client';

import { useCallback } from 'react';

export interface FetchError {
  status: number;
  message: string;
  error?: string;
  details?: string;
}

/**
 * Custom hook for making authenticated API calls with error handling
 */
export function useFetchAPI() {
  const fetchAPI = useCallback(
    async <T,>(
      url: string,
      options: RequestInit = {}
    ): Promise<{ data?: T; error?: FetchError }> => {
      try {
        const response = await fetch(url, {
          method: 'GET',
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
        });

        const responseData = await response.json();

        if (!response.ok) {
          const error: FetchError = {
            status: response.status,
            message: responseData.message || responseData.error || 'Unknown error',
            error: responseData.error,
            details: responseData.details,
          };

          // Log different error types
          switch (response.status) {
            case 401:
              console.warn('[API] Unauthorized - User needs to sign in');
              // Could trigger redirect to login here
              break;
            case 403:
              console.warn('[API] Forbidden - User lacks permissions');
              break;
            case 404:
              console.warn('[API] Not found');
              break;
            case 429:
              console.warn('[API] Rate limited');
              break;
            case 500:
              console.error('[API] Server error:', responseData.details);
              break;
            default:
              console.error('[API] Request failed:', error.message);
          }

          return { error };
        }

        return { data: responseData.data || responseData };
      } catch (error) {
        console.error('[API] Fetch error:', error);

        return {
          error: {
            status: 0,
            message: 'Network error. Please check your connection.',
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        };
      }
    },
    []
  );

  return { fetchAPI };
}

/**
 * Helper to make POST requests
 */
export async function apiPost<T>(
  url: string,
  data: Record<string, unknown>
): Promise<{ data?: T; error?: FetchError }> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      return {
        error: {
          status: response.status,
          message: responseData.message || responseData.error || 'Request failed',
          error: responseData.error,
          details: responseData.details,
        },
      };
    }

    return { data: responseData.data || responseData };
  } catch (error) {
    console.error('[API] Fetch error:', error);
    return {
      error: {
        status: 0,
        message: 'Network error. Please check your connection.',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
}

/**
 * Helper to make GET requests
 */
export async function apiGet<T>(url: string): Promise<{ data?: T; error?: FetchError }> {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const responseData = await response.json();

    if (!response.ok) {
      return {
        error: {
          status: response.status,
          message: responseData.message || responseData.error || 'Request failed',
          error: responseData.error,
          details: responseData.details,
        },
      };
    }

    return { data: responseData.data || responseData };
  } catch (error) {
    console.error('[API] Fetch error:', error);
    return {
      error: {
        status: 0,
        message: 'Network error. Please check your connection.',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
}
