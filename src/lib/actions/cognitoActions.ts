import {
  autoSignIn,
  confirmResetPassword,
  confirmSignUp,
  confirmUserAttribute,
  resendSignUpCode,
  resetPassword,
  signIn,
  signOut,
  signUp,
  updatePassword,
  updateUserAttribute,
  type UpdateUserAttributeOutput,
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

// update user profile
export async function handleUpdateUserAttribute(formData: FormData) {
  const attributesToUpdate: { attributeKey: string; value: string }[] = [];
  if (formData.get("name")) {
    const name = String(formData.get("name"));
    const currentName = String(formData.get("current_name") || "");
    if (name !== currentName) {
      attributesToUpdate.push({ attributeKey: "name", value: name });
    }
  }

  if (formData.get("email")) {
    const email = String(formData.get("email"));
    const currentEmail = String(formData.get("current_email") || "");
    if (email !== currentEmail) {
      attributesToUpdate.push({ attributeKey: "email", value: email });
    }
  }

  if (formData.get("phone_number")) {
    const phoneNumber = String(formData.get("phone_number"));
    const currentPhoneNumber = String(
      formData.get("current_phone_number") || ""
    );
    if (phoneNumber !== currentPhoneNumber) {
      attributesToUpdate.push({
        attributeKey: "phone_number",
        value: phoneNumber,
      });
    }
  }

  if (attributesToUpdate.length === 0) {
    return "No changes detected.";
  }

  try {
    const responses = await Promise.all(
      attributesToUpdate.map(async (attr) => {
        const output = await updateUserAttribute({
          userAttribute: attr,
        });
        return handleUpdateUserAttributeNextSteps(output);
      })
    );
    return responses;
  } catch (error) {
    return getErrorMessage(error);
  }
}

function handleUpdateUserAttributeNextSteps(output: UpdateUserAttributeOutput) {
  const { nextStep } = output;

  switch (nextStep.updateAttributeStep) {
    case "CONFIRM_ATTRIBUTE_WITH_CODE":
      return `Confirmation code was sent to ${nextStep.codeDeliveryDetails?.destination}.`;
    case "DONE":
      return "success";
  }
}
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

// after email change confirmation
export const handleConfirmUserAttribute = async (formData: FormData) => {
  try {
    const code = formData.get("confirmationCode") as string;
    await confirmUserAttribute({
      userAttributeKey: "email",
      confirmationCode: String(code),
    });
    return {
      status: "success",
      message: "Email change successful",
    };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    return errorMessage;
  }
};

// after phone number change confirmation (not implemented)

// password reset
export const handlePasswordReset = async (formData: FormData) => {
  try {
    const email = formData.get("email") as string;
    // check email exists in the user pool
    // const userCheck = await checkIfUserExists(email);
    // if (userCheck.status === "error") {
    //   return userCheck.message; // User not found
    // }
    await resetPassword({
      username: email,
    });
    return {
      status: "success",
      message: "Password reset successful",
    };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    return errorMessage;
  }
};

// after password reset confirmation
export const handleConfirmResetPassword = async (formData: FormData) => {
  try {
    await confirmResetPassword({
      username: String(formData.get("email")),
      confirmationCode: String(formData.get("confirmationCode")),
      newPassword: String(formData.get("password")),
    });
    return {
      status: "success",
      message: "Password change successful",
    };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    return errorMessage;
  }
};

// password change
export const handlePasswordChange = async (formData: FormData) => {
  try {
    const currentPassword = formData.get("current_password") as string;
    const newPassword = formData.get("password") as string;
    if (currentPassword === newPassword) {
      return {
        status: "error",
        message: "New password must be different from the current password",
      };
    }
    await updatePassword({
      oldPassword: currentPassword,
      newPassword: newPassword,
    });
    return {
      status: "success",
      message: "Password change successful",
    };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    return errorMessage;
  }
};
