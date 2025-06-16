'use server'

import axios from "axios";

export default async function requestOrderInfo(mallId: string, accessToken: string, orderId: string) {
    try {
        const response = await axios.get(
            `https://${mallId}.cafe24api.com/api/v2/admin/orders/${orderId}/items`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'X-Cafe24-Api-Version': '2025-06-01'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Token request failed:', (error as any).toString());
        throw error;
    }
}
