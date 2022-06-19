exports.singIn = async (req, res) => {
    try{
        // TODO
    }catch (e) {
        console.log(e)
        res.status(400).json({
            message: "An error are provided!",
            error: e.message
        })
    }
}