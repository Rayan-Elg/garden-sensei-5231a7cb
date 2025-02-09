
import { supabase } from "@/lib/supabase";

interface SendSMSResponse {
  success: boolean;
  textId?: string;
  quotaRemaining?: number;
  error?: string;
}

export const sendSMS = async (phoneNumber: string, message: string): Promise<SendSMSResponse> => {
  try {
    if (!supabase) {
      throw new Error('Supabase client is not initialized');
    }

    console.log('Sending SMS via Supabase function to:', phoneNumber);
    
    const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
    
    const { data, error } = await supabase.functions.invoke('send-sms', {
      body: {
        phoneNumber: cleanPhoneNumber,
        message
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (error) {
      console.error('Supabase Function Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send SMS. Please try again later.'
      };
    }

    if (!data) {
      console.error('No data received from Supabase function');
      return {
        success: false,
        error: 'No response from SMS service'
      };
    }

    console.log('SMS API Response:', data);
    return data;
  } catch (error: any) {
    console.error('SMS Service Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to send SMS. Please try again later.'
    };
  }
}
