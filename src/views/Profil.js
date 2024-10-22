// Dashboard.js
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import UserService from "Service/UserService";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Button as RsButton, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import ReactLoading from 'react-loading'; // Import ReactLoading component

function Profil() {
  const [idcrm, setidcrm] = useState("");
  const [showmodelModifer, setmodelModifer] = useState(false);
  const [data, setData] = useState("");
  const [selectedBase, setSelectedBase] = useState(""); // State to store selected base
  const [loading, setLoading] = useState(false); // State variable to manage loading state
  const [countdown, setCountdown] = useState(60); // Countdown timer

  useEffect(() => {
    const fetchData = async () => {
      try {
        setidcrm(Cookies.get("idCRM"));
        const data = await UserService.GetBaseDeDonne(Cookies.get("idCRM"));
        setData(data.BaseName);
        setSelectedBase(data.BaseName)
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Decrease countdown every second until it reaches 0
    const countdownInterval = setInterval(() => {
      if (countdown > 0 && loading) {
        setCountdown(prevCountdown => prevCountdown - 1);
      }
    }, 1000);

    // Clear interval when component unmounts or loading is false
    return () => clearInterval(countdownInterval);
  }, [countdown, loading]);

  const openModalModifierBase = () => {
    setmodelModifer(true);
  };

  const closeModalModifierBase = () => {
    setmodelModifer(false);
  };

  const UpdateUpdateBase = async () => {
    try {
      setLoading(true); // Set loading to true when update begins
      console.log("Selected Base:", selectedBase);
      if (selectedBase !== data) {
        const data = await UserService.UpdateBaseDeDonne(idcrm, selectedBase);
        closeModalModifierBase();
        setData(selectedBase);
        // Simulate a 30-second loading period
      

        setTimeout(() => {
          setLoading(false); // Set loading to false after 30 seconds
          setCountdown(60); // Reset countdown
        }, 30000);
      }
    } catch (error) {
      setLoading(false); // Set loading to false in case of error
      closeModalModifierBase();
      console.error('Error updating BaseName for user:', error);
    }
  };

  return (
    <div className="content">
     

      {data && !loading && (
        <h5>
          votre base de données est <strong>{data}</strong>. Si vous pouvez la modifier, cliquez sur{" "}
          <RsButton onClick={openModalModifierBase}>changer</RsButton>.
        </h5>
      )}

      {/* Model modifier */}
      <Modal isOpen={showmodelModifer} toggle={closeModalModifierBase}>
        <ModalHeader toggle={closeModalModifierBase}>
          changer Base de donner
        </ModalHeader>
        <ModalBody>
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">Les Bases existent</FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              value={selectedBase} // Set value to selectedBase
              onChange={(event) => setSelectedBase(event.target.value)} // Update selectedBase on change
            >
              <FormControlLabel value="BaseModeEcole" control={<Radio />} label="BaseModeEcole" />
              <FormControlLabel value="DefaultBase" control={<Radio />} label="DefaultBase" />
              <FormControlLabel value="BaseVierge" control={<Radio />} label="BaseVierge" />
            </RadioGroup>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <RsButton onClick={UpdateUpdateBase}>Update Base</RsButton>
          <RsButton color="secondary" onClick={closeModalModifierBase}>Annuler</RsButton>
        </ModalFooter>
      </Modal>


      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' ,paddingTop:"50px",fontSize:"1.1rem" }}>
          <ReactLoading type={'spin'} color={'#29335c'} height={30} width={30} />
          <div> Traitement en cours ({countdown}s restantes) </div>
        </div>
      )}
    </div>
  );
}

export default Profil;