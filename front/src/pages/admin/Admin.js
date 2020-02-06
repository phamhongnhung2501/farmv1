import React from "react";
import General from "./General"
import Members from "./Members"
import {
	Tabs, Tab
} from "react-bootstrap";

class Admin extends React.Component {
	render() {
		return (
			<Tabs defaultActiveKey="setting" >
				<Tab eventKey="setting" title="Cài đặt">
					<General />
				</Tab>
				<Tab eventKey="members" title="Thành viên">
					<Members />
				</Tab>
			</Tabs>
		);
	}
}

export default Admin;
