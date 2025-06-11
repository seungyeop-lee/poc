'use server'

import axios from "axios";

export default async function requestListAllProduct(mallId: string, accessToken: string) {
    try {
        const response = await axios.get(
            `https://${mallId}.cafe24api.com/api/v2/admin/products`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Token request failed:', (error as any).toString());
        throw error;
    }
}
