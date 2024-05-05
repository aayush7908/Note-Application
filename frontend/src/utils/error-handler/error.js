const error = (err) => {
    console.log("Some error occurred:", err);
    return {
        success: false, 
        errors: ["Something went wrong !!!"]
    };
}

export { error };