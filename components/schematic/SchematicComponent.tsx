import React from "react";

import { getTemporaryAccessToken } from "@/actions/getTemporaryAccessToken";
import SchematicEmbed from "./SchematicEmbed";

async function SchematicComponent({ componentId }: { componentId: string }) {
  if (!componentId) {
    return null;
  }
  //get access token

  const accessToken = await getTemporaryAccessToken();
  if (!accessToken) {
    throw new Error("No access token");
  }
  return <SchematicEmbed accessToken={accessToken} componentId={componentId} />;
}

export default SchematicComponent;
