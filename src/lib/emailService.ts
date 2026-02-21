export const emailService = {
    sendOrderConfirmation: async (email: string, orderId: string, total: number) => {
        console.log(`[Email Service] Sending confirmation to ${email} for order ${orderId} ($${total.toFixed(2)})`);
        return new Promise(resolve => setTimeout(resolve, 500));
    },

    sendOrderStatusUpdate: async (email: string, orderId: string, status: string) => {
        console.log(`[Email Service] Sending status update to ${email} for order ${orderId} - Status: ${status}`);
        return new Promise(resolve => setTimeout(resolve, 500));
    },

    sendPayoutRequestNotification: async (adminEmail: string, partnerName: string, amount: number) => {
        console.log(`[Email Service] Notifying admin ${adminEmail} of a payout request from ${partnerName} for $${amount}`);
        return new Promise(resolve => setTimeout(resolve, 500));
    }
};
