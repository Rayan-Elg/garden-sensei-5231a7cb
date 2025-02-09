
import { supabase } from '../supabase';

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

    const { data, error } = await supabase.functions.invoke('send-sms', {
      body: {
        phone: formattedPhone,
        message: message
      }
    });

    if (error) {
      console.error('Error calling send-sms function:', error);
      return {
        success: false,
        error: 'Failed to send SMS'
      };
    }

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
