"use client";
interface LogoutModalProps {
  showLogoutModal: boolean;
  setShowLogoutModal: (value: boolean) => void;
}
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { userSignOut } from "@/lib/actions/cognitoActions";
import { getErrorMessage } from "@/utlis/get-error-message";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LogoutModal({
  showLogoutModal,
  setShowLogoutModal,
}: LogoutModalProps) {
  const { push } = useRouter();

  async function handleSignOut() {
    try {
      const res = await userSignOut();
      if (typeof res !== "string" && res?.status === "success") {
        toast.success(res.message);
        setShowLogoutModal(false);
        push("/");
      } else {
        toast.error(typeof res === "string" ? res : res.message);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    }
  }

  return (
    <AlertDialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Log Out From Other Devices?</AlertDialogTitle>
          <AlertDialogDescription>
            Your password has been changed. Do you want to log out from all
            other devices?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setShowLogoutModal(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleSignOut}>Logout</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
