import jwt from 'jsonwebtoken';

export default (request, response, next) => {
  const token = (request.headers.authorization || '').replace(/Bearer\s?/, '');

  if (token) {
    try {
      const decoded = jwt.verify(token, 'secretKey');

      request.userId = decoded._id;
      next();
    } catch (error) {
      return response.status(403).json({
        message: 'No access',
      });
    }
  } else {
    return response.status(403).json({
      message: 'No access',
    });
  }
}
