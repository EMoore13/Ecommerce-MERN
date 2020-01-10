const formidible = require('formidable');
const fs = require('fs');
const _ = require('lodash');
const Product = require('../models/product');

const {errorHandler} = require('../helpers/dbErrorHandler');

exports.create = (req, res) => {
    let form = new formidible.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Product upload error'
            });
        }

        let product = new Product(fields);

        if (files.photo) {
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }

        product.save((err, result) => {
            if (err) {
                res.status(400).json({
                    error: errorHandler(err)
                });
            }

            res.json({result});
        })
    });
};