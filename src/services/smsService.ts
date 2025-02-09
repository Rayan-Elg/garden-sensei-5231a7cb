
interface SendSMSResponse {
  success: boolean;
  textId?: string;
  quotaRemaining?: number;
  error?: string;
}

export const sendSMS = async (phoneNumber: string, message: string): Promise<SendSMSResponse> => {
  try {
    const response = await fetch('https://api.cors-anywhere.org/https://textbelt.com/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': window.location.origin
      },
      body: JSON.stringify({
        phone: phoneNumber,
        message: message,
        key: '39bbdf476046aa16d8749550512216f1e2b393090aXdzG5eyrvQO3dTIT1YLH31l',
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('SMS Service Error:', error);
    return {
      success: false,
      error: 'Failed to send SMS. Please try again later.'
    };
  }
}
