"use server";

import { createClient } from "@/utils/supabase/server";
import { SchematicClient } from "@schematichq/schematic-typescript-node";

const apiKey = process.env.SCHEMATIC_API_KEY;

if (!apiKey) {
    throw new Error("Missing Schematic API key");
}

const client = new SchematicClient({
    apiKey,

})

export async function getTemporaryAccessToken() {
    const supabase = await createClient();

    // Check if user is already authenticated
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }
    const response = await client.accesstokens.issueTemporaryAccessToken({
        resourceType: "company",
        lookup: {
            id: user.id
        }
    })


    return response.data.token;

}
