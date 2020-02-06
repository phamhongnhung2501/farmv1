import React from "react";
import { Card, CardBody, CardHeader, CardTitle, Row, Col } from "reactstrap";
import { Map as LeafletMap, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import moment from 'moment';
const api = require("./api/api");

class Maps extends React.Component {
    handleSelectProject(sub_id) {
        api.getInfoProject(sub_id, (err, result) => {
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message);
            } else {
                localStorage.setItem("project", JSON.stringify(result));
                window.location.replace("/dashboard");
            }
        });
    }
    render() {                
        return (
            <Card className="m-3">
            <CardHeader>
              <CardTitle tag="h5">Station</CardTitle>
              <h6 className="card-subtitle text-muted">
                Identify locations on a map.
              </h6>
            </CardHeader>
            <CardBody>
                <Row >
                    <LeafletMap
                        center={[this.props.lat, this.props.long]}
                        zoom={10}
                        maxZoom={18}
                        attributionControl={true}
                        zoomControl={true}
                        doubleClickZoom={true}
                        scrollWheelZoom={true}
                        dragging={true}
                        animate={true}
                        easeLinearity={0.35}
                        style={{width: '100%',height: '400px'}}

                    >   
                        <TileLayer
                            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                        />
                        {this.props.data.map((data, index) => {
                            return (
                                <Marker position={[data.latitude, data.longitude]} onClick={this.handleSelectProject.bind(this,data.sub_id)}>
                                <Tooltip>
                                    <h6 className="text-center">{data.sub_id}</h6>
                                    <Row>
                                        <Col>
                                            FullName: {data.manager.full_name}
                                        </Col>
                                        <Col>
                                            Phone Number: {data.manager.phone_number}
                                        </Col>
                                        <Col>
                                            Seed: {
                                           
                                           data.seed_name === "tomato" ? "Cà chua" : ""||
                                           data.seed_name === "cucumber" ? "Dưa chuột" : ""||
                                           data.seed_name === "pakchoi" ? "Cải ngọt" : ""||
                                           data.seed_name === "brassica" ? "Cải chíp" : ""||
                                           data.seed_name === "cabbage" ? "Bắp cải" : ""
                                            }
                                        </Col>
                                        <Col>
                                            Started Plant: {moment(data.started_plant).format('DD/MM/YYYY')}
                                        </Col>
                                    </Row>
                                </Tooltip>
                                </Marker>
                            );
                        })}
                        
                    </LeafletMap>
                </Row>
      
            </CardBody>
          </Card>
        );
    }
}

export default Maps;