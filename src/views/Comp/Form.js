// Form.js
import React, { useState } from "react";
import { Row, Col, Card, CardBody, CardFooter, CardTitle } from "reactstrap";

function Form({ key1,devise,value,StartDate,EndDate }) {
 
  const [val, setval] = useState(value);
  const formatValue = (value, devise) => {
    if (devise === "DT") {
      return parseFloat(value).toFixed(3); // Formats to three decimal places
    } else {
      return value; // Return as it is
    }
  };
  const formatDate = (date) => {
    const year = date.substring(0, 4);
    const month = date.substring(4, 6);
    const day = date.substring(6, 8);
    return `${day}/${month}/${year}`;
  };

  const color = (key1) => {
  
    if (key1 === "TICKET_RESTO") {
      return "CBB0B0"; // Formats to three decimal places
    } else if (key1 === "CARTE_BANCAIRE"){
      return "BDCB8C"; // Return as it is
    }
    else if (key1 === "ESPECES"){
      return "D2D2D2"; // Return as it is
    }
    else if (key1 === "SurPlace"){
      return "C1DE64"; // Return as it is
    }
    else if (key1 === "SODEXO"){
      return "89AFA6"; // Return as it is
    }
    else if (key1 === "Total_HT"){
      return "f1c40f"; // Return as it is
    }
    else if (key1 === "TVA"){
      return "3D9A62"; // Return as it is
    }
    else if (key1 === "Total_TTC"){
      return "e74c3c"; // Return as it is
    }
    else if (key1 === "A_Emporter"){
      return "CBB0B0"; // Return as it is
    }
    else return "BDCB8C"
  };
  const replaceUnderscores = (str) => {
    return str.replace(/_/g, " ");
  };

  const formattedValue = formatValue(val, devise);
  const colorChoisi = color(key1);
  const chineChoisi = replaceUnderscores(key1);

  return (
    <Row>
      <Col >
        <Card className="card-stats" style={{ backgroundColor: `#${colorChoisi}` }}>
          <CardBody >
            <Row>
              <Col md="4" xs="5">
                <div className="icon-big text-center icon-warning" style={{ color: "RED" }}>
                <i className="pi pi-check" style={{ color: 'RED' }}></i>
                </div>
              </Col>
              <Col md="8" xs="7">
                <div className="numbers">
                  <p className="card-category" style={{ color: 'BLACK' }}><strong>{chineChoisi} </strong></p>
                  <CardTitle tag="p">{formattedValue} {devise}</CardTitle>
                  <p />
                </div>
              </Col>
            </Row>
          </CardBody>
          <CardFooter>
            <hr />
            <div className="stats">
              <i className="fas fa-sync-alt" style={{ color: 'BLACK' }}/><strong style={{ color: 'BLACK' }}>{formatDate(StartDate)}-{formatDate(EndDate)}</strong>
            </div>
          </CardFooter>
        </Card>
      </Col>
    </Row>
  );
}

export default Form;
