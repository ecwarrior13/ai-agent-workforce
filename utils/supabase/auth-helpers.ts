import { createClient } from "./client";

export async function verifyOtp(otp: string, email: string) {
    const supabase = createClient();
    const isPasswordReset = sessionStorage.getItem("isPasswordReset") == "true";


    const { data, error } = await supabase.auth.verifyOtp({
        token: otp,
        email: email,
        type: isPasswordReset ? "recovery" : "signup"
    });
    if (error) {
        throw error;
    }
    return data;
}

export async function login(email: string, password: string) {
    const supabase = createClient();
    const { error, data } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    })
    if (error) {
        throw error;
    }
    return data;
}
export async function logout() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
        throw error;
    }
}
export async function updatePassword(newPassword: string) {
    const supabase = createClient()

    const { error } = await supabase.auth.updateUser({
        password: newPassword
    })
    if (error) {
        throw error;
    }
}
