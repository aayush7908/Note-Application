export const handleError = (errors = ["Some Error Occurred"]) => {
    return {
        success: false,
        errors: errors
    }
}