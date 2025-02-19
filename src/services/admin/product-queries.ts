import pool from "../../modules/connectdb";

interface productType {
    id: number;
    index: number;
    name: string;
    price: number;
    vendor_id: number;
    image: string | null;
};




const queryProducts = (vendorId: number, pagin: number, limit: number) => {
    return new Promise<productType[]>((resolve, reject) => {
        const query = 'SELECT * FROM products WHERE vendor_id = ?   ORDER BY \`index\` ASC LIMIT ? OFFSET ?';

        pool.query(query, [vendorId, limit, pagin], (err, result) => {
            if (err) return reject(err);

            resolve(result);
        });
    });
};



const queryProductInfoByIndexAndVendorId = (vendorId: number, index: number) => {
    return new Promise<productType>((resolve, reject) => {
        const query = 'SELECT * FROM products WHERE vendor_id = ? AND \`index\` = ?';

        pool.query(query, [vendorId, index], (err, result) => {
            if (err) return reject(err);

            resolve(result[0]);
        });
    });
};


// query to save new product
const queryAddNewProduct = (vendorId: number, name: string, price: number, index: number) => {
    return new Promise<boolean>((resolve, reject) => {
        const date = new Date();
        const query = 'INSERT INTO products (vendor_id, name, price, \`index\`, created_at) VALUES (?, ?, ?, ?, ?)';

        pool.query(query, [vendorId, name, price, index, date], (err, result) => {
            if (err) return reject(err);

            resolve(result.affectedRows > 0);
        });
    });
};


// qquery to cehck if product image exist
const queryProdutImageExists = (productId: number, vendorId: number) => {
    return new Promise<number>((resolve, reject) => {
        const query = 'SELECT COUNT(*) FROM product_images WHERE product_id = ? AND vendor_id = ?';

        pool.query(query, [productId, vendorId], (err, result) => {
            if (err) return reject(err);

            resolve(result[0]['COUNT(*)']);
        });
    });
};


// to insert new product image
const queryAddProductImage = (productId: number, vendorId: number, imageBuffer: Buffer) => {
    return new Promise<boolean>((resolve, reject) => {
        const date = new Date();
        const query = 'INSERT INTO product_images (image, product_id, vendor_id, created_at) VALUES (?, ?, ?, ?)';

        pool.query(query, [imageBuffer, productId, vendorId, date], (err, result) => {
            if (err) return reject(err);

            resolve(result.affectedRows > 0);
        });
    });
};


// to update product image
const queryUpdateProductImaage = (productId: number, vendorId: number, imageBuffer: Buffer) => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'UPDATE products SET image = ? WHERE id = ? AND vendor_id = ?';

        pool.query(query, [imageBuffer, productId, vendorId], (err, result) => {
            if (err) return reject(err);

            resolve(result.affectedRows > 0);
        });
    });
};

// query to update course
const queryEditProduct = (vendorId: number, productId: number, name: string, index: number, price: number) => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'UPDATE products SET name = ?, \`index\` = ?, price = ? WHERE id = ? AND vendor_id = ?';

        pool.query(query, [name, index, price, productId, vendorId], (err, result) => {
            if (err) return reject(err);

            resolve(result.affectedRows > 0);
        });
    });
};



// query to delete product
const queryDeleteProduct = (productId: number, vendorId: number) => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'DELETE FROM products WHERE id = ? AND vendor_id = ?';

        pool.query(query, [productId, vendorId], (err, result) => {
            if (err) return reject(err);

            resolve(result.affectedRows > 0);
        });
    });
};


// query to update product availability
const queryUpdateProductAvailability = (updaterId: number, vendorId: number, productId: number, available: boolean) => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'UPDATE products SET available = ?, last_avail_by = ? WHERE id = ? AND vendor_id = ?';

        pool.query(query, [available, updaterId, productId, vendorId], (err, result) => {
            if (err) return reject(err);

            resolve(result.affectedRows > 0);
        });
    });
};


export {
    queryProducts,
    queryProductInfoByIndexAndVendorId,
    queryAddNewProduct,
    queryProdutImageExists,
    queryAddProductImage,
    queryUpdateProductImaage,
    queryEditProduct,
    queryDeleteProduct,
    queryUpdateProductAvailability,
}