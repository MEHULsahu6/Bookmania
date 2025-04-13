// Create a base controller for common error handling
class BaseController {
    async handleAsync(req, res, asyncFn) {
        try {
            await asyncFn(req, res);
        } catch (error) {
            console.error(`Error: ${error.message}`);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
}

module.exports = BaseController;