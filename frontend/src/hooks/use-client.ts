'use client'

import axios from 'axios'
import { useSession, signOut } from 'next-auth/react'
import { useMemo } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const useClient = (options?: any) => {
    const { data: session } = useSession();
    const token = session?.accessToken;

    return useMemo(() => {
        const api = axios.create({
            baseURL: API_URL,
            headers: {
                Authorization: token ? `Bearer ${token}` : '',
                ...(options?.headers ? options.headers : {})
            }
        })

        api.interceptors.response.use(response => {
            return response
        }, error => {
            try {
                const { status, data } = error.response;

                // if (status === 401) {
                //     signOut();
                //     return Promise.reject(data);
                // } else if (status === 405) {
                //     return Promise.reject(data);
                // }
                return Promise.reject(error)
            } catch (e) {
                return Promise.reject(error)
            }
        })

        return api;
    }, [options, token])
}

export default useClient;