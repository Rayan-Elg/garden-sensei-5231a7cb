
interface SendSMSResponse {
  success: boolean;
  message?: string;
  error?: string;
}

const formatPhoneNumber = (phoneNumber: string): string => {
  // Remove all non-numeric characters
  return phoneNumber.replace(/\D/g, '');
};

export const sendSMS = async (phoneNumber: string, message: string): Promise<SendSMSResponse> => {
  try {
    const formattedPhone = formatPhoneNumber(phoneNumber);

    const response = await fetch('https://textbelt.com/text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: formattedPhone,
        message: message,
        key: '39bbdf476046aa16d8749550512216f1e2b393090aXdzG5eyrvQO3dTIT1YLH31l',
      }),
    });

    const data = await response.json();
    return {
      success: data.success,
      message: data.success ? 'SMS sent successfully' : undefined,
      error: data.error
    };
  } catch (error) {
    console.error('Error sending SMS:', error);
    return {
      success: false,
      error: 'Failed to send SMS'
    };
  }
}
