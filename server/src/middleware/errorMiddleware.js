export const errorHandler = (err, req, res, next) => {
  console.error(err.stack); 

  res.status(500).json({
    success: false,
    error: {
      code: 'SERVER_ERROR',
      details: ['Something went wrong on the server']
    }
  });
};

export default errorHandler;
