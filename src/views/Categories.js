import React, { useEffect, useState } from "react";
import { Table, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import NotificationAlert from "react-notification-alert";
import QRCode from 'react-qr-code';
import styled from "styled-components";
import CategoriesServer from "Service/CategoriesServer";
import { Url } from "Service/CategoriesServer";


const Categories = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', description: '', file: '' });
    const [showModal2, setShowModal2] = useState(false);
    const [showModal3, setShowModal3] = useState(false);
    const [categoriesData, setcategoriesData] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const notificationAlert = React.useRef(null);
    const [selectedCat, setSelectedCat] = useState(null); // State to hold the selected product
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);

const openDeleteConfirmationModal = () => {
    setShowDeleteConfirmationModal(true);
};

const closeDeleteConfirmationModal = () => {
    setShowDeleteConfirmationModal(false);
};

    const openModal3 = () => {
        setShowModal2(false);
        setShowModal3(true);
    };
    const closeModal3 = () => {
        setShowModal3(false);
    };
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredCategories = categoriesData.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewCategory({ ...newCategory, [name]: value });
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            const base64String = reader.result.split(',')[1];
       //     console.log(base64String);
            setNewCategory({ ...newCategory, file: base64String });
        };
        reader.readAsDataURL(file);
    };

    const addCategory = async () => {
        try {
            if (newCategory.name === '') { showNotification('You need to add name Categorie!', 'warning'); }
            else if (newCategory.file === '') { showNotification('You need to add photo !', 'dark'); }
            else {
                const Cat = await CategoriesServer.addCategory(newCategory);
//console.log(".....",Cat);
                 categoriesData.push(Cat);
             
                closeModal();
                setNewCategory({ name: '', description: '', file: '' });
                showNotification('Category Added Successfully!', 'success');
            }


        } catch (error) {

            console.error(error);
            showNotification('Error in Adding Category!', 'danger');
        }
    };

    const DeleteCategory = async () => {
    //    console.log(selectedCat, selectedCat._id)
        const deleteCats = await CategoriesServer.deleteCategory(selectedCat._id,selectedCat.name);
        if (deleteCats) {
            closeModal2();
            const indexToDelete = categoriesData.findIndex(category => category._id === selectedCat._id);
            if (indexToDelete !== -1) {
                const updatedCategoriesData = [...categoriesData.slice(0, indexToDelete), ...categoriesData.slice(indexToDelete + 1)];
                setcategoriesData(updatedCategoriesData);
                closeDeleteConfirmationModal()
            } else {
            }
            showNotification('Category deleted Successfully!', 'success');
        }
        else { showNotification('error in  deleted categories!', 'danger'); }
    };
    
    const ModifierCategory = async () => {
     //   console.log(selectedCat, selectedCat._id)
        // const deleteCats = await CategoriesServer.deleteCategory(selectedCat._id,selectedCat.name);
        // if (deleteCats) {
        //     closeModal2();
        //     const indexToDelete = categoriesData.findIndex(category => category._id === selectedCat._id);
        //     if (indexToDelete !== -1) {
        //         const updatedCategoriesData = [...categoriesData.slice(0, indexToDelete), ...categoriesData.slice(indexToDelete + 1)];
        //         setcategoriesData(updatedCategoriesData);
            
        //     } else {
        //     }
        //     showNotification('Category deleted Successfully!', 'success');
        // }
        // else { showNotification('error in  deleted categories!', 'danger'); }
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
    const openModal2 = (cat) => {
        setSelectedCat(cat);
        setShowModal2(true);
        setModalOpen(true);
    };

    const closeModal2 = () => {
        setShowModal2(false);
        setModalOpen(false);

    };
    useEffect(() => {
        const GetCat = async () => {
            try {
                const res = await CategoriesServer.getAllCategory();
                setcategoriesData(res);
       //         console.log(res)
            } catch (err) {
                console.error(err);
            }
        };

        GetCat();

    }, []);

    return (
        <div className="content">
            
            <Button color="primary" onClick={openModal}>Add Category</Button>
            <Input
                type="text"
                placeholder="Search by category name"
                value={searchTerm}
                onChange={handleSearchChange}
                style={{ marginTop: '10px' }}
            />
            <Table>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>

                        <th style={{ width: '20%' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCategories.map(category => (
                        <tr key={category.id}>
                            <td style={{ width: '30%' }} >

                                <ModalContent src={`${Url}/uploads/Categories/${category.name}.png`} alt={category.name} />
                            </td>
                            <td><h6>{category.name}</h6></td>

                            <td style={{ width: '4%' }}> <Button color="primary" onClick={() => openModal2(category)} style={{ width: '100%' }}>Detailler</Button></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Modal isOpen={showModal} toggle={closeModal}>
                <ModalHeader toggle={closeModal}>Add New Category</ModalHeader>
                <ModalBody>
                    <label>Name:</label>
                    <Input type="text" name="name" value={newCategory.name} onChange={handleInputChange} />
                    <label>Description:</label>
                    <Input type="text" name="description" value={newCategory.description} onChange={handleInputChange} />
                    <label>Image:</label>
                    <Input type="file" accept="image/*" onChange={handleImageChange} />
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={addCategory}>Add</Button>{' '}
                    <Button color="secondary" onClick={closeModal}>Cancel</Button>
                </ModalFooter>
            </Modal>

            {/* Model show Categorie  */}
            <Modal isOpen={showModal2} toggle={closeModal2}>
                <ModalHeader toggle={closeModal2}>Categorie Details</ModalHeader>
                <ModalBody>
                    {selectedCat && (
                        <div style={{ fontSize: '1.4rem', marginTop: '20px' }}>
                            <div style={{ textAlign: 'center' }}>
                             
                                <ModalContent2 src={`${Url}/uploads/Categories/${selectedCat.name}.png`} alt={selectedCat.name} /></div><br />
                        
                            <label>Name:</label><b> {selectedCat.name}</b> <br />
                            <label>Description:</label><b> {selectedCat.description}</b>  <br />
                            <br /> <div style={{ textAlign: 'center' }}><Button onClick={() =>openDeleteConfirmationModal()} style={{ width: '40%', backgroundColor: 'red', color: 'white' }}>Delete</Button>
                                {/* <Button style={{ width: '40%', backgroundColor: 'green', color: 'white' }} onClick={() => openModal3()} >Modifier</Button>  */}
                                 </div>

                        </div>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={closeModal2}>Close</Button>
                </ModalFooter>
            </Modal>

            {/* Model show  Modifier Cat */}

            {/* <Modal isOpen={showModal3} toggle={closeModal3}>
                <ModalHeader toggle={closeModal3}>Modifier Category</ModalHeader>
                <ModalBody>
                    <label>Name:</label>
                    <Input type="text" name="name" place={selectedCat?.name} onChange={handleInputChange} />
                    <label>Description:</label>
                    <Input type="text" name="description" value={selectedCat?.description} onChange={handleInputChange} />
                    <label>Image:</label>
                    <Input type="file" accept="image/*" onChange={handleImageChange} />
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={ModifierCategory}>Modifier</Button>{' '}
                    <Button color="secondary" onClick={closeModal3}>Cancel</Button>
                </ModalFooter>
            </Modal> */}
<Modal isOpen={showDeleteConfirmationModal} toggle={closeDeleteConfirmationModal}>
    <ModalHeader toggle={closeDeleteConfirmationModal}>Confirm Deletion</ModalHeader>
    <ModalBody>
        Are you sure you want to delete this category?<br></br> <br></br> <br></br>
        <text style={{color : "red"}}>  Deleting this category will also delete all products within it automatically</text> 
    </ModalBody>
    <ModalFooter>
        <Button color="danger" onClick={DeleteCategory}>Delete</Button>{' '}
        <Button color="secondary" onClick={closeDeleteConfirmationModal}>Cancel</Button>
    </ModalFooter>
</Modal>
            <NotificationAlert ref={notificationAlert} />

        </div>
    );
};
const ModalContent = styled.img`
   
    height: 100px;
    width: 100px;
    @media (max-width: 600px) {
     
    height: 80px;
    width: 80px;
    }
`;
const ModalContent2 = styled.img`
height: 200px;
width: 200px; 
`;

export default Categories;
