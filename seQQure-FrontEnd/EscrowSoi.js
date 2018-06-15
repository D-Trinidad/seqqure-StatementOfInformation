import React from "react";
import StatementOfInfo from "../components/SoiForm";
import SoiReadOnly from "../components/SoiReadOnly";
import * as constants from "../constants";
import { getSOIById } from "../services/SOI.service";

class EscrowSoi extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInRole: this.props.logRole,
      isSoiCompleted: false,
      personFormData: {}
    };
  }

  componentDidMount() {
    getSOIById(this.props.personId).then(pSOI => {
      if (pSOI.item && pSOI.item.finalSave) {
        this.setState({
          isSoiCompleted: true,
          personFormData: pSOI.item
        });
      }
    });
  }
  showSaved() {
    this.setState({
      isSoiCompleted: true
    });
  }

  render() {
    // Check if logged in user is buyer or seller
    const isBOrS = this.state.loggedInRole.some(
      someRole => someRole === constants.ROLE_B || someRole === constants.ROLE_S
    );
    //Check if logged in user is Escrow Agent OR Manager
    const iEAoEM = this.state.loggedInRole.some(
      someRole =>
        someRole === constants.ROLE_EM || someRole === constants.ROLE_EA
    );
    return (
      //CODE IT FOR TENANT ADMIN AND MASTER ADMIN (CURRENTLY ITS READ ONLY)
      <React.Fragment>
        {isBOrS ? (
          !this.state.isSoiCompleted ? (
            <StatementOfInfo
              personId={this.props.personId}
              finalSave={e => this.showSaved(e)}
              escrowInfo={this.props.escrowPeopleInfo}
              escrowId={this.props.escrowId}
            />
          ) : (
            <SoiReadOnly
              isBorS={isBOrS}
              personId={this.props.personId}
              escrowId={this.props.escrowId}
              personFormData={this.state.personFormData}
            />
          )
        ) : iEAoEM ? (
          <SoiReadOnly
            isEAoEM={iEAoEM}
            escrowPeopleInfo={this.props.escrowPeopleInfo}
            escrowId={this.props.escrowId}
          />
        ) : (
          <div>
            Please Log in as an Escrow Agent/Manager or a Buyer/Seller to view
            Statement of Information
          </div>
        )}
      </React.Fragment>
    );
  }
}
export default EscrowSoi;
