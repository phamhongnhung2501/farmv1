import React from "react";
import { Container, Row, Col, Table } from "reactstrap";
import socketIOClient from "socket.io-client";
import Chart from "./Chart";
import Tables from "./Tables";
import Statistics from "./Statistics";
import StationInformation from "./StationInformation";
import moment from "moment";
import Notification from "../../components/Notification";
import ReactLoading from "react-loading";
import "./Tables.css";
const config_socket = require("../../config/config").config_socket;
const utils = require("../../utils/utils");
const api = require("./api/api");
class Crypto extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            value_sensor: null,
            data_tables: [],
            data_charts: [],
            dataFault: {
                Fault: "00000000",
            },
            status: true,
            info: {
            },
            isLoaded: false,
            isLoaderAPI_EvaluationList: false,
            type: "%",
            response: false,
            socket: true,
            from_date: "",
            to_date: "",
            endpoint: config_socket.ip,
        };
        this.handleChangeType = this.handleChangeType.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleChangeSocket = this.handleChangeSocket.bind(this);
    }
    handleChangeType(type) {
        this.setState({ type: type });
    }
    handleSearch(from, to) {
        this.setState({ from_date: from, to_date: to });     
        const that = this;
        api.getDataReport( moment(from).format('L'), moment(to).format('L'), (err, result) => {
            if (err) {
                Notification(
                    "error",
                    "Error",
                    err.data === undefined ? err : err.data._error_message,
                );
            } else {
                let element = [];
                let data = [...result];
                
                data.map((values, index) => {
                    let value = { ...values };
                    value.time = moment(value.time).format("DD/MM/YYYY h:mm:ss");
                    element.push(value);
                });
                if (data.length !== 0)
                    that.setState({
                        data_tables: element,
                        data: result[0],
                        data_charts: result,
                        isLoaderAPI: true,
                        dataFault: result[0],
                    });
                else{
                    Notification(
                        "error",
                        "Error",
                        'Không có dữ liệu'
                    );
                    that.setState({
                        data_tables: element,
                        data: [],
                        data_charts: result,
                    });
                }
            }
        });
    }
    handleChangeSocket(socket) {  
        if (socket === true) {
            this.setState({ socket: true });
        } else {
            this.setState({ socket: false });
        }
    }
    UNSAFE_componentWillMount() {
        const that = this;
        api.getData((err, result) => {
            if (err) {
                Notification(
                    "error",
                    "Error",
                    err.data === undefined ? err : err.data._error_message,
                );
            } else {
                    let element = [];
                    let data = [...result];
                    data.map((values, index) => {
                        let value = { ...values };
                        value.time = moment(value.time).format("DD/MM/YYYY h:mm:ss");
                        element.push(value);
                    });
                    if (data.length !== 0)
                        that.setState({
                            data_tables: element,
                            data: result[0],
                            data_charts: result,
                            isLoaderAPI: true,
                            dataFault: result[0],
                        });
                }
        });
    }
    componentWillMount(){

    }
    componentDidMount() {
        const that = this;
        const { endpoint } = this.state;
        const sub_id = utils.getStationInfo().sub_id;
        const socket = socketIOClient(endpoint, {
            query: {
                token: utils.getAuthToken(),
                sub_id: sub_id,
            },
        });
            socket.on("farm_" + sub_id, function(value) {                
                    if(that.state.socket === true){
                    that.setState({ 
                        // data: value, 
                        // data_charts: [...that.state.data_charts, value],
                        // time: value.time
                    });
                    var length = that.state.data_charts.length;
                    if (length >= 11) {
                        that.state.data_charts.shift();
                    }
                    var value_table = Object.assign({}, value);
                    var date = moment(value_table.time).format("DD/MM/YYYY h:mm:ss a");
                    value_table["time"] = date;
                    that.setState({ data_tables: [...that.state.data_tables, value_table] });
                    var lengtht = that.state.data_tables.length;
                    if (lengtht >= 11) {
                        that.state.data_tables.shift();
                    }
                }
            });
            socket.on("error", function(err) {});
            this.setState({ info: utils.getStationInfo(), isLoaded: true });
            api.getData((err, result) => {
                if (err) {
                    Notification(
                        "error",
                        "Error",
                        err.data === undefined ? err : err.data._error_message,
                    );
                } else {
                    if(result.length > 0){
                        that.setState({
                            time: result[0].time,
                        });
                    }
                
                }
            });
            
    }

    render() {
        const {time} = this.state;
        return !this.state.isLoaded ? (
            <ReactLoading className="m-auto" type='bars' color='black' />
        ) : (
            <Container fluid className='p-0'>
                 <h4 className='text-center font-weight-bold'>Thời gian cập nhập:  {moment(time).format("DD/MM/YYYY h:mm:ss a")} </h4>
                <div id='map' className="mb-2" style={{height:"100px"}}>
                    <a
                        className='weatherwidget-io'
                        href='https://forecast7.com/en/21d00105d82/hanoi/'
                        data-label_1='HÀ NỘI'
                        data-icons='Climacons Animated'
                        data-theme='original'>
                        HÀ NỘI
                    </a>
                    
                    {(
                        function(d, s, id) {
                        var js,
                            fjs = d.getElementsByTagName(s)[0];
                        if (!d.getElementById(id)) {
                            js = d.createElement(s);
                            js.id = id;
                            js.src = "https://weatherwidget.io/js/widget.min.js";
                            fjs.parentNode.insertBefore(js, fjs);
                        }
                    })(document, "script", "weatherwidget-io-js")}
                    
        
                </div>
               
                <Row>
                    <Col xs="12" sm="12" lg='8'  md="12" xl='8' className='d-flex '>
                        <Statistics
                            info={this.state.info}
                            data={this.state.data}
                            time={this.state.time}
                        />
                    </Col>
                    <Col xs="12" sm="12" md="12" lg='4' xl='4'>
                        <StationInformation data={this.state.info} />
                    </Col>
                </Row>
                <Row>
                    <Col lg='6' className='d-flex'>
                        <Tables
                            data={this.state.data_tables}
                            handleChangeType={this.handleChangeType}
                        />
                    </Col>
                    <Col lg='6' className='d-flex'>
                        <Chart
                            data={this.state.data_charts}
                            type={this.state.type}
                            handleSearch={this.handleSearch}
                            handleChangeSocket={this.handleChangeSocket}
                        />
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Crypto;
