const { category , productCategory } = require('../../models')

exports.addCategory = async (req, res) => {
    // code here
    try {
        const data = req.body

        // console.log(data);
        const newCategory = await category.create(data)

        let categoryData = await category.findOne({
            where: {
                id:newCategory.id,
              },
            attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
        })

        res.send({
            status: "success",
            data: { 
                category : 
                    categoryData
                
        }})

    } catch (error) {
        res.send({
            status: "failed",
            message: "server error"
        })
    }
}

exports.getAllCategories = async (req, res) => {
    try {
      const data = await category.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
  
      res.send({
        status: "success...",
        data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: "failed",
        message: "Server Error",
      });
    }
  };
  
  exports.getCategory = async (req, res) => {
    try {
      const { id } = req.params;
      const data = await category.findOne({
        where: {
          id,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
  
      res.send({
        status: "success...",
        data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: "failed",
        message: "Server Error",
      });
    }
  };
  
  exports.updateCategory = async (req, res) => {
    try {
      const { id } = req.params;
      const newCategory = await category.update(req.body, {
        where: {
          id,
        },
      });
  
      res.send({
        status: "success...",
        data: {
          id: newCategory.id,
          name: newCategory.name,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: "failed",
        message: "Server Error",
      });
    }
  };
  
  exports.deleteCategory = async (req, res) => {
    try {
      const { id } = req.params;
  
      
  
      await productCategory.destroy({
        where: {
          idCategory: id,
        },
      });

      await category.destroy({
        where: {
          id,
        },
      });
  
      res.send({
        status: "success",
        message: `Delete category id: ${id} finished`,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: "failed",
        message: "Server Error",
      });
    }
  };