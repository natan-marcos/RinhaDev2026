async function vectorSearch(){
    try {
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