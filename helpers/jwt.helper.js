// dau tien
const jwt = require("jsonwebtoken");
//generateToken- tao token
let generateToken = (user, secretSignature, tokenLife) => {
  // Định nghĩa những thông tin của user mà bạn muốn lưu vào token ở đây
  return new Promise((resolve, reject) => {
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };
    // Thực hiện ký và tạo token
    jwt.sign(
      { data: userData },
      secretSignature,
      { algorithm: "HS256", expiresIn: tokenLife },
      (error, token) => {
        if (error) {
          return reject(error);
        }
        resolve(token);
      }
    );
  });
};
// xac minh token
let verifyToken = (token,secretKey) =>{
    return new Promise((resolve,reject)=>{
        jwt.verify(token,secretKey,(error,decoded)=>{
            if(error){
                return reject(error);
            }
            resolve(jwt.decoded);
        });
    });
};
module.exports = {
    generateToken: generateToken,
    verifyToken : verifyToken,
}
