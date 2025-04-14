"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation";

type SignUpResponse = {
    success: boolean;
    message: string;
}

export async function signUp(formData: FormData): Promise<SignUpResponse> {
    const supabase = await createClient()

    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const fullName = formData.get("name") as string

    // Check if email already exists in auth.users


    const data = {
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
        },
    }

    const { error } = await supabase.auth.signUp(data)


    if (error) {
        return {
            success: false,
            message: error.message || "Failed to sign up. Please try again.",
        }
    }


    revalidatePath("/", "layout")
    return {
        success: true,
        message: "Account created successfully! Please check your email to verify your account before logging in.",
    }
}

export async function signIn(formData: FormData) {
    const supabase = await createClient();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const data = {
        email,
        password,
    }

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath("/", "layout");
    redirect("/dashboard");
}
