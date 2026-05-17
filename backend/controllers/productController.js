const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

exports.getProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, search, sort, brand, type } = req.query;

    const query = {};

    // Filters
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (type) query.type = type;

    // Searching by keyword (case insensitive, partial match)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { modelNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Sorting
    let sortObj = {};
    if (sort === 'price_asc') {
      sortObj.price = 1;
    } else if (sort === 'price_desc') {
      sortObj.price = -1;
    } else {
      sortObj.createdAt = -1;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const startIndex = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name')
      .sort(sortObj)
      .skip(startIndex)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      data: products,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total
    });
  } catch (error) {
    next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name description');

    if (!product) {
      return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ featured: true }).populate('category', 'name');

    res.status(200).json({
      success: true,
      data: products,
      total: products.length
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to build array fields
const buildArrayField = (field) => {
  if (!field) return undefined;
  return Array.isArray(field) ? field : field.split(',').map(s => s.trim()).filter(s => s);
};

exports.createProduct = async (req, res, next) => {
  let imageUrl = '';
  try {
    if (!req.file) {
      return next(new ErrorResponse('Please upload an image', 400));
    }

    const result = await uploadToCloudinary(req.file.buffer, 'products');
    imageUrl = result.secure_url;

    const productData = {
      ...req.body,
      image: imageUrl,
      paperSizeSupported: buildArrayField(req.body.paperSizeSupported),
      connectivity: buildArrayField(req.body.connectivity)
    };

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    // Rollback uploaded image if database insert fails
    if (imageUrl) {
      await deleteFromCloudinary(imageUrl).catch(err => console.error('Rollback image deletion failed', err));
    }
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  let newImageUrl = '';
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
    }

    let updateData = { ...req.body };

    if (req.body.paperSizeSupported !== undefined) {
      updateData.paperSizeSupported = buildArrayField(req.body.paperSizeSupported);
    }
    if (req.body.connectivity !== undefined) {
      updateData.connectivity = buildArrayField(req.body.connectivity);
    }


    const oldImageUrl = product.image;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'products');
      newImageUrl = result.secure_url;
      updateData.image = newImageUrl;
    }

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    if (req.file && oldImageUrl) {
        await deleteFromCloudinary(oldImageUrl).catch(e => console.error(e));
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    // Rollback new image upload on error
    if (newImageUrl) {
      await deleteFromCloudinary(newImageUrl).catch(err => console.error('Rollback image deletion failed', err));
    }
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
    }

    if (product.image) {
      await deleteFromCloudinary(product.image);
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
