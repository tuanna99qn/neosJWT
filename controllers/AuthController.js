// Thu 3
/* controller authController nay se gop 2 chuc nang 
    + Login - thuc hien chuc nang dang nhap , tao tojen
    + refreshToken - lam moi lai token khi het han

 */

const jwtHelper = require("../helpers/jwt.helper");
const debug = console.log.bind(console);

// bien cuc bo tren toan server nay se luu tru tram danh sach token
// thuong se dc luu vao DB

let tokenList = {};
// thoi gian song cua token
const accessTokenLife  = process.env.ACCESS_TOKEN_LIFE || "1h";
// ma secretKeyaccss
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "tuanneos";
// thoi gian song cua refreshToken
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || "3650d";
// ma secretKeyrefres
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "tuankmaneos";

// Controllers Login

let login = async (req, res) => {
  try {
    debug(
      `Đang giả lập hành động đăng nhập thành công với Email: ${req.body.email} và Password: ${req.body.password}`
    );
    // dau tien se kiem tra email nguoi dung ton tai trong he thong hay chua?
    // neu chia ton tai thi reject: User not found
    // new ton tai user thi se lay pass ma user truyen len, bam ra so sanh voi pass cua user luu trong DB
    // new pass sai thif reject: Password is incorrect.
    // new pass dung thi c hung ra se thuc hien tao ma JWTva gui ve cho nguoi dung
    debug(`Thực hiện fake thông tin user...`);
    const userFakeData = {
        _id: "1234-5678-910JOK-nqt",
        name: "Quốc Tuấn",
        email : req.body.email,
    };
    debug(` Thực hiện tạo mã Token,[thời gian sống 1 giờ.]`);
    const accessToken  = await jwtHelper.generateToken(userFakeData,accessTokenSecret,accessTokenLife);
    debug(` Thực hiện tạo mã Refresh Token,[Thời gian sống 10 năm.]`);
    const refreshToken   = await jwtHelper.generateToken(userFakeData,refreshTokenSecret,refreshTokenLife);
    // Luu accss và refresh vào tokenList 
    tokenList[refreshToken] ={accessToken,refreshToken};
    debug(`Gửi Token và Refresh Token về cho client...`);
    return res.status(200).json({accessToken, refreshToken});
  } catch (error) {
    return res.status(500).json(error);
  }
};
//  controller refreshToken
  let refreshToken  = async(req,res)=>{
      // User gửi mã refersh token kèm theo trong body
      const refreshTokenFromClient  = req.body.refreshToken;
      debug("TokenList:",tokenList);
      // nếu như tồn tại RefershToken truyền lên và nó cũng nằm trong tokenList 
      if(refreshTokenFromClient && (tokenList[refreshTokenFromClient])){
        try {
            // Verify kiểm tra tính hợp lệ của resfreshToken và lấy dữ liệu giải mã decoded
            const decoded = await jwtHelper.verifyToken(refreshTokenFromClient,refreshTokenSecret);
            // thông tin user lúc này có thể lấy qua decoded.data
            debug("decoded:",decoded);
            const  userFakeData  = decoded.data;
            debug(`Thực hiện tạo mã Token trong bước gọi refresh Token, [thời gian sống vẫn là 1 giờ.]`);
            const accessToken  = await jwtHelper.generateToken(userFakeData,accessTokenSecret,accessTokenLife);
            // gửi token mới về cho người dùng
            return res.status(200).json({accessToken});
          } catch (error) {
              debug(error);
              res.status(403).json({
                  msg:'Invalid refresh token',
              });
          }
      }
else {
    // Không tìm thấy token trong request
    return res.status(403).send({
        msg:'No token provided.'
    });
}
};
module.exports = {
    login:login,
    refreshToken: refreshToken,
}
