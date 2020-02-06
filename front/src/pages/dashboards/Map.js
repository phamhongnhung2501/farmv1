import React from "react";
import { Card, CardBody, CardHeader, CardTitle, Row, Col } from "reactstrap";
import { Map as LeafletMap, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import moment from 'moment';
class Maps extends React.Component {
    render() {                
        return (
            <LeafletMap
                center={[this.props.lat, this.props.long]}
                zoom={14}
                maxZoom={18}
                attributionControl={true}
                zoomControl={true}
                doubleClickZoom={true}
                scrollWheelZoom={true}
                dragging={true}
                animate={true}
                easeLinearity={0.35}
                style={{width: '100%',height: '200px'}}

            >   
                <TileLayer
                    url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                />
                <Marker position={[this.props.lat, this.props.long]} >
                <Tooltip>
                    <h6 className="text-center">{this.props.data.sub_id}</h6>

                    <Row>
                        <Col>
                            FullName: {this.props.data.manager.full_name}
                        </Col>
                        <Col>
                            Phone Number: {this.props.data.manager.phone_number}
                        </Col>
                        <Col>
                            Seed: {
                            
                            this.props.data.seed_name === "tomato" ? "Cà chua" : ""||
                            this.props.data.seed_name === "cucumber" ? "Dưa chuột" : ""||
                            this.props.data.seed_name === "pakchoi" ? "Cải ngọt" : ""||
                            this.props.data.seed_name === "brassica" ? "Cải chíp" : ""||
                            this.props.data.seed_name === "cabbage" ? "Bắp cải" : ""
                            }
                        </Col>
                        <Col>
                            Started Plant: {moment(this.props.data.started_plant).format('DD/MM/YYYY')}
                        </Col>
                    </Row>
                </Tooltip>
                <Popup>
                    Popup for any custom information.
                </Popup>
                </Marker>
            </LeafletMap>
        );
    }
}

export default Maps;