import React, { useEffect, useState } from "react";
import { Table, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import NotificationAlert from "react-notification-alert";
import ProductsServer from "Service/ProductsServer";
import { Url } from "Service/CategoriesServer";
import Quagga from 'quagga';
const Product = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', description: '', categoryId: '', prix_achat: '', prix_vente: '', file: '' });
    const [productsData, setProductsData] = useState([]);
    const [categoriesData, setCategoriesData] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
    const notificationAlert = React.useRef(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const openDeleteConfirmationModal = () => {
        setShowDeleteConfirmationModal(true);
        
    };

    const closeDeleteConfirmationModal = () => {
        setShowDeleteConfirmationModal(false);
         
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleCategoryChange = (event) => {
        setCategoryFilter(event.target.value);
    };

    let filteredProducts;
    if (Array.isArray(productsData)) {
        filteredProducts = productsData.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (categoryFilter === '' || product.categoryId === categoryFilter)
        );
    } else if (typeof productsData === 'object' && productsData !== null) {
        // If productsData is a single object, convert it to an array with a single element
        filteredProducts = [productsData];
    } else {
        // If productsData is neither an array nor an object, assign an empty array
        filteredProducts = [];
    }

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            const base64String = reader.result.split(',')[1];
            setNewProduct({ ...newProduct, file: base64String });
        };
        reader.readAsDataURL(file);
    };
    

    const addProduct = async () => {
        try {
            if (newProduct.name === '') { showNotification('You need to add product name!', 'warning'); }
            else if (newProduct.file === '') { showNotification('You need to add photo!', 'dark'); }
            else if (newProduct.categoryId === '') { showNotification('You need to select a category!', 'danger'); }
         else if (newProduct.prix_achat === '' || isNaN(parseFloat(newProduct.prix_achat)) || newProduct.prix_vente === '' || isNaN(parseFloat(newProduct.prix_vente))) {
            showNotification('Price should be a valid number!', 'danger');
        }  else {
                const addedProduct = await ProductsServer.addProduct(newProduct);
                setProductsData([...productsData, addedProduct]);
                closeModal();
                setNewProduct({ name: '', description: '', categoryId: '', prix_achat: '', prix_vente: '', file: '' });
                showNotification('Product Added Successfully!', 'success');
            }
        } catch (error) {
            console.error(error);
            showNotification('Error in Adding Product!', 'danger');
        }
    };

    const deleteProduct = async () => {
        try {
            const deleted = await ProductsServer.deleteProduct(selectedProduct._id, selectedProduct.name);
            if (deleted) {
                const updatedProductsData = productsData.filter(product => product._id !== selectedProduct._id);
                setProductsData(updatedProductsData);
                closeDeleteConfirmationModal();
                setSelectedProduct(null);
                showNotification('Product Deleted Successfully!', 'success');
            } else {
                showNotification('Error in Deleting Product!', 'danger');
            }
        } catch (error) {
            console.error(error);
            showNotification('Error in Deleting Product!', 'danger');
        }
    };
    const SearchProductwithcodebar = async (event) => {
        try {
            const file = event.target.files[0];
            if (!file) return;
    
            // Load the image file
            const image = new Image();
            image.src = URL.createObjectURL(file);
            image.onload = () => {
                // Create a canvas to work with the image
                const canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(image, 0, 0);
    
                // Convert canvas content to blob
                canvas.toBlob(async (blob) => {
                    const jpegFile = new File([blob], 'image.jpg', { type: 'image/jpeg' });
    
                    // Decode barcode using Quagga
                    Quagga.decodeSingle(
                        {
                            src: URL.createObjectURL(jpegFile),
                            numOfWorkers: 0,
                            inputStream: { size: 800 },
                            decoder: { readers: ['ean_reader', 'code_128_reader', 'upc_reader'] }
                        },
                        async (result) => {
                            if (result.codeResult.code) {
                               
                                try {
                                    // Fetch product data using the decoded barcode
                                    const res = await ProductsServer.GetProductWithCodebar(result.codeResult.code);
                                    showNotification("Product with this code bar found!", "success");
                                 
                                    setProductsData(res);
                                } catch (error) {
                                    showNotification("Error fetching product: " + error, "error");
                                }
                            } else {
                                showNotification("No barcode detected!", "warning");
                            }
                        }
                    );
                }, 'image/jpeg');
            };
        } catch (error) {
            console.error(error);
            showNotification('Error processing barcode!', 'danger');
        }
    };
    

    const showNotification = (message, type) => {
        const options = {
            place: 'tr',
            message: (
                <div>
                    {message}
                </div>
            ),
            type: type,
            autoDismiss: 3,
        };
        notificationAlert.current.notificationAlert(options);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await ProductsServer.getAllProduct();
                const cat = await ProductsServer.getAllNameCategory();
                setProductsData(data);
                setCategoriesData(cat)
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="content">
            <Button color="primary" onClick={openModal}>Add Product</Button>
           
            <Input
                type="text"
                placeholder="Search by product name"
                value={searchTerm}
                onChange={handleSearchChange}
                style={{ marginTop: '10px' }}
            />
            Filtering By Categories
            <select
                value={categoryFilter}
                onChange={handleCategoryChange}
                style={{
                    padding: '7px',
                    borderRadius: '7px',
                    width: '150px',
                    marginLeft: '10px',
                    marginTop: '10px',
                    border: '1px solid #ced4da', // Bootstrap's default input border color
                }}
            >
                <option value="">All Categories</option>
                {categoriesData.map(category => (
                    <option key={category._id} value={category._id}>{category.name}</option>
                ))}
            </select>
            <label>Search with codeBar:</label>
                    <Input type="file" accept="image/*" onChange={SearchProductwithcodebar} />
            <Table>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        {windowWidth > 700 && (
                            <>
                                <th>prix achat</th>
                                <th>prix vente</th>
                            </>
                        )}
                        <th style={{ width: '20%' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.map(product => (
                        <tr key={product._id}>
                            <td style={{ width: '30%' }}>
                                <img src={`${Url}/uploads/Product/${product.name}.png`} alt={product.name} style={{ height: '100px', width: '100px' }} />
                            </td>
                            <td><h6>{product.name}</h6></td>
                            {windowWidth > 700 && (
                                <>
                                    <td><h6>{product.prix_achat} DT</h6></td>
                                    <td><h6>{product.prix_vente} DT</h6></td>
                                </>
                            )}
                            <td style={{ width: '4%' }}>
                                <Button color="primary" onClick={() => setSelectedProduct(product)} style={{ width: '100%' }}>Details</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Modal isOpen={showModal} toggle={closeModal}>
                <ModalHeader toggle={closeModal}>Add New Product</ModalHeader>
                <ModalBody>
                    <label>Name:</label>
                    <Input type="text" name="name" value={newProduct.name} onChange={handleInputChange} />
                    <label>Description:</label>
                    <Input type="text" name="description" value={newProduct.description} onChange={handleInputChange} />
                    <label>prix vente:</label>
                    <Input type="text" name="prix_vente" value={newProduct.prix_vente} onChange={handleInputChange} />
                    <label>prix achat:</label>
                    <Input type="text" name="prix_achat" value={newProduct.prix_achat} onChange={handleInputChange} />
                    <label>Category:</label>
                    <select
                        name="categoryId"
                        value={newProduct.categoryId}
                        onChange={handleInputChange}
                        style={{ marginBottom: '10px' }}
                    >
                        <option value="">Select a category</option>
                        {categoriesData.map(category => (
                            <option key={category._id} value={category._id}>{category.name}</option>
                        ))}
                    </select>
                    <label>Image:</label>
                    <Input type="file" accept="image/*" onChange={handleImageChange} />
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={addProduct}>Add</Button>{' '}
                    <Button color="secondary" onClick={closeModal}>Cancel</Button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={selectedProduct !== null} toggle={() => setSelectedProduct(null)}>
                <ModalHeader toggle={() => setSelectedProduct(null)}>Product Details</ModalHeader>
                <ModalBody>
                    {selectedProduct && (
                        <div style={{ fontSize: '1.4rem', marginTop: '20px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <img src={`${Url}/uploads/Product/${selectedProduct.name}.png`} alt={selectedProduct.name} style={{ height: '200px', width: '200px' }} />
                            </div>
                            <br />
                            <label>Name:</label><b> {selectedProduct.name}</b><br />
                            <label>Description:</label><b> {selectedProduct.description}</b><br />
                            <label>prix vente:</label><b> {selectedProduct.prix_vente} DT</b><br />
                            <label>prix achat:</label><b> {selectedProduct.prix_achat} DT</b><br />
                            <br/>
                            <div style={{ textAlign: 'center' }}>
                                <Button onClick={openDeleteConfirmationModal} style={{ width: '40%', backgroundColor: 'red', color: 'white' }}>Delete</Button>
                            </div>
                        </div>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={() => setSelectedProduct(null)}>Close</Button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={showDeleteConfirmationModal} toggle={closeDeleteConfirmationModal}>
                <ModalHeader toggle={closeDeleteConfirmationModal}>Confirm Deletion</ModalHeader>
                <ModalBody>
                    Are you sure you want to delete this product?
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={deleteProduct}>Delete</Button>{' '}
                    <Button color="secondary" onClick={closeDeleteConfirmationModal}>Cancel</Button>
                </ModalFooter>
            </Modal>
            <NotificationAlert ref={notificationAlert} />
        </div>
    );
};

export default Product;
