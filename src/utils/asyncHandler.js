// first approach --> By Promises
// const asyncHandler = (func) => {
//   (req, res, next) => {
//     Promise.resolve(func(req, res, next)).catch((error) => {
//       next({ "Error": error });
//     });
//   };
// };

// second approach
const asyncHandler = (func) => {
  async () => {
    try {
        await func(req , res , next)
    } catch (error) {
      return res.status(error.code || 500).json({
        "Error": error.message,
        success: false,
      });
    }
  };
};

module.exports = asyncHandler;
