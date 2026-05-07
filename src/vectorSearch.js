async function vectorSearch(){
    try {
        

        await new Promise(resolve => setTimeout(resolve, 1000));
        
    } catch (error) {
        console.error("Error during vector search:", error);
        throw error;
    }

};

module.exports = {
    vectorSearch
};