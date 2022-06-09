const { profile, user } = require("../../models");

exports.getProfile = async (req, res) => {
  try {
    const idUser = req.user.id;

    let data = await profile.findOne({
      where: {
        idUser,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      },
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password", "status"],
          },
        },
      ],
    });

    data = JSON.parse(JSON.stringify(data));

    data = {
      ...data,
      image: "http://localhost:5000/uploads/" + data.image,
    };

    res.send({
      status: "success...",
      data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.updateProfile = async (req, res) => {
  // code here
  try {
    const id = req.params.id;
    const data = {
      phone: req.body.phone,
      gender: req.body.gender,
      address: req.body.address,
      image: req.file.filename,
    };

    await profile.update(data, {
      where: {
        id,
      },
    });

    res.send({
      status: "success",
      message: `Update successfull for profile with id: ${id}`,
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};
