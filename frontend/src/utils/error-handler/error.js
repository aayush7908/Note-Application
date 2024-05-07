const error = (err) => {
    return {
        success: false, 
        errors: ["Something went wrong !!!"]
    };
}

export { error };