
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
      throw new Error("Supabase client not initialized");
    }

    const { data, error } = await supabase.functions.invoke("send-sms", {
      body: { phoneNumber, message }
    });

    if (error) {
      console.error("SMS Error:", error);
      return {
        success: false,
        error: "Failed to send SMS"
      };
    }

    return data || { success: false, error: "No response from SMS service" };
  } catch (error) {
    console.error("SMS Error:", error);
    return {
      success: false,
      error: "Failed to send SMS"
    };
  }
};
