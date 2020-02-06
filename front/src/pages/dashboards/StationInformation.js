import React from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";
import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    CardText,
    Button,
    Row,
    Col,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
    CustomInput
} from "reactstrap";
import { Tabs, Tab } from "react-bootstrap";
import TreeIcon from "../../assets/img/photos/tree_icon.png";
import DateIcon from "../../assets/img/photos/date.png";
import GreenHouse from "../../assets/img/photos/greenhouse.png";
import Clock from "../../assets/img/photos/clock.png";
import UserIcon from "../../assets/img/photos/user.png";
import Temperature from "../../assets/img/photos/temperature.png";
import Light from "../../assets/img/photos/light.png";
import SM from "../../assets/img/photos/sm.png";
import PH from "../../assets/img/photos/p.png";
import Hum from "../../assets/img/photos/h.png";
import { CustomImg } from "../../components/CustomTag";
import moment from 'moment';
import "./Db.css";
import { Briefcase, Home, MapPin, Bell, User } from "react-feather";
import Map from "./Map";
class StationInformation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: "1",
            value: null,
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab,
            });
        }
    }

    render() {
        const { data } = this.props;   
        console.log(data.stage.name);
             
        return (
            <React.Fragment>
                <Tabs defaultActiveKey='info'>
                    <Tab eventKey='info' title='Thông tin vườn ươm'>
                        <Card className='flex-fill w-100' style={{ height: 607, width: "100%" }}>
                            <CardBody className='my-0'>
                                <Col className='mb-3 p-0'>
                                    <Map lat="20.905832" long="105.708198" data={data}/>
                                </Col>
                                <h3 className='text-center'>{data.name}</h3>
                                <ul className='list-unstyled mb-0'>
                                    <li className='mb-3 h4'>
                                        <CustomImg  
                                            src={Clock}
                                            width={50}
                                            height={50}
                                            className="mr-2"
                                        />
                                        Giai đoạn:{" "}
                                        <Link to='#'>
                                            {   
                                                data.stage.name === "germination stage" ? "Gieo hạt" : ""||
                                            
                                                data.stage.name === "development 1 stage" ? "Ra hoa" : ""||
                                            
                                                data.stage.name === "development 2 stage" ? "Phát triển" : ""||
                                            
                                                data.stage.name === "harvest stage" ? "Thu hoạch" : ""  
                                            }
                                        </Link>
                                    </li>       
                                    <li className='mb-3 h4'>
                                        <CustomImg  
                                            src={GreenHouse}
                                            width={50}
                                            height={50}
                                            className="mr-2"
                                        /> Gateway:{" "}
                                        <Link to='#'>{data.sub_id}</Link>
                                    </li>
                                    <li className='mb-3 h4'>
                                        <CustomImg  
                                            src={TreeIcon}
                                            width={50}
                                            height={50}
                                            className="mr-2"
                                        />
                                         Hạt giống:{" "}
                                        <Link to='#'>
                                            {
                                            data.seed_name === "tomato" ? "Cà chua" : ""||
                                            data.seed_name === "cucumber" ? "Dưa chuột" : ""||
                                            data.seed_name === "pakchoi" ? "Cải ngọt" : ""||
                                            data.seed_name === "brassica" ? "Cải chíp" : ""||
                                            data.seed_name === "cabbage" ? "Bắp cải" : ""
                                            }
                                        </Link>
                                    </li>
                                    <li className='mb-3 h4'>
                                        <CustomImg  
                                            src={DateIcon}
                                            width={50}
                                            height={50}
                                            className="mr-2"
                                        />
                                        Ngày gieo hạt:{" "}
                                        <Link to='#'>
                                            { moment(data.started_plant).format('DD-MM-YYYY')}
                                        </Link>
                                    </li>
                                    <li className='mb-3 h4'>
                                        <CustomImg  
                                            src={UserIcon}
                                            width={50}
                                            height={50}
                                            className="mr-2"
                                        />
                                        Người quản lí: <Link to='#'>{data.manager.full_name}</Link>
                                    </li>        
                                </ul>
                            </CardBody>
                        </Card>
                    </Tab>
                    <Tab eventKey='map' title='Trạng thái cây'>
                        <Card className='flex-fill w-100' style={{ height:  607, width: "100%" }}>
                        <CardBody className='my-0'>
                                <ul className='list-unstyled mb-0'>
                                        <h3 className="text-center h3 text-primary mb-4">
                                            {   
                                                data.stage.name === "germination stage" ? "Gieo hạt" : ""||
                                            
                                                data.stage.name === "development 1 stage" ? "Ra hoa" : ""||
                                            
                                                data.stage.name === "development 2 stage" ? "Phát triển" : ""||
                                            
                                                data.stage.name === "harvest stage" ? "Thu hoạch" : ""  
                                            }
                                        </h3>  
                                    <li className='mb-3 h4'>
                                        <CustomImg  
                                            src={Temperature}
                                            width={50}
                                            height={50}
                                            className="mr-2"
                                        />
                                        Nhiệt độ: <Link to='#'>{data.stage.min_temp}</Link>{" "}
                                        {" < T < "} <Link to='#'>{data.stage.max_temp}</Link>
                                    </li>

                                    <li className='mb-3 h4'>
                                        <CustomImg  
                                            src={Light}
                                            width={50}
                                            height={50}
                                            className="mr-2"
                                        />
                                        Ánh sáng: <Link to='#'>{data.stage.min_light}</Link>
                                        {" < L < "} <Link to='#'>{data.stage.max_light}</Link>
                                    </li>
                                    <li className='mb-3 h4'>
                                        <CustomImg  
                                            src={PH}
                                            width={50}
                                            height={50}
                                            className="mr-2"
                                        />
                                        PH: <Link to='#'>{data.stage.min_PH}</Link> {" < PH < "}{" "}
                                        <Link to='#'>{data.stage.max_PH}</Link>
                                    </li>
                                    <li className='mb-3 h4'>
                                        <CustomImg  
                                            src={SM}
                                            width={50}
                                            height={50}
                                            className="mr-2"
                                        />
                                        Độ ẩm đất:{" "}
                                        <Link to='#'>{data.stage.min_soil_moisture}</Link>{" "}
                                        {" < SM < "}{" "}
                                        <Link to='#'>{data.stage.max_soil_moisture}</Link>
                                    </li>
                                    <li className='mb-3 h4'>
                                        <CustomImg  
                                            src={Hum}
                                            width={50}
                                            height={50}
                                            className="mr-2"
                                        />
                                        Độ ẩm không khí: <Link to='#'>
                                            {data.stage.min_hum}
                                        </Link>{" "}
                                        {" < H < "} <Link to='#'>{data.stage.max_hum}</Link>
                                    </li>
                                </ul>
                            </CardBody>
                        </Card>
                    </Tab>
                </Tabs>
            </React.Fragment>
        );
    }
}

export default StationInformation;
