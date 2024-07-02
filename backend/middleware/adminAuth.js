const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ADMIN_SECRET);
  } catch (e) {
    throw new Error("Invalid token");
  }
};

const protectAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log(authHeader);
  if(!authHeader || !authHeader.startsWith('Bearer')){
      return res.status(401).send('Unauthorized');
  }
  const token = authHeader.split(' ')[1];
  try{
      const user = verifyToken(token);
      req.user = user;
      next();
  }catch(e){
      return res.status(401).send('Unauthorized');
  }
};


export default protectAdmin;
