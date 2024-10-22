import React, { useEffect, useState } from "react";
import { Table, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import NotificationAlert from "react-notification-alert";
import ProductsServer from "Service/ProductsServer";
import { Url } from "Service/CategoriesServer";
import Quagga from 'quagga';
import axios from "axios";

const ProductWithoutCodeBar = () => {
    const [productsData, setProductsData] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [scanResult, setScanResult] = useState(null);
    const [file, setFile] = useState(null);
    const notificationAlert = React.useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await ProductsServer.GetAllProductWithoutCodebar();
                setProductsData(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const handleImageChange = async (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
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

    const addQRToProduct = async () => {
        try {
            if (file) {
                const image = new Image();
                image.src = URL.createObjectURL(file);
                image.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = image.width;
                    canvas.height = image.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(image, 0, 0);
                    canvas.toBlob(async (blob) => {
                        const jpegFile = new File([blob], 'image.jpg', { type: 'image/jpeg' });
                        Quagga.decodeSingle(
                            {
                                src: URL.createObjectURL(jpegFile),
                                numOfWorkers: 0,
                                inputStream: {
                                    size: 800
                                },
                                decoder: {
                                    readers: ['ean_reader', 'code_128_reader', 'upc_reader']
                                }
                            },
                            async (result) => {
                                setScanResult(result);
                                if (result && result.codeResult) {
                                    try {
                                        await ProductsServer.AddCodebarToProduct(selectedProduct._id, result.codeResult.code);
                                        showNotification("Barcode added successfully!", "success");
                                        const updatedProductsData = productsData.filter(product => product._id !== selectedProduct._id);
                                        setProductsData(updatedProductsData);
                                        setSelectedProduct(null); // Close modal after adding barcode
                                    } catch (error) {
                                        showNotification("Error adding barcode: " + error, "error");
                                    }
                                } else {
                             //       console.log("No barcode detected");
                                }
                            }
                        );
                    }, 'image/jpeg');
                };
            }
        } catch (error) {
            console.error(error);
            showNotification('Error in Adding Product!', 'danger');
        }
    };

    return (
        <div className="content">
            <Table>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th style={{ width: '20%' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {productsData.map(product => (
                        <tr key={product._id}>
                            <td style={{ width: '30%' }}>
                                <img src={`${Url}/uploads/Product/${product.name}.png`} alt={product.name} style={{ height: '100px', width: '100px' }} />
                            </td>
                            <td><h6>{product.name}</h6></td>

                            <td style={{ width: '4%' }}>
                                <Button color="primary" onClick={() => setSelectedProduct(product)} style={{ width: '100%' }}>ADD product codebar</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal isOpen={selectedProduct !== null} toggle={() => setSelectedProduct(null)}>
                <ModalHeader toggle={() => setSelectedProduct(null)}></ModalHeader>
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
                            <label>Take a photo of the barcode:</label>
                            <Input type="file" accept="image/*" onChange={handleImageChange} />
                            <Button color="primary" onClick={addQRToProduct}>Add</Button>{' '}
                        </div>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={() => setSelectedProduct(null)}>Close</Button>
                </ModalFooter>
            </Modal>

            <NotificationAlert ref={notificationAlert} />
        </div>
    );
};

export default ProductWithoutCodeBar;
    