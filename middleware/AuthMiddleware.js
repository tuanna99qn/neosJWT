// Thu 2
// viet 1 middleware co chuc nang bao ve nhung api can bao mat

const jwtHelper = require("../helpers/jwt.helper");
const debug = console.log.bind(console);

// Ma secretKey  phai duoc bao mat  nen se luu bien moi truong hoac file

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "tuanneos";

// xac thuc boi token

let isAuth = async (req, res, next) => {
  // Lay token gui len tu phia client, nen truyen token va header
  const tokenFromClient = req.body.token || req.query.token || req.headers["x-access-token"];
  if (tokenFromClient) {
    // neu token ton tai
    try {
      // thuc hien giai ma token xem co hop le khong?
      const decoded = await jwtHelper.verifyToken(
        tokenFromClient,
        accessTokenSecret
      );
      // neu token hop le , luu thong tin giai ma duoc vao doi tuong req, dung cho cac xy ly o phia sau
      req.jwtDecoded = decoded;
      // cho phep req di sang controller
      next();
    } catch (error) {
      debug("Error while verify token:", error);
      return res.status(401).json({
        message: "Unauthorized.",
      });
    }
  } else {
    // khong tim thay token trong req
    return res.status(403).send({
      message: "No token provided.",
    });
  }
};
module.exports = {
    isAuth: isAuth,
}