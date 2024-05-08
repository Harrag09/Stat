import React, { useState, useEffect } from "react";
import NotificationAlert from "react-notification-alert";
import { Card, CardBody, CardTitle, CardText } from "reactstrap";

function Credit() {
  
  const notificationAlert = React.useRef(null);

  // Mock data of people
  const mockPeopleData = [
    { id: 1, name: "John Doe", number: "123-456-7890", credit: 100 },
    { id: 2, name: "Jane Smith", number: "456-789-0123", credit: 200 },
    { id: 3, name: "James Johnson", number: "789-012-3456", credit: 300 }
  ];
  const [people, setPeople] = useState(mockPeopleData);
 

  
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
    <div className="content">
      
      <h2>List of People</h2>
      {people.map((person) => (
        <Card key={person.id}>
          <CardBody>
            <CardTitle>Name: {person.name}</CardTitle>
            <CardText>
              Number: {person.number}
              <br />
              Credit: {person.credit}
            </CardText>
          </CardBody>
        </Card>
      ))}
       <NotificationAlert ref={notificationAlert} />
    </div>
  );
}

export default Credit;
