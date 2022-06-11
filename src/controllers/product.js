const {
  product,
  user,
  productCategory,
  category,
  cart,
  transaction,
  profile,
} = require("../../models");

const cloudinary = require("../utils/cloudinary");

exports.addProduct = async (req, res) => {
  try {
    // if (req.user.status != "admin"){
    //   res.status(401).send({
    //     status: "failed",
    //     message: "Only admin can add Product!"
    //   })
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "dumbmerch",
      use_filename: true,
      unique_filename: false,
    });

    const { ...data } = req.body;
    const categoryName = req?.body?.category;

    // const { category: categoryName, ...data } = req.body;
    const profileData = await profile.findOne({
      where: {
        idUser: req.user.id,
      },
    });
    const newProduct = await product.create({
      ...data,
      image: result.public_id,
      idUser: req.user.id,
      idProfile: profileData.id,
    });

    const categoryData = await category.findOne({
      // where: {
      //   name: categoryName,
      // },
    });

    if (categoryData) {
      await productCategory.create({
        idCategory: categoryData.id,
        idProduct: newProduct.id,
      });
    } else {
      const newCategory = await category.create({ name: categoryName });
      await productCategory.create({
        idCategory: newCategory.id,
        idProduct: newProduct.id,
      });
    }
    let productData = await product.findOne({
      where: {
        id: newProduct.id,
      },
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      },
    });

    // code here
    productData = JSON.parse(JSON.stringify(productData));
    res.send({
      staus: "success",
      data: {
        ...productData,
        image: process.env.PATH_FILE + productData.image,
      },
    });
  } catch (error) {
    console.log(error);
    // console.log(req.user);
    const userId = req.user.id;
    res.status(500).send({
      status: "failed",
      message: "Server Error",
      userId,
    });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    let products = await product.findAll({
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
        {
          model: category,
          as: "categories",
          through: {
            model: productCategory,
            as: "bridge",
            attributes: [],
          },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      },
    });
    products = JSON.parse(JSON.stringify(products));
    products = products.map((item) => {
      return {
        ...item,
        image: process.env.PATH_FILE + item.image,
      };
    });
    res.send({
      status: "success...",
      data: {
        products: products,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let productData = await product.findOne({
      where: { id },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    productData = JSON.parse(JSON.stringify(productData));

    res.send({
      status: "success",
      data: {
        ...productData,
        image: process.env.PATH_FILE + productData.image,
      },
    });
  } catch (error) {}
};

exports.updateProduct = async (req, res) => {
  // code here
  try {
    const id = req.params.id;
    const data = {
      name: req?.body?.name,
      desc: req?.body?.desc,
      price: req?.body?.price,
      image: req?.file?.filename,
      qty: req?.body?.qty,
    };

    await product.update(data, {
      where: {
        id,
      },
    });

    res.send({
      status: "success",
      message: `Update successfull for product with id: ${id}`,
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

exports.deleteProduct = async (req, res) => {
  // code here
  try {
    const { id } = req.params;

    await cart.destroy({
      where: {
        idProduct: id,
      },
    });

    await transaction.destroy({
      where: {
        idProduct: id,
      },
    });

    await productCategory.destroy({
      where: {
        idProduct: id,
      },
    });

    await product.destroy({
      where: {
        id,
      },
    });

    res.send({
      status: "success",
      message: `Delete product with id:${id} finished`,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};
