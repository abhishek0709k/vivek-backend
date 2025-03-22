// first approach --> By Promises
const asyncHandler = (func) => {
  return (req, res, next) => {
    Promise.resolve(func(req, res, next)).catch((error) => {
      next
    });
  };
};

// second approach
// const asyncHandler = (func) => {
//   return async (req , res , next) => {
//     try {
//          await func(req , res , next)
//     } catch (error) {
//       return res.status(error.code || 500).json({
//         "Error" : error,
//         success: false,
//       });
//     }
//   }
// };

module.exports = asyncHandler;
