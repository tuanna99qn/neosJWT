//Thứ 4
// lấy ra danh sách bạn bè người dùng

const debug = console.log.bind(console);

let friendLists  = (req, res) => {
  debug(
    `Xác thực token hợp lệ, thực hiện giả lập lấy danh sách bạn bè của user và trả về cho người dùng...`
  );
  // viêc này sẽ phải query đến DB để lấy
  const friends = [
    {
      name: "Cat: Russian Blue",
    },
    {
      name: "Cat: Maine Coon",
    },
    {
      name: "Cat: Balinese",
    },
  ];
  return res.status(200).json(friends);
};
module.exports = {
  friendLists: friendLists,
};
