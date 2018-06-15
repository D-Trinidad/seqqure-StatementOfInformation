import React from "react";
import * as SoiService from "../services/SOI.service";
import FormPanel from "./FormPanel";
import moment from "moment";

class SoiReadOnly extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isBorS: this.props.isBorS,
      bsFormData: {},
      isEAoEM: this.props.isEAoEM,
      soi: []
    };
  }
  componentDidMount() {
    if (this.state.isBorS) {
      SoiService.getSOIById(this.props.personId).then(success => {
        this.setState({
          bsFormData: success.item
        });
      });
    }
    if (this.state.isEAoEM) {
      SoiService.escrowIdMatchPeopleId(this.props.escrowId).then(success => {
        console.log(success);
        // const soi = this.state.soi;
        // this.setState({
        //   soi: soi
        // });
      });
    }
  }
  soiItem() {}
  render() {
    const bsFD = this.state.bsFormData;
    console.log(bsFD);
    const pleasework = bsFD ? (
      <FormPanel
        title="Statment of Information (READ-ONLY)"
        children={
          <div>
            <h1>
              <strong>
                NAME: {bsFD.firstName} {bsFD.middleName} {bsFD.lastName}
              </strong>
            </h1>
            <h2>
              FORMER LAST NAME(S), IF ANY: <strong>{bsFD.aka}</strong>
            </h2>
            <h3>
              <strong>Birth Info</strong>: BIRTH PLACE - {bsFD.birthPlace}, DOB
              - {moment(bsFD.dateOfBirth).format("YYYY-MM-DD")}
            </h3>
            <h3>
              <strong>Government Issued Id's</strong>: SSN# -{" "}
              {bsFD.socialSecurity}, DRIVER'S LICENSE# - {bsFD.driversLicense}
            </h3>
            <h3>
              <strong>Relationship Info:</strong> STATUS -{" "}
              {bsFD.relationshipStatus}, CURRENT SPOUSE/PARTNER(If not 'Single')
              - {bsFD.currentPartner}, FORMER SPOUSE/PARTNER - {bsFD.ex}
            </h3>
            <h4>
              <strong>Property Info:</strong> IMPROVEMENTS:
              {bsFD.improvements}, OCCUPIED BY:
              {bsFD.occupiedBy}, CONSTRUCTION IN THE LAST 6 MONTHS?:
              {bsFD.construction}, STATE NATURE OF WORK IF YES:
              {bsFD.workNature}
            </h4>
            <h2>
              <strong>Occupations During Last 10 years</strong>:
              <h4>
                <ul>
                  {bsFD &&
                    bsFD.jobs &&
                    bsFD.jobs.map(job => (
                      <li key={job.id}>
                        JOB:{job.title}, COMPANY: {job.firm}, ADDRESS:{
                          job.address
                        }, TENURE:{job.tenure}
                      </li>
                    ))}
                </ul>
              </h4>
            </h2>
            <h2>
              <strong>Residences During Last 10 years</strong>:
              <h4>
                <ul>
                  {bsFD &&
                    bsFD.residences &&
                    bsFD.residences.map(house => (
                      <li key={house.id}>
                        STREET:{house.street}, CITY: {house.city}, STATE:{
                          house.state
                        }, ZIP CODE:{house.zip}
                      </li>
                    ))}
                </ul>
              </h4>
            </h2>
          </div>
        }
      />
    ) : (
      <div>Loading</div>
    );
    return (
      <React.Fragment>
        {this.state.isBorS && bsFD && pleasework}
        {this.state.isEAoEM && <div>Escrow Agent/Managers READ ONLY</div>}
      </React.Fragment>
    );
  }
}

export default SoiReadOnly;
