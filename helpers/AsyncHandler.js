//Higher order function which acts as a wrapper for async functions, wraps the passed function inside try-catch block.
const asyncHandler = (func) => async function(req, res, next) {
    try {
        await func(req, res, next);
    } catch (error) {
        console.log("Error Caught By AsyncHandler Wrapper Function!", error.message);
        res
        .status(error.code || 500)
        .json({message : error.message});
    }
}

export default asyncHandler;