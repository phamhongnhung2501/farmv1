import React from "react";
import { 
    Button,
    Card, CardBody,
    Col,
    Input, Label, Row, 
} from "reactstrap";
import {
    Tabs, Tab
} from "react-bootstrap";
import Notification from "../../components/Notification";
import ReactLoading from "react-loading";

const api = require("./api/api");
const utils = require("../../utils/utils");

class Config extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            dataConfig: {
                stage_1: {},
                stage_2: {},
                stage_3: {},
                // stage_4: {},
            },
            showModal: {
                create_project: false,
                config_digital: false,
            },
            temp: {
                name: "",
                sub_id: "",
                seed: {
                    _id: "",
                    seed: "tomato"
                },
                stage_1: {},
                stage_2: {},
                stage_3: {},
                // stage_4: {},
                started_plant: Date.now(),
            },
            listGateWay: [],
            listSeed: [],
            submitted: false,
            isLoaderAPI: false,
            keyWord: null,
            type: "list",
        };
        this.handleCloseConfig = this.handleCloseConfig.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSaveChange = this.handleSaveChange.bind(this);
    }


    handleSaveChange(event) {
        api.modifyStation(this.state.dataConfig.sub_id, this.state.dataConfig, (err, result) => {
            if (err) {
                Notification(
                    "error",
                    "Error",
                    err.data === undefined ? err : err.status + " " + err.data._error_message,
                );
            } else {
                let tmp = {}
                tmp['_id'] = result._id;
                tmp['seed'] = result.seed;                
                let temp = Object.assign({}, this.state.temp);  
                temp.seed = tmp
                this.setState({temp: temp})      
                          
                // // --------sau khi thay doi va update ok
                Notification("success", "Edit Station", "Edit station is successfully");
            }
        });
    }

    handleChange(event) {
        let temp = Object.assign({}, this.state.temp);
        let obj = event.target.name.split(".")[0];
        let key = event.target.name.split(".")[1];

        if (obj === "stage_1") temp.stage_1[key] = event.target.value;
        else if (obj === "seed") {
            temp._id = event.target.value;

            api.getConfig(event.target.value, (err, result) => {
                if (err) {
                    Notification(
                        "error",
                        "Error",
                        err.data === undefined ? err : err.data._error_message,
                    );
                } else {
                    console.log(result);
                    
                    this.setState({
                        dataConfig: result,
                        temp: result,
                    });
                }
            });
        } else if (obj === "stage_2") temp.stage_2[key] = event.target.value;
        else if (obj === "stage_3") temp.stage_3[key] = event.target.value;
        // else if (obj === "stage_4") temp.stage_4[key] = event.target.value;
        else temp[event.target.name] = event.target.value;
        this.setState({ temp: temp });
    }


    handleCloseConfig() {
        let state = Object.assign({}, this.state);
        state.submitted = false;
        state.temp.name = "";
        state.is_private = false;
        state.showModal.config_digital = false;
        this.setState(state);
    }

    componentDidMount() {
        const that = this;
        api.getInfoProject(utils.getStationInfo().sub_id, (err, result) => {
            console.log(result);
            if (err) {
                Notification("error", "Error", err.data === undefined ? err : err.data._error_message)
            } else {
                that.setState({
                    dataConfig: result,
                    isLoaded1: true
                })
                localStorage.setItem('project', JSON.stringify(result));
            }
        });
        api.getListSeed((err, result) => {
            if (err) {
                Notification(
                    "error",
                    "Error",
                    err.data === undefined ? err : err.data._error_message,
                );
            } else {
                api.getConfig(result[0]._id, (err, result) => {
                    if (err) {
                        Notification(
                            "error",
                            "Error",
                            err.data === undefined ? err : err.data._error_message,
                        );

                    }
                    else{
                        this.setState({
                            dataConfig: result,
                            isLoaderAPI: true
                        });
                    }
                });
                that.setState({ listSeed: result });
            }
        });
    }

    render() {
        console.log(this.state.dataConfig);
        
        return (
            !this.state.isLoaderAPI ?  <ReactLoading className="m-auto" type='bars' color='black' />
            :
            <React.Fragment>
                <Row>
                    <Col xs='5'>
                        <Label>Chọn cây trồng</Label>
                        <Input
                            type='select'
                            width='10px'
                            onChange={this.handleChange}
                            name='seed._id'
                            id='createConfig'>
                            {this.state.listSeed.map((seed, index) => {                                        
                                return (
                                    <option className='d-inline' value={seed._id}>
                                        {seed.seed === "tomato"
                                            ? "Cà chua"
                                            : "" || seed.seed === "cucumber"
                                            ? "Dưa chuột"
                                            : "" || seed.seed === "pakchoi"
                                            ? "Cải ngọt"
                                            : "" || seed.seed === "brassica"
                                            ? "Cải chíp"
                                            : "" || seed.seed === "cabbage"
                                            ? "Bắp cải"
                                            : ""}
                                    </option>
                                );
                            })}
                        </Input>
                    </Col>
                </Row>
                <Row>
                    <Col xs='12' className='mt-3'>
                        <Tabs defaultActiveKey='g1'>
                            <Tab eventKey='g1' title='Cây con'>
                                <Card
                                    className='flex-fill w-100'
                                    style={{ height: 370, width: "100%" }}>
                                    <CardBody className='my-0'>
                                        <Row>
                                            <Col xs='4'>Tổng số ngày :</Col>
                                            <Col
                                                xs='8'
                                                className='text-center station__stage-date'>
                                                <Input
                                                    type='number'
                                                    name='stage_1.stage_days'
                                                    placeholder='Tổng số ngày'
                                                    value={
                                                        this.state.dataConfig.stage_1
                                                            .stage_days
                                                    }
                                                    onChange={this.handleChange}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs='4' className='mt-4'>
                                                Nhiệt độ :
                                            </Col>
                                            <Col xs='4' className='mt-4 pr-1'>
                                                <Input
                                                    type='number'
                                                    name='stage_1.min_temp'
                                                    placeholder='nhỏ nhất'
                                                    value={
                                                        this.state.dataConfig.stage_1
                                                            .min_temp
                                                    }
                                                    onChange={this.handleChange}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                            </Col>
                                            <Col xs='4' className='mt-4'>
                                                <Input
                                                    type='number'
                                                    name='stage_1.max_temp'
                                                    placeholder='lớn nhất'
                                                    value={
                                                        this.state.dataConfig.stage_1
                                                            .max_temp
                                                    }
                                                    onChange={this.handleChange}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs='4' className='mt-4 '>
                                                Độ ẩm không khí :
                                            </Col>
                                            <Col xs='4' className='mt-4 pr-1'>
                                                <Input
                                                    type='number'
                                                    name='stage_1.min_hum'
                                                    placeholder='nhỏ nhất'
                                                    value={
                                                        this.state.dataConfig.stage_1
                                                            .min_hum
                                                    }
                                                    onChange={this.handleChange}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                            </Col>
                                            <Col xs='4' className='mt-4'>
                                                <Input
                                                    type='number'
                                                    name='stage_1.max_hum'
                                                    placeholder='lớn nhất'
                                                    value={
                                                        this.state.dataConfig.stage_1
                                                            .max_hum
                                                    }
                                                    onChange={this.handleChange}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs='4' className='mt-4'>
                                                Độ ẩm đất :
                                            </Col>
                                            <Col xs='4' className='mt-4 pr-1'>
                                                <Input
                                                    type='number'
                                                    name='stage_1.min_soil_moisture'
                                                    placeholder='nhỏ nhất'
                                                    value={
                                                        this.state.dataConfig.stage_1
                                                            .min_soil_moisture
                                                    }
                                                    onChange={this.handleChange}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                            </Col>
                                            <Col xs='4' className='mt-4'>
                                                <Input
                                                    type='number'
                                                    name='stage_1.max_soil_moisture'
                                                    placeholder='lớn nhất'
                                                    value={
                                                        this.state.dataConfig.stage_1
                                                            .max_soil_moisture
                                                    }
                                                    onChange={this.handleChange}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs='4' className='mt-4'>
                                                Ánh sáng :
                                            </Col>
                                            <Col xs='4' className='mt-4 pr-1'>
                                                <Input
                                                    type='number'
                                                    name='stage_1.min_light'
                                                    placeholder='nhỏ nhất'
                                                    value={
                                                        this.state.dataConfig.stage_1
                                                            .min_light
                                                    }
                                                    onChange={this.handleChange}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                            </Col>
                                            <Col xs='4' className='mt-4'>
                                                <Input
                                                    type='number'
                                                    name='stage_1.max_light'
                                                    placeholder='lớn nhất'
                                                    value={
                                                        this.state.dataConfig.stage_1
                                                            .max_light
                                                    }
                                                    onChange={this.handleChange}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs='4' className='mt-4'>
                                                PH :
                                            </Col>
                                            <Col xs='4' className='mt-4 pr-1'>
                                                <Input
                                                    type='number'
                                                    name='stage_1.min_PH'
                                                    placeholder='nhỏ nhất'
                                                    value={
                                                        this.state.dataConfig.stage_1.min_PH
                                                    }
                                                    onChange={this.handleChange}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                            </Col>
                                            <Col xs='4' className='mt-4'>
                                                <Input
                                                    type='number'
                                                    name='stage_1.max_PH'
                                                    placeholder='lớn nhất'
                                                    value={
                                                        this.state.dataConfig.stage_1.max_PH
                                                    }
                                                    onChange={this.handleChange}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Tab>
                            <Tab eventKey='g2' title='Cây trưởng thành'>
                                <Card className='flex-fill w-100'>
                                    <CardBody className='my-0'>
                                        <Row>
                                            <Col xs='4'>Tổng số ngày :</Col>
                                            <Col
                                                xs='8'
                                                className='text-center station__stage-date'>
                                                <Input
                                                    type='number'
                                                    name='stage_2.stage_days'
                                                    placeholder='Tổng số ngày'
                                                    value={
                                                        this.state.dataConfig.stage_2
                                                            .stage_days
                                                    }
                                                    onChange={this.handleChange}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs='4' className='mt-4'>
                                                Nhiệt độ :
                                            </Col>
                                            <Col xs='4' className='mt-4 pr-1'>
                                                <Input
                                                    type='number'
                                                    name='stage_2.min_temp'
                                                    placeholder='nhỏ nhất'
                                                    value={
                                                        this.state.dataConfig.stage_2
                                                            .min_temp
                                                    }
                                                    onChange={this.handleChange}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                            </Col>
                                            <Col xs='4' className='mt-4'>
                                                <Input
                                                    type='number'
                                                    name='stage_2.max_temp'
                                                    placeholder='lớn nhất'
                                                    value={
                                                        this.state.dataConfig.stage_2
                                                            .max_temp
                                                    }
                                                    onChange={this.handleChange}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs='4' className='mt-4'>
                                                Độ ẩm không khí :
                                            </Col>
                                            <Col xs='4' className='mt-4 pr-1'>
                                                <Input
                                                    type='number'
                                                    name='stage_2.min_hum'
                                                    placeholder='nhỏ nhất'
                                                    value={
                                                        this.state.dataConfig.stage_2
                                                            .min_hum
                                                    }
                                                    onChange={this.handleChange}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                            </Col>
                                            <Col xs='4' className='mt-4'>
                                                <Input
                                                    type='number'
                                                    name='stage_2.max_hum'
                                                    placeholder='lớn nhất'
                                                    value={
                                                        this.state.dataConfig.stage_2
                                                            .max_hum
                                                    }
                                                    onChange={this.handleChange}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs='4' className='mt-4'>
                                                Độ ẩm đất :
                                            </Col>
                                            <Col xs='4' className='mt-4 pr-1'>
                                                <Input
                                                    type='number'
                                                    name='stage_2.min_soil_moisture'
                                                    placeholder='nhỏ nhất'
                                                    value={
                                                        this.state.dataConfig.stage_2
                                                            .min_soil_moisture
                                                    }
                                                    onChange={this.handleChange}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                            </Col>
                                            <Col xs='4' className='mt-4'>
                                                <Input
                                                    type='number'
                                                    name='stage_2.max_soil_moisture'
                                                    placeholder='lớn nhất'
                                                    value={
                                                        this.state.dataConfig.stage_2
                                                            .max_soil_moisture
                                                    }
                                                    onChange={this.handleChange}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs='4' className='mt-4'>
                                                Ánh sáng :
                                            </Col>
                                            <Col xs='4' className='mt-4 pr-1'>
                                                <Input
                                                    type='number'
                                                    name='stage_2.min_light'
                                                    placeholder='nhỏ nhất'
                                                    value={
                                                        this.state.dataConfig.stage_2
                                                            .min_light
                                                    }
                                                    onChange={this.handleChange}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                            </Col>
                                            <Col xs='4' className='mt-4'>
                                                <Input
                                                    type='number'
                                                    name='stage_2.stage_1max_light'
                                                    placeholder='lớn nhất'
                                                    value={
                                                        this.state.dataConfig.stage_2
                                                            .max_light
                                                    }
                                                    onChange={this.handleChange}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs='4' className='mt-4'>
                                                PH :
                                            </Col>
                                            <Col xs='4' className='mt-4 pr-1'>
                                                <Input
                                                    type='number'
                                                    name='stage_2.min_PH'
                                                    placeholder='nhỏ nhất'
                                                    value={
                                                        this.state.dataConfig.stage_2.min_PH
                                                    }
                                                    onChange={this.handleChange}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                            </Col>
                                            <Col xs='4' className='mt-4'>
                                                <Input
                                                    type='number'
                                                    name='stage_2.max_PH'
                                                    placeholder='lớn nhất'
                                                    value={
                                                        this.state.dataConfig.stage_2.max_PH
                                                    }
                                                    onChange={this.handleChange}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Tab>
                            <Tab eventKey='g3' title='Thu hoạch'>
                                <Card
                                    className='flex-fill w-100'
                                    style={{ height: 370, width: "100%" }}>
                                    <CardBody className='my-0'>
                                        <Row>
                                            <Col xs='4'>Tổng số ngày :</Col>
                                            <Col
                                                xs='8'
                                                className='text-center station__stage-date'>
                                                <Input
                                                    type='number'
                                                    name='stage_3.stage_days'
                                                    placeholder='Tổng số ngày'
                                                    value={
                                                        this.state.dataConfig.stage_3
                                                            .stage_days
                                                    }
                                                    onChange={this.handleChange}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs='4' className='mt-4'>
                                                Nhiệt độ :
                                            </Col>
                                            <Col xs='4' className='mt-4 pr-1'>
                                                <Input
                                                    type='number'
                                                    name='stage_3.min_temp'
                                                    placeholder='nhỏ nhất'
                                                    value={
                                                        this.state.dataConfig.stage_3
                                                            .min_temp
                                                    }
                                                    onChange={this.handleChange}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                            </Col>
                                            <Col xs='4' className='mt-4'>
                                                <Input
                                                    type='number'
                                                    name='stage_3.max_temp'
                                                    placeholder='lớn nhất'
                                                    value={
                                                        this.state.dataConfig.stage_3
                                                            .max_temp
                                                    }
                                                    onChange={this.handleChange}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs='4' className='mt-4'>
                                                Độ ẩm không khí :
                                            </Col>
                                            <Col xs='4' className='mt-4 pr-1'>
                                                <Input
                                                    type='number'
                                                    name='stage_3.min_hum'
                                                    placeholder='nhỏ nhất'
                                                    value={
                                                        this.state.dataConfig.stage_3
                                                            .min_hum
                                                    }
                                                    onChange={this.handleChange}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                            </Col>
                                            <Col xs='4' className='mt-4'>
                                                <Input
                                                    type='number'
                                                    name='stage_3.max_hum'
                                                    placeholder='lớn nhất'
                                                    value={
                                                        this.state.dataConfig.stage_3
                                                            .max_hum
                                                    }
                                                    onChange={this.handleChange}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs='4' className='mt-4'>
                                                Độ ẩm đất :
                                            </Col>
                                            <Col xs='4' className='mt-4 pr-1'>
                                                <Input
                                                    type='number'
                                                    name='stage_3.min_soil_moisture'
                                                    placeholder='nhỏ nhất'
                                                    value={
                                                        this.state.dataConfig.stage_3
                                                            .min_soil_moisture
                                                    }
                                                    onChange={this.handleChange}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                            </Col>
                                            <Col xs='4' className='mt-4'>
                                                <Input
                                                    type='number'
                                                    name='stage_3.max_soil_moisture'
                                                    placeholder='lớn nhất'
                                                    value={
                                                        this.state.dataConfig.stage_3
                                                            .max_soil_moisture
                                                    }
                                                    onChange={this.handleChange}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs='4' className='mt-4'>
                                                Ánh sáng :
                                            </Col>
                                            <Col xs='4' className='mt-4 pr-1'>
                                                <Input
                                                    type='number'
                                                    name='stage_3.min_light'
                                                    placeholder='nhỏ nhất'
                                                    value={
                                                        this.state.dataConfig.stage_3
                                                            .min_light
                                                    }
                                                    onChange={this.handleChange}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                            </Col>
                                            <Col xs='4' className='mt-4'>
                                                <Input
                                                    type='number'
                                                    name='stage_3.stage_1max_light'
                                                    placeholder='lớn nhất'
                                                    value={
                                                        this.state.dataConfig.stage_3
                                                            .max_light
                                                    }
                                                    onChange={this.handleChange}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs='4' className='mt-4'>
                                                PH :
                                            </Col>
                                            <Col xs='4' className='mt-4 pr-1'>
                                                <Input
                                                    type='number'
                                                    name='stage_3.min_PH'
                                                    placeholder='nhỏ nhất'
                                                    value={
                                                        this.state.dataConfig.stage_3.min_PH
                                                    }
                                                    onChange={this.handleChange}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                            </Col>
                                            <Col xs='4' className='mt-4'>
                                                <Input
                                                    type='number'
                                                    name='stage_3.max_PH'
                                                    placeholder='lớn nhất'
                                                    value={
                                                        this.state.dataConfig.stage_3.max_PH
                                                    }
                                                    onChange={this.handleChange}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Tab>
                            {/* <Tab eventKey='g4' title='Thu hoạch'>
                                <Card
                                    className='flex-fill w-100'
                                    style={{ height: 370, width: "100%" }}>
                                    <CardBody className='my-0'>
                                        <Row>
                                            <Col xs='4'>Tổng số ngày :</Col>
                                            <Col
                                                xs='8'
                                                className='text-center station__stage-date'>
                                                <Input
                                                    type='number'
                                                    name='stage_4.stage_days'
                                                    placeholder='Tổng số ngày'
                                                    value={
                                                        this.state.dataConfig.stage_4
                                                            .stage_days
                                                    }
                                                    onChange={this.handleChange}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs='4' className='mt-4'>
                                                Nhiệt độ :
                                            </Col>
                                            <Col xs='4' className='mt-4 pr-1'>
                                                <Input
                                                    type='number'
                                                    name='stage_4.min_temp'
                                                    placeholder='nhỏ nhất'
                                                    value={
                                                        this.state.dataConfig.stage_4
                                                            .min_temp
                                                    }
                                                    onChange={this.handleChange}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                            </Col>
                                            <Col xs='4' className='mt-4'>
                                                <Input
                                                    type='number'
                                                    name='stage_4.max_temp'
                                                    placeholder='lớn nhất'
                                                    value={
                                                        this.state.dataConfig.stage_4
                                                            .max_temp
                                                    }
                                                    onChange={this.handleChange}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs='4' className='mt-4'>
                                                Độ ẩm không khí :
                                            </Col>
                                            <Col xs='4' className='mt-4 pr-1'>
                                                <Input
                                                    type='number'
                                                    name='stage_4.min_hum'
                                                    placeholder='nhỏ nhất'
                                                    value={
                                                        this.state.dataConfig.stage_4
                                                            .min_hum
                                                    }
                                                    onChange={this.handleChange}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                            </Col>
                                            <Col xs='4' className='mt-4'>
                                                <Input
                                                    type='number'
                                                    name='stage_4.max_hum'
                                                    placeholder='lớn nhất'
                                                    value={
                                                        this.state.dataConfig.stage_4
                                                            .max_hum
                                                    }
                                                    onChange={this.handleChange}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs='4' className='mt-4'>
                                                Độ ẩm đất :
                                            </Col>
                                            <Col xs='4' className='mt-4 pr-1'>
                                                <Input
                                                    type='number'
                                                    name='stage_4.min_soil_moisture'
                                                    placeholder='nhỏ nhất'
                                                    value={
                                                        this.state.dataConfig.stage_4
                                                            .min_soil_moisture
                                                    }
                                                    onChange={this.handleChange}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                            </Col>
                                            <Col xs='4' className='mt-4'>
                                                <Input
                                                    type='number'
                                                    name='stage_4.max_soil_moisture'
                                                    placeholder='lớn nhất'
                                                    value={
                                                        this.state.dataConfig.stage_4
                                                            .max_soil_moisture
                                                    }
                                                    onChange={this.handleChange}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs='4' className='mt-4'>
                                                Ánh sáng :
                                            </Col>
                                            <Col xs='4' className='mt-4 pr-1'>
                                                <Input
                                                    type='number'
                                                    name='stage_4.min_light'
                                                    placeholder='nhỏ nhất'
                                                    value={
                                                        this.state.dataConfig.stage_4
                                                            .min_light
                                                    }
                                                    onChange={this.handleChange}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                            </Col>
                                            <Col xs='4' className='mt-4'>
                                                <Input
                                                    type='number'
                                                    name='stage_4.stage_1max_light'
                                                    placeholder='lớn nhất'
                                                    value={
                                                        this.state.dataConfig.stage_4
                                                            .max_light
                                                    }
                                                    onChange={this.handleChange}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs='4' className='mt-4'>
                                                PH :
                                            </Col>
                                            <Col xs='4' className='mt-4 pr-1'>
                                                <Input
                                                    type='number'
                                                    name='stage_4.min_PH'
                                                    placeholder='nhỏ nhất'
                                                    value={
                                                        this.state.dataConfig.stage_4.min_PH
                                                    }
                                                    onChange={this.handleChange}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                            </Col>
                                            <Col xs='4' className='mt-4'>
                                                <Input
                                                    type='number'
                                                    name='stage_4.max_PH'
                                                    placeholder='lớn nhất'
                                                    value={
                                                        this.state.dataConfig.stage_4.max_PH
                                                    }
                                                    onChange={this.handleChange}
                                                    autoComplete='off'
                                                    disabled
                                                />
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Tab>  */}
                        </Tabs>
                        <Button
                            className="float-right"
                            type='button'
                            color='success'
                            onClick={this.handleSaveChange.bind(this)}>
                            Lưu thay đổi
                        </Button>
                        <Button
                            className='float-right mr-2'
                            onClick={this.handleCloseConfig.bind(this)}>
                            Quay lại
                        </Button>
                    </Col>
                </Row>
            </React.Fragment>
        )
    }
}

export default Config;
