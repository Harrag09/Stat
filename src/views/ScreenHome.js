import React, { useState, useEffect } from 'react';
import { Button as MuiButton, Accordion, AccordionActions, AccordionDetails, AccordionSummary, TextField } from '@mui/material';
import { ExpandMore, GroupAddOutlined } from '@material-ui/icons';
import { Add } from '@material-ui/icons';
import AdminService from 'Service/AdminService';
import { Button as RsButton, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import NotificationAlert from "react-notification-alert";
import { useNavigate } from 'react-router-dom';
import ReactLoading from 'react-loading';
import styled from 'styled-components';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";

//import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';


function ScreenHome() {
  const notificationAlert = React.useRef(null);
  const [storesData, setStoresData] = useState([]);
  const [filteredStores, setfilteredStores] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryCRM, setSearchQueryCRM] = useState('');
  const [expandedPanel, setExpandedPanel] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [showModalAjout, setShowModalAjout] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [showModalLicence, setShowModalLicence] = useState(false);
  const [showModalSupprimer, setShowModalSupprimer] = useState(false);
  const [selectedBase, setSelectedBase] = useState(""); // State to store selected base

  const [showModalConfirmationView, setShowModalConfirmationView] = useState(false);
  const [newRest, setNewRes] = useState({ Nom: '', Login: '', idCRM: '', Password: '', Email: '', Tel: '' });
  const [updRest, setUpdRest] = useState([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);






  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewRes({ ...newRest, [name]: value });
  };

  // const handleInputChangeUpdate = (event) => {
  //   const { name, value } = event.target;
  //   setUpdRest({ ...updRest, [name]: value });
  //   setSelectedBase(value);
  // };
  const handleInputChangeUpdate = (event) => {
    const { name, value } = event.target;
    setSelectedBase(value); // Update the selectedBase state
    setUpdRest({ ...updRest, [name]: value });
  };
  const closeModalAjout = () => {
    setShowModalAjout(false);
    setSelectedStore(null)
    setNewRes({ Nom: '', Login: '', idCRM: '', Password: '', Email: '', Tel: '' })
  };

  const openModalAjout = () => {
    setShowModalAjout(true);


  };
  const closeModalUpdate = () => {
    setUpdRest(selectedStore);

    setSelectedStore(null)
    setShowModalUpdate(false);
    setUpdRest([])
  };
  const openModalUpdate = (store) => {
    setSelectedBase(store.Setting)
    setSelectedStore(store)
    setShowModalUpdate(true);

  };
  const closeModalLicence = () => {
    setSelectedStore(null)
    setShowModalLicence(false);
  };
  const openModalLicence = (store) => {
    setSelectedStore(store)
    setShowModalLicence(true);
  };

  const closeModalSupprimer = () => {
    setSelectedStore(null)
    setShowModalSupprimer(false);
  };
  const openModalSupprimer = (store) => {
    setSelectedStore(store)
    setShowModalSupprimer(true);
  };
  const closeModalConfirmationView = () => {
    setSelectedStore(null)
    setShowModalConfirmationView(false);
  };
  const openModalConfirmationView = (store) => {
    setSelectedStore(store)
    setShowModalConfirmationView(true);
  };

  const UpdateRestaurant = async () => {

    if ((updRest.Setting === undefined) && (updRest.Nom === undefined) && (updRest.Login === undefined) && (updRest.idCRM === undefined) && (updRest.Email === undefined) && (updRest.Password === undefined) && (updRest.Tel === undefined)) {
      showNotification('Aucun changement détecté !', 'danger');
      console.log("No changes detected.");
      setUpdRest([]);
      setSelectedStore(null);
    } else {
      try {
        const _id = selectedStore._id;
        const Nom = updRest.Nom !== undefined ? updRest.Nom : selectedStore.Nom;
        const Login = updRest.Login !== undefined ? updRest.Login : selectedStore.Login;
        const Password = updRest.Password !== undefined ? updRest.Password : selectedStore.Password;
        const idCRM = updRest.idCRM !== undefined ? updRest.idCRM : selectedStore.idCRM;
        const Email = updRest.Email !== undefined ? updRest.Email : selectedStore.Email;
        const Tel = updRest.Tel !== undefined ? updRest.Tel : selectedStore.Tel;
        const Setting = updRest.Setting !== undefined ? updRest.Setting : selectedStore.Setting;

        //  console.log(selectedStore);
        const response = await AdminService.UpdateStore(_id, Nom, Login, Password, idCRM, Email, Tel, Setting);
        const tt = {
          _id: _id,
          Nom: Nom,
          Login: Login,
          Password: Password,
          idCRM: idCRM,
          Email: Email,
          Tel: Tel,
          Licence: selectedStore.Licence,
          Status: selectedStore.Status,
          LastCommand: selectedStore.LastCommand,
          Address: selectedStore.Address,
          Setting: Setting
        }
        //   console.log(selectedStore);
        setStoresData(prevData => prevData.map(store => store._id === tt._id ? tt : store));
        showNotification('Restaurant mis à jour avec succès !', 'success');
        setShowModalUpdate(false);
        setUpdRest([]);
      } catch (error) {
        console.error('Error updating restaurant:', error);
        showNotification('Échec de la mise à jour du restaurant. Veuillez réessayer ultérieurement.', 'danger');
        setUpdRest([]);
        setSelectedStore(null);
      }
    }
    setShowModalUpdate(false);
  };





  const AddNewRestaurant = async () => {


    if (newRest.Nom === "") { showNotification('Il faut remplir le champ du nom !', 'danger'); }
    else if (newRest.Login === "") { showNotification('Il faut remplir le champ du Login !', 'danger'); }
    else if (newRest.idCRM === "") { showNotification('Il faut remplir le champ du idCRM !', 'danger'); }
    else if (newRest.Password === "") { showNotification('Il faut remplir le champ du Password !', 'danger'); }
    // else if(newRest.Email===""){showNotification('Il faut remplir le champ du Email !', 'danger');}
    // else if(newRest.Tel===""){showNotification('Il faut remplir le champ du Tel !', 'danger');}
    else {
      try {
        const response = await AdminService.AjoutStores(newRest);

        if (response.msg === "User already exists.") {
      
          showNotification('Un restaurant avec ces informations existe déjà !', 'danger');

        } else {
          const newRestaurantData = response;
          setStoresData(prevStoresData => [...prevStoresData, newRestaurantData.data]);
          showNotification('Restaurant ajouté avec succès !', 'success');
          setShowModalAjout(false);
          closeModalAjout()
        }
        setSelectedStore(null);
      } catch (error) {
        console.error('Error adding new restaurant:', error);
        showNotification("Échec de l'ajout du restaurant. Veuillez réessayer ultérieurement.", 'danger');
      }
    }
  };
  //GET ALL RESTAURANT EXIST WITH ROLE store
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await AdminService.getAllStores();

        setStoresData(data.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);



  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : null);
  };

  const handleLicenceChange = async () => {
    const { Licence, idCRM } = selectedStore; // Destructure selectedStore object

    try {
      let newLicenceStatus;
      if (Licence === "Enable") {
        selectedStore.Licence = "Disable"
        newLicenceStatus = "Disable";
      } else if (Licence === "Disable") {
        selectedStore.Licence = "Enable"
        newLicenceStatus = "Enable";
      }

      await AdminService.UpdateLicence(idCRM, newLicenceStatus);
      const successNotification = 'Licence mise à jour avec succès !';
      showNotification(successNotification, 'success');

    } catch (error) {
      console.error('Error updating license:', error.message); // Log detailed error message
      const failureNotification = 'Failed to update license. Please try again later.';
      showNotification(failureNotification, 'danger'); // Display failure notification
    }

    closeModalLicence();
  };


  useEffect(() => {

    setfilteredStores(storesData)
  }, [storesData]);
  useEffect(() => {
    const filteredStores1 = storesData?.filter(store =>
      store.Nom.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setfilteredStores(filteredStores1)
  }, [searchQuery]);

  useEffect(() => {
    const filteredStores1 = storesData?.filter(store =>
      store.idCRM.toLowerCase().includes(searchQueryCRM.toLowerCase())
    );
    setfilteredStores(filteredStores1)
  }, [searchQueryCRM]);




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


  const handleNavigate = () => {

    navigate('/admin/Dashboard', { state: { _id: selectedStore._id, idCRM: selectedStore.idCRM } });
    setSelectedStore(null)
    setShowModalConfirmationView(false);
  };


  const handleDeleteStore = async () => {
    const { _id } = selectedStore;

    try {

      await AdminService.DeleteUsers(_id);
      const successNotification = 'Store Deleted !';
      showNotification(successNotification, 'success');
      setStoresData(prevStoresData => prevStoresData.filter(item => item._id !== _id));
      setSelectedStore(null);


    } catch (error) {
      console.error('Error updating license:', error.message); // Log detailed error message
      const failureNotification = 'Failed to delete store . Please try again later.';
      showNotification(failureNotification, 'danger'); // Display failure notification
    }

    closeModalSupprimer();
  };





  return (
    <div className="content">
      {!isLoading && <Container>
        <FlexItem>
          <TextField
            label="Trouver par le nom"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "300px" }}
          />
        </FlexItem>
        <FlexItem >
          <TextField
            label="Trouver par l'IDCRM"
            value={searchQueryCRM}
            onChange={(e) => setSearchQueryCRM(e.target.value)}
            style={{ width: "300px" }}
          />
        </FlexItem>
        <FlexItem onClick={openModalAjout} style={{ paddingTop: "30px" }}>
          <GroupAddOutlined style={{ width: "50px", height: "50px", paddingTop: "5px" }} /><h3 style={{ paddingTop: "5px" }}>Ajouter</h3>
        </FlexItem>
      </Container>
      }


      {!isLoading && filteredStores?.map((store, index) => (
        <Accordion
          key={index}
          expanded={expandedPanel === index}
          onChange={handleAccordionChange(index)}
          style={{ backgroundColor: store.Licence === "Disable" ? "rgba(255, 0, 0, 0.3)" : "rgba(0, 255, 0, 0.2)", marginTop: "10px", width: "99%" }}

        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls={`panel${index + 1}-content`}
            id={`panel${index + 1}-header`}
          >
            <h6>{store.Nom}</h6>
            <span style={{ width: "20px", height: "20px", marginLeft: "auto" }} ><strong>Pc</strong></span>
            <div style={{ width: "20px", height: "20px", borderRadius: "50%", backgroundColor: store.Status === "Activer" ? "green" : "red", marginLeft: "5px", marginRight: "5px" }} ></div>
          </AccordionSummary>
          <AccordionDetails style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginRight: "10px" }}>Licence:</span>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: store.Licence === "Enable" ? "green" : "red" }} />
                <span style={{ marginLeft: "5px", color: store.Licence === "Enable" ? "green" : "red" }}>{store.Licence === "Enable" ? "Active" : "Inactive"}</span>
              </div>
            </div>

            <div style={{ marginBottom: "5px" }}>ID CRM: {store.idCRM}</div>
            <div style={{ marginBottom: "5px" }}>Login: {store.Login}</div>
            {store.Email && <div style={{ marginBottom: "5px" }}>Email: {store.Email}</div>}
            <div style={{ marginBottom: "5px" }}>Mot de passe: {store.Password}</div>
            {store.Tel && <div style={{ marginBottom: "5px" }}>Tel: {store.Tel}</div>}
            {((store.Setting === true) || (store.Setting === false)) && (
              <div style={{ marginBottom: "5px" }}>
                Setting: {store.Setting ? "autorisation de changer base" : "pas d'autorisation de changer base"}
              </div>
            )}            <div style={{ marginBottom: "5px" }}>{store.LastCommand && <div>Dernière Commande: {store.LastCommand}</div>}</div>
          </AccordionDetails>
          <AccordionActions>
            <MuiButton style={{ color: "red" }} onClick={() => openModalSupprimer(store)}>Supprimer</MuiButton>
            <MuiButton onClick={() => openModalLicence(store)}>Licence</MuiButton>
            <MuiButton onClick={() => openModalUpdate(store)} >Modifier </MuiButton>
            <MuiButton style={{ color: "green" }} onClick={() => openModalConfirmationView(store)}>View</MuiButton>
          </AccordionActions>
        </Accordion>
      ))}



      {/* New Resataurant Model */}
      <Modal isOpen={showModalAjout} toggle={closeModalAjout}>
        <ModalHeader toggle={closeModalAjout}>Ajouter un nouveau restaurant.</ModalHeader>
        <ModalBody>
          <label><strong>Nom :</strong></label>
          <Input type="text" name="Nom" value={newRest.Nom} onChange={handleInputChange} />
          <label><strong>idCRM :</strong></label>
          <Input type="text" name="idCRM" value={newRest.idCRM} onChange={handleInputChange} />
          <label><strong>Login :</strong></label>
          <Input type="text" name="Login" value={newRest.Login} onChange={handleInputChange} />
          <label><strong>Password  :</strong></label>
          <Input type="text" name="Password" value={newRest.Password} onChange={handleInputChange} />
          <label><strong>Email :</strong></label>
          <Input type="text" name="Email" value={newRest.Email} onChange={handleInputChange} />
          <label><strong>Tel :</strong></label>
          <Input type="text" name="Tel" value={newRest.Tel} onChange={handleInputChange} />




        </ModalBody>
        <ModalFooter>
          <MuiButton color="primary" onClick={AddNewRestaurant}>Ajouter</MuiButton>{' '}
          <MuiButton color="secondary" onClick={closeModalAjout}>Annuler</MuiButton>
        </ModalFooter>
      </Modal>

      {/*  Licence Model */}

      <Modal isOpen={showModalLicence} toggle={closeModalLicence}>
        <ModalHeader toggle={closeModalLicence}>
          {selectedStore && selectedStore?.Licence === "Enable" ?
            `Désactiver la licence pour  ${selectedStore?.Nom}` :
            `Activer la licence pour  ${selectedStore?.Nom}`}
        </ModalHeader>
        <ModalBody>
          {selectedStore && selectedStore.Licence === "Enable" ? (
            <span>
              <strong>  La licence de <span style={{ color: 'green' }}>{selectedStore?.Nom} est activée</span>. Êtes-vous sûr de vouloir la désactiver pour {selectedStore?.Nom} ?
              </strong>  </span>
          ) : (
            <span> <strong>
              La licence de <span style={{ color: 'red' }}>{selectedStore?.Nom} est désactivée</span>. Êtes-vous sûr de vouloir activer la licence pour {selectedStore?.Nom} ?
            </strong>  </span>
          )}
        </ModalBody>
        <ModalFooter>
          <RsButton
            style={{ backgroundColor: selectedStore?.Licence === "Enable" ? "rgb(255, 46, 0)" : "rgb(60, 179, 113)" }}
            onClick={handleLicenceChange}>{selectedStore && selectedStore.Licence === "Enable" ? "Desactiver" : "Activer"}</RsButton>
          <RsButton color="secondary" onClick={closeModalLicence}>Annuler</RsButton>
        </ModalFooter>
      </Modal>



      <Modal isOpen={showModalUpdate} toggle={closeModalUpdate}>
        <ModalHeader toggle={closeModalUpdate}>Modifier {selectedStore?.Nom}</ModalHeader>
        <ModalBody>
          <label>Nom :</label>
          <Input type="text" name="Nom" placeholder={selectedStore?.Nom || ''} value={updRest?.Nom || ''} onChange={handleInputChangeUpdate} />
          <label>idCRM :</label>
          <Input type="text" name="idCRM" placeholder={selectedStore?.idCRM || ''} value={updRest?.idCRM || ''} readOnly />
          <label>Login :</label>
          <Input type="text" name="Login" placeholder={selectedStore?.Login || ''} value={updRest?.Login || ''} onChange={handleInputChangeUpdate} />
          <label>Password :</label>
          <Input type="text" name="Password" placeholder={selectedStore?.Password || ''} value={updRest?.Password || ''} onChange={handleInputChangeUpdate} />
          <label>Email:</label>
          <Input type="text" name="Email" placeholder={selectedStore?.Email || ''} value={updRest?.Email || ''} onChange={handleInputChangeUpdate} />
          <label>Tel:</label>
          <Input type="text" name="Tel" placeholder={selectedStore?.Tel || ''} value={updRest?.Tel || ''} onChange={handleInputChangeUpdate} />
          <FormControl style={{ marginTop: "7px" }}>
            <FormLabel id="demo-radio-buttons-group-label"><strong>Setting :</strong>Si le Setting est activé, cela peut modifier la base de données</FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="Setting"
              value={selectedBase} // Ensure value is controlled
              onChange={handleInputChangeUpdate}
            >
              <FormControlLabel
                value="true"
                control={<Radio />}
                label="Active"
              />
              <FormControlLabel
                value="false"
                control={<Radio />}
                label="Desactiver"
              />
            </RadioGroup>
          </FormControl>

        </ModalBody>
        <ModalFooter>
          <MuiButton color="primary" onClick={UpdateRestaurant}>Update</MuiButton>
          <MuiButton color="secondary" onClick={closeModalUpdate}>Cancel</MuiButton>
        </ModalFooter>
      </Modal>

      {/* confirmation de View */}
      <Modal isOpen={showModalConfirmationView} toggle={closeModalConfirmationView}>
        <ModalHeader toggle={closeModalConfirmationView}>Voir les statistiques de  {selectedStore?.Nom}.</ModalHeader>
        <ModalBody>
          Voulez-vous continuer ?
        </ModalBody>
        <ModalFooter>
          <MuiButton color="primary" onClick={handleNavigate}>Continuer </MuiButton>
          <MuiButton color="secondary" onClick={closeModalConfirmationView}>Annuler</MuiButton>
        </ModalFooter>
      </Modal>


      {/*  Licence Model */}

      <Modal isOpen={showModalSupprimer} toggle={closeModalSupprimer}>
        <ModalHeader toggle={closeModalSupprimer}>
          Supprimer  {selectedStore?.Nom}
        </ModalHeader>
        <ModalBody>
          {selectedStore && <div>Es-tu sûr de vouloir supprimer {selectedStore?.Nom} </div>}
        </ModalBody>
        <ModalFooter>
          <RsButton
            style={{ backgroundColor: selectedStore?.Licence === "Enable" ? "rgb(255, 46, 0)" : "rgb(60, 179, 113)" }}
            onClick={handleDeleteStore}>{selectedStore && <div>Supprimer</div>}</RsButton>
          <RsButton color="secondary" onClick={closeModalSupprimer}>Annuler</RsButton>
        </ModalFooter>
      </Modal>






      <NotificationAlert ref={notificationAlert} />
      {isLoading && <div style={{ display: "flex", justifyContent: "center", marginTop: "250px" }}>
        <ReactLoading type={'spin'} color={'#000'} height={50} width={50} />
      </div>}
    </div>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: center;
    gap: 30px; /* Adjust as needed */
   
  }
`;

const FlexItem = styled.div`
  display: flex;
  justify-content: center;
  padding-top:7px
  `;
export default ScreenHome;
