
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { sendSMS } from "@/services/smsService";

interface SMSNotificationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  plantName: string;
}

const SMSNotificationDialog = ({ isOpen, onOpenChange, plantName }: SMSNotificationDialogProps) => {
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isSending, setIsSending] = useState(false);

  const validatePhoneNumber = (phone: string) => {
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length === 10;
  };

  const handlePhoneNumberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError("");
    
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (!validatePhoneNumber(cleanPhone)) {
      setPhoneError("Please enter a valid 10-digit phone number");
      return;
    }

    setIsSending(true);
    try {
      const response = await sendSMS(
        cleanPhone,
        `Your plant ${plantName} is now being monitored and you will receive notifications if it needs you!`
      );

      if (response.success) {
        onOpenChange(false);
        toast({
          title: "Success",
          description: `SMS notifications have been set up successfully. Remaining quota: ${response.quotaRemaining}`,
        });
      } else {
        throw new Error(response.error || 'Failed to send SMS');
      }
    } catch (error: any) {
      console.error('Error sending SMS:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to set up SMS notifications. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handlePhoneNumberSubmit}>
          <DialogHeader>
            <DialogTitle>Configurer les notifications SMS</DialogTitle>
            <DialogDescription>
              Entrez votre numéro de téléphone pour recevoir des notifications concernant {plantName}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <Input
              type="tel"
              placeholder="Entrez votre numéro de téléphone (10 chiffres)"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                setPhoneError("");
              }}
              required
              className={phoneError ? "border-red-500" : ""}
            />
            {phoneError && (
              <p className="text-sm text-red-500 mt-1">{phoneError}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSending}>
              {isSending ? "Configuration en cours..." : "Activer les notifications"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SMSNotificationDialog;
