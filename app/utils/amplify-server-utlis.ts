import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import { authConfig } from "../amplify-cognito-config";

export const { runWithAmplifyServerContext } = createServerRunner({
  config: {
    Auth: authConfig,
  },
});
