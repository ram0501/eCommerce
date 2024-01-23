import jwt from "jsonwebtoken";

const jwtAuth = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const payload = jwt.verify(token, "GA5j1kk8sWmpTxyZjCV4dbD2sqwcFtxU");
    console.log(payload);
    req.userID = payload.userID;
    //console.log(req.userID);
  } catch (err) {
    console.log(err);
    return res.status(401).send("Unauthorized Access");
  }

  next();
};

export default jwtAuth;
