import React, { Component } from 'react';
import { Link, NavLink } from "react-router-dom";
import { withTranslation } from 'react-i18next';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { CustomImg, LoadingSprinner } from "../../components/CustomTag";
import avata from "../../assets/img/logo/login.png";
import utils from "../../utils/utils";
import "./VerifyAccount.css";
import {
    Button,
    Card, CardBody,
    Form, FormGroup, FormFeedback,
    Input,
    Alert,
    Col, Row,
    Label,
    Container,
} from "reactstrap";
const api = require("./api/api");

const email = window.location.search
    .slice(1)
    .split('&')
    .map(p => p.split('='))
    .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}).email;


class VerifyAccount extends Component {
    constructor(props) {
        super(props);
        this.textInput = React.createRef();
        this.state = {
            code: '',
            email: '',
            submitted: false,
            submittedSendCodeAgain: false,
            loading: false,
            error: '',
            showModal: {
                refreshCode: false,
            },

        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRefreshCode = this.handleRefreshCode.bind(this);
        // this.handleShow = this.handleShow.bind(this);
    }
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    handleRefreshCode(){
            api.refresh(email, (err, result) => {
                if (err) {
                } else {
                    if (result._id !== undefined) {
                        localStorage.setItem('userInfo', JSON.stringify({
                            mail: result.mail,
                        }))
                    }
                }
            })
    }
    handleSubmit(event) {
        event.preventDefault();
        this.setState({ submitted: true });
        const { code, mail } = this.state;

        this.setState({ loading: true });
        setTimeout(() => {
            api.verify(code, email, (err, result) => {
                if (err) {
                    this.setState({ error: err.data === undefined ? err : err.data._error_message, loading: false })
                } else {
                    if (result._id !== undefined) {
                        localStorage.setItem('userInfo', JSON.stringify({
                            mail: result.mail,
                        }))
                    }
                    window.location.replace("/auth/sign-in");
                }
            })
        }, 500);
    }
    validateCode(value) {
        let error;
        if (/(?=^.{6,}$).*$/i.test(value)) {
            error = false;
        } else {
            error = true;
        }
        return error;
    }

    render() {
        const { submitted, code, mail, loading, error } = this.state;
        return (
            <React.Fragment>
               
                <Container className="signin-container-width">
                    {error &&
                        <Alert color="danger" className="p-2" >{error}</Alert>
                    }
                    <div class="d-flex justify-content-center container">
                        <Card className="col-md-7 p-2 !important verify-card">
                            <CardBody className="px-0 pt-0 pb-0">
                                <div className="m-sm-4">
                                    <div className="text-center">
                                        <CustomImg
                                            width={150}
                                            height={150}
                                            key={utils.randomString()}
                                            src={avata}
                                            className="img--user--square-7x mr-4 mb-2"
                                        />
                                    </div>
                                    <div className="h3 text-primary text-center">Chào mừng bạn đến với Nông trại thông minh</div>
                                    <div className="text-center">Vui lòng nhập mã xác thực tài khoản để đăng ký thành công!</div>
                                    <Row>
                                        <Col className="verify__phone-number float-center">
                                            <Label for="name_of_manager" className="text-danger ml-2">*Mã code</Label>
                                            <Form onSubmit={this.handleSubmit}>
                                                <FormGroup >
                                                    <Input
                                                        bsSize="mb-3"
                                                        type="number"
                                                        name="code"
                                                        onChange={this.handleChange}
                                                        value={this.state.code}
                                                        onChange={this.handleChange}
                                                        placeholder="Mã code của bạn"
                                                        invalid={submitted && this.validateCode(this.state.code) ? true : false}
                                                    />
                                                    {!code &&
                                                        <FormFeedback invalid>
                                                            Bạn bắt buộc phải nhập mã code để tạo tài khoản thành công!
                                                        </FormFeedback>
                                                    }
                                                    {code && (!/(?=^.{6,}$).*$/i.test(code)) &&
                                                        <FormFeedback invalid>
                                                            Mã code này không tồn tại!
                                                        </FormFeedback>
                                                    }
                                                </FormGroup>
                                                <div className="text-center verify__button-sub">
                                                    {loading === false ?
                                                        <Button
                                                            color="primary"
                                                            font-weight="200"
                                                            size="mb-3 mt-1 "
                                                            className="btn btn-block mt-2"
                                                        >
                                                            Xác thực tài khoản 
                                                        </Button>
                                                        :
                                                        <LoadingSprinner />
                                                    }
                                                </div>
                                            </Form>
                                        </Col>
                                    </Row>
                                    <Row className="mt-1">
                                        <Col xs="5" className="Verify-Account__button-resend">
                                         
                                           <Link to={"verify-account?email=" + email} onClick={this.handleRefreshCode}>Gửi lại mã</Link>
                                        </Col>
                                    </Row>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </Container>
            </React.Fragment >
        );
    }
}

export default VerifyAccount;