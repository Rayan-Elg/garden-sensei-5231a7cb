
interface SendSMSResponse {
  success: boolean;
  textId?: string;
  quotaRemaining?: number;
  error?: string;
}

export const sendSMS = async (phoneNumber: string, message: string): Promise<SendSMSResponse> => {
  try {
    const response = await fetch('https://proxy.cors.sh/https://textbelt.com/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-cors-api-key': 'temp_f639e2c096f6614460addf87d2925bbb',
        'Origin': window.location.origin
      },
      body: JSON.stringify({
        phone: phoneNumber,
        message: message,
        key: '39bbdf476046aa16d8749550512216f1e2b393090aXdzG5eyrvQO3dTIT1YLH31l',
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('SMS API Error:', errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('SMS API Response:', data);
    return data;
  } catch (error) {
    console.error('SMS Service Error:', error);
    return {
      success: false,
      error: 'Failed to send SMS. Please try again later.'
    };
  }
}
