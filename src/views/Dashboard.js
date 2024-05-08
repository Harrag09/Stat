// Dashboard.js
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button as RsButton, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import MyDatePicker from "./Comp/MyDatePicker";
import "./Comp/dt.css";
import { Checkbox } from "@mui/material";
import NotificationAlert from "react-notification-alert";
import UserService from "Service/UserService";
import Form from "./Comp/Form";
function Dashboard() {

  const location = useLocation();
  const { _id, idCRM } = location.state || {};

  const notificationAlert = React.useRef(null)
  // State to hold selected date range
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [DateRange, setdDateRange] = useState(null);
  const [StartDate, setdStartDate] = useState("");
  const [EndDate, setdEndDate] = useState("");
  const [tempReal, setTempReal] = useState(true);
  const [showModalDate, setShowModalDate] = useState(false);
  const [storesData, setStoresData] = useState({});




  const GetStatFromTableReel = async (a, b, c) => {
    try {
      setStoresData({})
      const data = await UserService.GetStatFromTableReel(a, b, c);
      showNotification(data.msg, data.data !== null ? 'success' : 'danger');

      setStoresData(data.data)
    } catch (error) {
      console.error(error);
    }
  };
  const GetStatFromTableStats = async (a, b, c) => {
    try {
      setStoresData({})
      const data = await UserService.GetStatFromTableStats(a, b, c);
      showNotification(data.msg, data.data !== null ? 'success' : 'danger');
      setStoresData(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (DateRange === null) {
      const dateAjourdhui = new Date();
      const defaultStartDate = `${dateAjourdhui?.getFullYear()}${String(dateAjourdhui.getMonth() + 1).padStart(2, '0')}${String(dateAjourdhui?.getDate()).padStart(2, '0')}`;
      setdStartDate(defaultStartDate);
      setdEndDate(defaultStartDate);
      if (tempReal) { GetStatFromTableReel(idCRM, defaultStartDate, defaultStartDate); }
      else { GetStatFromTableStats(idCRM, StartDate, EndDate); }
    }
    else {
      const st = `${DateRange.startDate?.getFullYear()}${String(DateRange.startDate.getMonth() + 1).padStart(2, '0')}${String(DateRange.startDate?.getDate()).padStart(2, '0')}`;
      const end = `${DateRange.endDate?.getFullYear()}${String(DateRange.endDate.getMonth() + 1).padStart(2, '0')}${String(DateRange.endDate?.getDate()).padStart(2, '0')}`;
      console.log(st, end)
      setdStartDate(st);
      setdEndDate(end);
      if (tempReal) { GetStatFromTableReel(idCRM, st, end); }
      else { GetStatFromTableStats(idCRM, st, end); }
    }

  }, [DateRange, tempReal]);




  const handleDateSelection = (dateRange) => {
    setSelectedDateRange(dateRange);
  };

  const openModalDate = () => {
    setShowModalDate(true);
  };
  const closeModalDate = () => {
    setShowModalDate(false);
  };
  const EnvoyerNewDate = () => {
    setdDateRange(selectedDateRange);
    closeModalDate();
  };
  const handleCheckboxChange = (event) => {
    if (event.target.checked) { showNotification("Les statistiques de caisse seront obtenues pour celles qui ne sont pas encore clôturées.", 'success'); }
    else { showNotification(" Les statistiques de caisse seront obtenues pour celles qui ont clôturées.", 'success'); }
    setTempReal(event.target.checked);
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


  return (
    <div className="content" >
      {/* Display selected date range or default to current date */}
      <div style={{ textAlign: "center" }}>
        <RsButton onClick={openModalDate} style={{ border: "inset", fontSize: "12px" }}>
          {DateRange ? DateRange.startDate.toLocaleDateString() : new Date().toLocaleDateString()} - {DateRange ? DateRange.endDate.toLocaleDateString() : new Date().toLocaleDateString()}
        </RsButton>

        <Checkbox checked={tempReal}
          onChange={handleCheckboxChange} style={{ color: '#212529', marginRight: '4px' }} /> <label style={{ marginLeft: '-15px', color: '#212529', fontWeight: 'bold' }}>Temps réel</label>
        <div>
          <span style={{ fontSize: "0.6rem" }}>Si la case 'Temps réel' est cochée, vous récupérez les données des statistiques qui ne sont pas clôturées. Sinon, vous récupérez les données des statistiques clôturées.</span>
        </div>
      </div>
      {/* storesData &&storesData.length!=0 */}
      {storesData &&
        <div>
          {/* Vue globale C.A */}
          <div style={{ marginTop: "50px" }}>
            <h5> Vue globale C.A</h5> <hr></hr>
            <div className="content2" style={{ marginTop: "10px" }}>
              {storesData.ChiffreAffaire && Object.keys(storesData.ChiffreAffaire).map((key, index) => (
                <div key={index}>
                  <Form key1={key} devise={storesData.devise} value={storesData.ChiffreAffaire[key]} StartDate={StartDate} EndDate={EndDate} />
                </div>
              ))}
            </div>
          </div>
          {/* Les Modes de paiement */}
          <div style={{ marginTop: "40px" }}>
            <h5 style={{ marginTop: "10px" }}> Les Modes de paiement </h5> <hr></hr>
            <div className="content2" style={{ marginTop: "10px" }}>
              {storesData.modePaiement && Object.keys(storesData.modePaiement).map((key, index) => (

                <div key={index}>
                  {storesData.modePaiement[key] != 0 &&
                    <Form key1={key} devise={storesData.devise} value={storesData.modePaiement[key]} StartDate={StartDate} EndDate={EndDate} />}
                </div>

              ))}
            </div>
          </div>
          {/* Les Modes de consommation */}
          <div style={{ marginTop: "40px" }}>
            <h5 style={{ marginTop: "10px" }}> Les Modes de paiement </h5> <hr></hr>
            <div className="content2" style={{ marginTop: "10px" }}>
              {storesData.modeConsommation && Object.keys(storesData.modeConsommation).map((key, index) => (
                <div key={index}>
                  {storesData.modeConsommation[key] != 0 &&
                    <Form key1={key} devise={storesData.devise} value={storesData.modeConsommation[key]} StartDate={StartDate} EndDate={EndDate} />}
                </div>
              ))}
            </div>
          </div>

          {/* tva de ddes ventes */}
          <div style={{ marginTop: "40px" }}>
            <h5 style={{ marginTop: "10px" }}>TVA  par Taux </h5> <hr></hr>
            <div className="content2" style={{ marginTop: "10px" }}>
              {storesData.ChiffreAffaireDetailler && Object.keys(storesData.ChiffreAffaireDetailler).map((outerKey, outerIndex) => (
                <div key={outerIndex}>
                  <Form key1={outerKey} devise={storesData.devise} value={storesData.ChiffreAffaireDetailler[outerKey].TVA} value1={storesData.devise} StartDate={StartDate} EndDate={EndDate} />

                </div>
              ))}


            </div>
          </div>

        </div>

      }




      {/* Modal for selecting date */}
      <Modal isOpen={showModalDate} toggle={closeModalDate}>
        <ModalHeader toggle={closeModalDate}>Choisir une date</ModalHeader>
        <ModalBody>
          <MyDatePicker onDateSelection={handleDateSelection} />
        </ModalBody>
        <ModalFooter>
          <RsButton color="primary" onClick={EnvoyerNewDate}>Changer le  Date </RsButton>
          <RsButton color="secondary" onClick={closeModalDate}>Cancel</RsButton>
        </ModalFooter>
      </Modal>


      <NotificationAlert ref={notificationAlert} />
    </div >


  );
}

export default Dashboard;



//Get ALL ChiffreAffaireDetailler DETAIILER
// {storesData.ChiffreAffaireDetailler && Object.keys(storesData.ChiffreAffaireDetailler).map((outerKey, outerIndex) => (
//   <div key={outerIndex}>
//     {Object.keys(storesData.ChiffreAffaireDetailler[outerKey]).map((innerKey, innerIndex) => (
//       outerKey === "Taux" ? (
//         <div key={innerIndex}>
//           <h5 style={{ marginTop: "10px" }}>{storesData.ChiffreAffaireDetailler[outerKey][innerKey]}</h5>
//           <hr />
//         </div>
//       ) : (
//         <div key={innerIndex}>
//           <Form value2={innerKey} value3={storesData.ChiffreAffaireDetailler[outerKey][innerKey]} /> 
//         </div>
//       )
//     ))}
//   </div>
// ))}