/**
 * Calculate password strength on a scale of 0-100
 * @param password The password to evaluate
 * @returns A number from 0-100 representing password strength
 */
export function calculatePasswordStrength(password: string): number {
    if (!password) {
        return 0
    }

    let strength = 0

    // Length check
    if (password.length >= 8) strength += 25

    // Contains number
    if (/\d/.test(password)) strength += 25

    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 25

    // Contains uppercase or special char
    if (/[A-Z]/.test(password) || /[^A-Za-z0-9]/.test(password)) strength += 25

    return strength
}

/**
 * Check if passwords match
 * @param password The main password
 * @param confirmPassword The confirmation password
 * @returns Boolean indicating if passwords match
 */
export function doPasswordsMatch(password: string, confirmPassword: string): boolean {
    if (!confirmPassword || !password) return true // Don't show error when fields are empty
    return password === confirmPassword
}

/**
 * Get the appropriate color class for password strength indicator
 * @param strength Password strength value (0-100)
 * @returns Tailwind CSS class for the appropriate color
 */
export function getPasswordStrengthColor(strength: number): string {
    if (strength < 50) return "bg-red-500"
    if (strength < 75) return "bg-yellow-500"
    return "bg-green-500"
}

/**
 * Get a text description of password strength
 * @param strength Password strength value (0-100)
 * @returns String description of password strength
 */
export function getPasswordStrengthText(strength: number): string {
    if (strength < 50) return "Weak"
    if (strength < 75) return "Medium"
    return "Strong"
}

/**
 * Check if a specific password requirement is met
 * @param password The password to check
 * @param requirement The requirement type to check
 * @returns Boolean indicating if the requirement is met
 */
export function isPasswordRequirementMet(
    password: string,
    requirement: "length" | "number" | "lowercase" | "uppercaseOrSpecial",
): boolean {
    switch (requirement) {
        case "length":
            return password.length >= 8
        case "number":
            return /\d/.test(password)
        case "lowercase":
            return /[a-z]/.test(password)
        case "uppercaseOrSpecial":
            return /[A-Z]/.test(password) || /[^A-Za-z0-9]/.test(password)
        default:
            return false
    }
}
