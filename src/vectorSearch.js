async function vectorSearch(){
    try {
        // Simulate a delay for the vector search operation
        await new Promise(resolve => setTimeout(resolve, 1000));
        return "running vector search";
    } catch (error) {
        console.error("Error during vector search:", error);
        throw error;
    }

};

module.exports = {
    vectorSearch
};