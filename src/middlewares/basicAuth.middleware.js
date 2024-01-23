import UserModel from "../features/user/user.model.js";

const basicAuthorizer = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    res.status(401).send("No authorization details found");
  }
  console.log(req.headers);
  console.log(authHeader);
  const base64Credentails = authHeader.replace("Basic", "");
  console.log(base64Credentails);

  const decodeCreds = Buffer.from(base64Credentails, "base64").toString("utf8");
  console.log(decodeCreds);
  const creds = decodeCreds.split(":");
  console.log(creds);
  const user = UserModel.getAll().find(
    (u) => u.email == creds[0] && u.password == creds[1]
  );

  if (user) {
    next();
  } else {
    res.status(401).send("Incorrect Credentials");
  }
};

export default basicAuthorizer;
