import React from "react";
import {
	Button,
	Card,CardBody,
	Form, FormGroup, FormFeedback,
	Label,
	Input,
	Alert
} from "reactstrap";
import "./ResetPassword.css";
import { CustomImg, LoadingSprinner } from "../../components/CustomTag";
import avata from "../../assets/img/logo/login.png";
import utils from "../../utils/utils";
const api = require("./api/api");

class ResetPassword extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			submitted: false
		}
		this.handleChange = this.handleChange.bind(this);
    	this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		this.setState({
			[event.target.name]: event.target.value
		});
	}

	handleSubmit(event) {
		event.preventDefault();
		this.setState({ submitted: true });
		const { email } = this.state;
		if (!email) {
			return;
		}
		setTimeout(() => {
			api.recovery(email, (err, result) =>{	
				if(err){				
					this.setState({isError: true, isSuccess:false, loading: false})
				} else {
					this.setState({isSuccess: true, isError:false, loading: false})
				}
			})
		}, 500);
  }
  
  validateEmail(value) {
    let error;
    if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
        error = false;
    } else{
        error = true;
    }
    return error;
  }
	render() {
		const { email, submitted, isSuccess, isError } = this.state;
		return (
			<React.Fragment>
				{isSuccess &&
					<Alert  color="primary"  className="p-2" >
						<div>Kiểm tra email của bạn để lấy lại mật khẩu</div>
					</Alert>
				}
				{isError &&
					<Alert  color="danger" className="p-2" >
						<div>Email không tồn tại!</div>
					</Alert>
				}
				<div class=" justify-content-center container">
					<Card  className="ResetPassword-card border-0 ">
						<div className="text-center ">
						<div className="text-center">
							<CustomImg
								width={150}
								height={150}
								key={utils.randomString()}
								src={avata}
								className="img--user--square-7x mr-4 mt-3"
							/>
						</div>
						<p className="text-primary text-center h1 mb-1 font-weight-bold">Đặt lại mật khẩu</p>
						<p className="ResetPassword-div-lead mb-1">Nhập email để đặt lại mật khẩu cho bạn!</p>
					</div>
						<CardBody className="py-0 px-0">
							<div className="m-sm-4">
							<Form onSubmit={this.handleSubmit}>
								<FormGroup>
									<Label className="text-dark font-weight-bold">Email</Label>
									<Input
										bsSize="lg"
										type="email"
										name="email"
										value={this.state.email}
										onChange={this.handleChange}
										placeholder="Enter your email"
										invalid={submitted && this.validateEmail(this.state.email)}
									/>
									{ !email &&
										<FormFeedback invalid>
											Email là một trường bắt buộc!
										</FormFeedback> 
									}
									{ email && (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) &&
										<FormFeedback invalid>
											Email không tồn tại
										</FormFeedback> 
									}    
								</FormGroup>
								<div className="text-center mt-3">
									<Button 
										color="primary"
										size="lg"
										className="ResetPassword-button border-0"
									>
										Đặt lại mật khẩu
									</Button>
								</div>
							</Form>
							</div>
						</CardBody>
					</Card>
				</div>
			</React.Fragment>
		);
	}
}

export default ResetPassword;
