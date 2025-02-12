import {
  autoSignIn,
  confirmSignUp,
  resendSignUpCode,
  signIn,
  signOut,
  signUp,
} from "aws-amplify/auth";
import { getErrorMessage } from "../../utlis/get-error-message";
// handle the user sign up
export const userSignUp = async (formData: FormData) => {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const { isSignUpComplete, userId, nextStep } = await signUp({
      username: email,
      password: password,
      options: {
        userAttributes: {
          name: name,
          email: email,
          phone_number: "+1234567890",
          given_name: "John",
          family_name: "Doe",
        },
        autoSignIn: true, // optional
      }, // optional
    });
    return {
      status: "success",
      message: "Sign up successful",
      isSignUpComplete,
      userId,
      nextStep,
    };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    return errorMessage;
  }
};

// handle confirm sign up
export const handleConfirmSignUp = async (
  // prevState: string | undefined,
  formData: FormData
) => {
  try {
    const email = formData.get("email") as string;
    const code = formData.get("confirmationCode") as string;
    const { isSignUpComplete, nextStep } = await confirmSignUp({
      username: email,
      confirmationCode: code,
    });
    await autoSignIn();
    return {
      status: "success",
      message: "Confirmation successful",
      isSignUpComplete,
      nextStep,
    };
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    return errorMessage;
  }
};

// handle the send email verification code for resend
export const sendEmailVerificationCode = async (
  // prevState: string | undefined,
  formData: FormData
) => {
  try {
    await resendSignUpCode({
      username: String(formData.get("email")),
    });

    return {
      status: "success",
      message: "Email verification code sent",
    };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    return errorMessage;
  }
};

// handle the user sign in
export const userSignIn = async (
  prevState: string | undefined,
  formData: FormData
) => {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const { nextStep } = await signIn({
      username: email,
      password: password,
    });
    if (nextStep.signInStep === "CONFIRM_SIGN_UP") {
      await resendSignUpCode({
        username: email,
      });
    }
    return {
      status: "success",
      message: "Sign in successful",
    };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    return errorMessage;
  }
};

// handle the user sign out
export const userSignOut = async () => {
  try {
    await signOut();
    return {
      status: "success",
      message: "Sign out successful",
    };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    return errorMessage;
  }
};
