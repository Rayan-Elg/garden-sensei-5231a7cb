
import { supabase } from "@/lib/supabase";

interface SendSMSResponse {
  success: boolean;
  textId?: string;
  quotaRemaining?: number;
  error?: string;
}

export const sendSMS = async (phoneNumber: string, message: string): Promise<SendSMSResponse> => {
  try {
    console.log('Sending SMS via Supabase function to:', phoneNumber);
    
    const { data, error } = await supabase.functions.invoke('send-sms', {
      body: {
        phoneNumber,
        message
      }
    });

    if (error) {
      console.error('SMS Service Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send SMS. Please try again later.'
      };
    }

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
