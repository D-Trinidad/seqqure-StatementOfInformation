import React from "react";
import deepmerge from "deepmerge";
import * as SoiService from "../services/SOI.service";
import InputValue from "../helpers/inputComponent";
import {
  FormField,
  FormFieldConfig,
  validate as formFieldValidate
} from "../helpers/form.helper";
import moment from "moment";
import FormPanel from "../components/FormPanel";
import SoiJobsForm from "./SoiJobsForm";
import SoiResidenceForm from "./SoiResidenceForm";
import uuidv4 from "uuid/v4";
import { getSOIById } from "../services/SOI.service";
import Notifier from "../helpers/notifier";

class SoiForm extends React.Component {
  constructor(props) {
    super(props);
    const formFields = this.convertFormDataToFormFields(props.formData);

    this.state = {
      formFieldSS: formFields,
      formValid: this.validateForm(formFields),
      jobFormData: null,
      residenceFormData: null,
      finalSave: false
    };
  }
  static defaultProps = {
    formData: {
      improvements: "",
      occupiedBy: "",
      construction: "",
      workNature: "",
      firstName: "",
      middleName: "",
      lastName: "",
      aka: "",
      socialSecurity: "",
      birthPlace: "",
      dateOfBirth: "",
      driversLicense: "",
      relationshipStatus: "",
      currentPartner: "",
      ex: "",
      jobs: [],
      residences: []
    }
  };
  static formDataConfig = {
    id: new FormFieldConfig("Id"),
    personId: new FormFieldConfig("PeopleID"),
    improvements: new FormFieldConfig("Improvements", {
      required: { value: false },
      list: { value: ["Single Residence", "Multiple Residence", "Commercial"] }
    }),
    occupiedBy: new FormFieldConfig("Occupied By", {
      required: { value: false },
      list: { value: ["Owner", "Tenants"] }
    }),
    construction: new FormFieldConfig("Any Construction?", {
      required: { value: false },
      list: { value: ["Yes", "No"] }
    }),
    workNature: new FormFieldConfig("Nature of Work"),
    firstName: new FormFieldConfig("First Name", {
      required: { value: true }
    }),
    middleName: new FormFieldConfig("Middle Name"),
    lastName: new FormFieldConfig("Last Name", {
      required: { value: true }
    }),
    aka: new FormFieldConfig("Other Alias"),
    socialSecurity: new FormFieldConfig("Social Security", {
      required: { value: true }
    }),
    birthPlace: new FormFieldConfig("Birth Place", {
      required: { value: true }
    }),
    dateOfBirth: new FormFieldConfig("Date of Birth", {
      required: { value: true }
    }),
    driversLicense: new FormFieldConfig("Driver's License"),
    relationshipStatus: new FormFieldConfig("Relationship Status", {
      required: { value: false }, //why false?
      list: { value: ["Single", "Married", "Registered Domestic Partner"] }
    }),
    currentPartner: new FormFieldConfig("Current Partner"),
    ex: new FormFieldConfig("Former Partner"),
    jobs: new FormFieldConfig("Previous Employment"),
    residences: new FormFieldConfig("Previous Residences")
  };

  validateForm(formToValidate) {
    return Object.values(formToValidate).reduce((valid, formField) => {
      return valid && formField.valid;
    }, true); //look up 'reduce'. 'true' in this case is the starting value parameter
    //REDUCES ALL VALUES TO FALSE IF EVEN ONE IS FALSE BECAUSE ALL HAVE TO BE TRUE (VALID) TO SUBMIT
  }
  convertFormDataToFormFields(formData) {
    let infoFormData = deepmerge(SoiForm.defaultProps.formData, formData);
    const formFields = {
      improvements: new FormField(infoFormData.improvements),
      occupiedBy: new FormField(infoFormData.occupiedBy),
      construction: new FormField(infoFormData.construction),
      workNature: new FormField(infoFormData.workNature),
      firstName: new FormField(infoFormData.firstName),
      middleName: new FormField(infoFormData.middleName),
      lastName: new FormField(infoFormData.lastName),
      aka: new FormField(infoFormData.aka),
      socialSecurity: new FormField(infoFormData.socialSecurity),
      birthPlace: new FormField(infoFormData.birthPlace),
      dateOfBirth: new FormField(infoFormData.dateOfBirth),
      driversLicense: new FormField(infoFormData.driversLicense),
      relationshipStatus: new FormField(infoFormData.relationshipStatus),
      currentPartner: new FormField(infoFormData.currentPartner),
      ex: new FormField(infoFormData.ex),
      jobs: new FormField(infoFormData.jobs),
      residences: new FormField(infoFormData.residences),
      id: new FormField(infoFormData._id),
      personId: new FormField(infoFormData.personId)
    };

    for (let fieldName in formFields) {
      let field = formFields[fieldName];
      let config = SoiForm.formDataConfig[fieldName];
      formFieldValidate(field, config);
    }
    return formFields;
  }
  componentDidMount() {
    getSOIById(this.props.personId).then(personsSOI => {
      if (personsSOI.item) {
        const formFields = this.convertFormDataToFormFields(personsSOI.item);
        this.setState({
          formFieldSS: formFields,
          formValid: this.validateForm(formFields)
        });
      } else {
        console.log(personsSOI);
      }
    });
  }
  handleInput(event) {
    event.persist();
    const value = event.target.value;
    const name = event.target.name;
    const config = SoiForm.formDataConfig[name];

    this.setState(prevState => {
      const field = { ...prevState.formFieldSS[name] };
      field.value = value;
      field.touched = true;
      formFieldValidate(field, config);
      const formFields = { ...prevState.formFieldSS, [name]: field };
      let formVALID = this.validateForm(formFields);
      return { formFieldSS: formFields, formValid: formVALID };
    });
  }
  renderErrorMsgs(field) {
    return !field.valid && field.touched
      ? field.brokenRules.map(br => {
          return (
            <div key={br.rule} className="note note-error">
              >
              {br.msg}
            </div>
          );
        })
      : null;
  }
  inputClassName(field) {
    return !field.valid && field.touched ? "input state-error" : "input";
  }

  handleSubmit(event) {
    //checks validation
    event.preventDefault();
    if (!this.state.formValid) {
      const testFormData = JSON.parse(JSON.stringify(this.state.formFieldSS));
      for (let fieldIdentifier in testFormData) {
        testFormData[fieldIdentifier].touched = true;
      }
      this.setState({ formFieldSS: testFormData });
      return;
    }
    const item = {
      improvements: this.state.formFieldSS.improvements.value,
      occupiedBy: this.state.formFieldSS.occupiedBy.value,
      construction: this.state.formFieldSS.construction.value,
      workNature: this.state.formFieldSS.workNature.value,
      firstName: this.state.formFieldSS.firstName.value,
      middleName: this.state.formFieldSS.middleName.value,
      lastName: this.state.formFieldSS.lastName.value,
      aka: this.state.formFieldSS.aka.value,
      socialSecurity: this.state.formFieldSS.socialSecurity.value,
      birthPlace: this.state.formFieldSS.birthPlace.value,
      dateOfBirth: this.state.formFieldSS.dateOfBirth.value,
      driversLicense: this.state.formFieldSS.driversLicense.value,
      relationshipStatus: this.state.formFieldSS.relationshipStatus.value,
      currentPartner: this.state.formFieldSS.currentPartner.value,
      ex: this.state.formFieldSS.ex.value,
      jobs: this.state.formFieldSS.jobs.value,
      residences: this.state.formFieldSS.residences.value,
      id: this.state.formFieldSS.id.value,
      personId: this.state.formFieldSS.personId.value,
      escrowId: this.props.escrowId
    };
    if (this.state.formFieldSS.id.value) {
      if (this.state.finalSave) {
        item.finalSave = true;
      }
      SoiService.update(item)
        .then(success => {
          if (this.state.finalSave) {
            this.props.finalSave();
          } else {
            Notifier.success("Save Successful");
          }
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      if (this.state.finalSave) {
        item.finalSave = true;
      }
      item.personId = this.props.personId;
      SoiService.postInfo(item)
        .then(success => {
          if (this.state.finalSave) {
            this.props.finalSave();
          } else {
            Notifier.success("Save Successful");
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
  /////FINAL SAVE/////
  finalSave() {
    this.setState({
      finalSave: true
    });
  }
  //HANDLING THE JOB COMPONENT
  onJobAdd() {
    this.setState({
      jobFormData: {}
    });
  }
  onJobCancel() {
    this.setState({
      jobFormData: null
    });
  }
  onJobAdded = job => {
    const jobsArray = this.state.formFieldSS.jobs.value;
    const jobExists = jobsArray.reduce((acc, oldJob) => {
      return oldJob.id === job.id || acc;
    }, false);
    let jobs = [];
    if (jobExists) {
      //update
      jobs = jobsArray.map(item => {
        return item.id === job.id ? job : item; //if matched id, returns job, else keep the original job
      });
    } else {
      //post
      jobs = jobsArray.concat(job);
    }
    const jobFormField = { ...this.state.formFieldSS.jobs, value: jobs };
    const jobFields = { ...this.state.formFieldSS, jobs: jobFormField };
    this.setState({
      formFieldSS: jobFields,
      jobFormData: null
    });
  };
  selectJob(item) {
    console.log(item);
    this.setState({
      jobFormData: item
    });
  }
  deleteJob(job) {
    let firedJobIndex = this.state.formFieldSS.jobs.value.indexOf(job);
    const newArray = this.state.formFieldSS.jobs.value.filter(
      (keptJob, _idx) => _idx !== firedJobIndex
    );
    const newJobFormField = { ...this.state.formFieldSS.jobs, value: newArray }; //i hate these 2 lines. why do i need these??
    const jobFields = { ...this.state.formFieldSS, jobs: newJobFormField };
    this.setState({
      formFieldSS: jobFields
    });
  }

  //HANDLING THE RESIDENCES COMPONENT
  onResidenceAdd() {
    this.setState({
      residenceFormData: {}
    });
  }
  onResidenceCancel() {
    this.setState({
      residenceFormData: null
    });
  }
  onResidenceAdded = residence => {
    const residencesArray = this.state.formFieldSS.residences.value;
    const residenceExists = residencesArray.reduce((acc, oldResidence) => {
      return oldResidence.id === residence.id || acc;
    }, false);
    let residences = [];
    if (residenceExists) {
      //update
      residences = residencesArray.map(item => {
        return item.id === residence.id ? residence : item; //if matched id, returns job, else keep the original job
      });
    } else {
      //post
      residences = residencesArray.concat(residence);
    }
    const residenceFormField = {
      ...this.state.formFieldSS.residences,
      value: residences
    };
    const residenceFields = {
      ...this.state.formFieldSS,
      residences: residenceFormField
    };
    this.setState({
      formFieldSS: residenceFields,
      residenceFormData: null
    });
  };
  selectResidence(item) {
    console.log(item);
    this.setState({
      residenceFormData: item
    });
  }
  deleteResidence(residence) {
    let firedResidenceIndex = this.state.formFieldSS.residences.value.indexOf(
      residence
    );
    const newArray = this.state.formFieldSS.residences.value.filter(
      (keptResidence, _idx) => _idx !== firedResidenceIndex
    );
    const newResidenceFormField = {
      ...this.state.formFieldSS.residences,
      value: newArray
    };
    const residenceFields = {
      ...this.state.formFieldSS,
      residences: newResidenceFormField
    };
    this.setState({
      formFieldSS: residenceFields
    });
  }
  render() {
    return (
      <React.Fragment>
        <FormPanel
          title="Statement of Information"
          children={
            <form className="smart-form" onSubmit={e => this.handleSubmit(e)}>
              <fieldset>
                <div className="col-lg-6">
                  <div className="row">
                    <label className="label">1. IMPROVEMENTS: </label>
                    <div className="inline-group">
                      <label
                        className={
                          "radio " +
                          this.inputClassName(
                            this.state.formFieldSS.improvements
                          )
                        }
                      >
                        <input
                          type="radio"
                          name="improvements"
                          id="inlineRadio1"
                          checked={
                            this.state.formFieldSS.improvements.value ===
                            "Single Residence"
                          }
                          value="Single Residence"
                          onChange={e => this.handleInput(e)}
                        />
                        <i />Single Residence
                      </label>
                      <label
                        className={
                          "radio " +
                          this.inputClassName(
                            this.state.formFieldSS.improvements
                          )
                        }
                      >
                        <input
                          type="radio"
                          name="improvements"
                          id="inlineRadio2"
                          checked={
                            this.state.formFieldSS.improvements.value ===
                            "Multiple Residence"
                          }
                          value="Multiple Residence"
                          onChange={e => this.handleInput(e)}
                        />
                        <i />Multiple Residence
                      </label>
                      <label
                        className={
                          "radio " +
                          this.inputClassName(
                            this.state.formFieldSS.improvements
                          )
                        }
                      >
                        <input
                          type="radio"
                          name="improvements"
                          id="inlineRadio3"
                          checked={
                            this.state.formFieldSS.improvements.value ===
                            "Commercial"
                          }
                          value="Commercial"
                          onChange={e => this.handleInput(e)}
                        />
                        <i />Commercial
                      </label>
                    </div>
                    {this.renderErrorMsgs(this.state.formFieldSS.improvements)}
                  </div>

                  <div className="row">
                    <label className="label">2. OCCUPIED BY: </label>
                    <div className="inline-group">
                      <label
                        className={
                          "radio " +
                          this.inputClassName(this.state.formFieldSS.occupiedBy)
                        }
                      >
                        <input
                          type="radio"
                          name="occupiedBy"
                          id="inlineRadio4"
                          checked={
                            this.state.formFieldSS.occupiedBy.value === "Owner"
                          }
                          value="Owner"
                          onChange={e => this.handleInput(e)}
                        />
                        <i />Owner
                      </label>
                      <label
                        className={
                          "radio " +
                          this.inputClassName(this.state.formFieldSS.occupiedBy)
                        }
                      >
                        <input
                          type="radio"
                          name="occupiedBy"
                          id="inlineRadio5"
                          checked={
                            this.state.formFieldSS.occupiedBy.value ===
                            "Tenants"
                          }
                          value="Tenants"
                          onChange={e => this.handleInput(e)}
                        />
                        <i />Tenants
                      </label>
                    </div>
                    {this.renderErrorMsgs(this.state.formFieldSS.occupiedBy)}
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="row">
                    <label className="label">
                      3. ANY CONSTRUCTION WITHIN THE LAST 6 MONTHS?{" "}
                    </label>
                    <div className="inline-group">
                      <label
                        className={
                          "radio " +
                          this.inputClassName(
                            this.state.formFieldSS.construction
                          )
                        }
                      >
                        <input
                          type="radio"
                          name="construction"
                          id="inlineRadio6"
                          checked={
                            this.state.formFieldSS.construction.value === "Yes"
                          }
                          value="Yes"
                          onChange={e => this.handleInput(e)}
                        />
                        <i />YES
                      </label>
                      <label
                        className={
                          "radio " +
                          this.inputClassName(
                            this.state.formFieldSS.construction
                          )
                        }
                      >
                        <input
                          type="radio"
                          name="construction"
                          id="inlineRadio7"
                          checked={
                            this.state.formFieldSS.construction.value === "No"
                          }
                          value="No"
                          onChange={e => this.handleInput(e)}
                        />
                        <i />NO
                      </label>
                    </div>
                    {this.renderErrorMsgs(this.state.formFieldSS.construction)}
                  </div>

                  {this.state.formFieldSS.construction.value === "Yes" && (
                    <div className="row">
                      <InputValue
                        validation={this.inputClassName(
                          this.state.formFieldSS.workNature
                        )}
                        label="Nature of Work Done"
                        colSize="col-lg-12"
                        iCon="fa-wrench"
                        type="text"
                        name="workNature"
                        value={this.state.formFieldSS.workNature.value}
                        placeholder="What work did you do?"
                        changeFunction={e => this.handleInput(e)}
                        err={this.renderErrorMsgs(
                          this.state.formFieldSS.workNature
                        )}
                      />
                    </div>
                  )}
                </div>
              </fieldset>

              <fieldset>
                <div className="row">
                  <InputValue
                    validation={this.inputClassName(
                      this.state.formFieldSS.firstName
                    )}
                    label="First name"
                    colSize="col-3"
                    iCon="fa-user"
                    type="text"
                    name="firstName"
                    value={this.state.formFieldSS.firstName.value}
                    placeholder="First Name"
                    changeFunction={e => this.handleInput(e)}
                    err={this.renderErrorMsgs(this.state.formFieldSS.firstName)}
                  />
                  <InputValue
                    validation={this.inputClassName(
                      this.state.formFieldSS.middleName
                    )}
                    label="Middle Name"
                    colSize="col-3"
                    iCon="fa-user"
                    type="text"
                    name="middleName"
                    value={this.state.formFieldSS.middleName.value}
                    placeholder="Middle Name"
                    changeFunction={e => this.handleInput(e)}
                    err={this.renderErrorMsgs(
                      this.state.formFieldSS.middleName
                    )}
                  />
                  <InputValue
                    validation={this.inputClassName(
                      this.state.formFieldSS.lastName
                    )}
                    label="Last Name"
                    colSize="col-3"
                    iCon="fa-user"
                    type="text"
                    name="lastName"
                    value={this.state.formFieldSS.lastName.value}
                    placeholder="Last Name"
                    changeFunction={e => this.handleInput(e)}
                    err={this.renderErrorMsgs(this.state.formFieldSS.lastName)}
                  />
                  <InputValue
                    validation={this.inputClassName(this.state.formFieldSS.aka)}
                    label="Former/Other Aliases"
                    colSize="col-3"
                    iCon="fa-user"
                    type="text"
                    name="aka"
                    value={this.state.formFieldSS.aka.value}
                    placeholder="Other Alias"
                    changeFunction={e => this.handleInput(e)}
                    err={this.renderErrorMsgs(this.state.formFieldSS.aka)}
                  />
                </div>
                <div className="row">
                  <InputValue
                    validation={this.inputClassName(
                      this.state.formFieldSS.socialSecurity
                    )}
                    label="Social Security Number"
                    colSize="col-3"
                    iCon="fa-id-card"
                    type="password"
                    name="socialSecurity"
                    value={this.state.formFieldSS.socialSecurity.value}
                    placeholder="Social Security Number"
                    changeFunction={e => this.handleInput(e)}
                    err={this.renderErrorMsgs(
                      this.state.formFieldSS.socialSecurity
                    )}
                  />
                  <InputValue
                    validation={this.inputClassName(
                      this.state.formFieldSS.driversLicense
                    )}
                    label="Drivers License Number"
                    colSize="col-3"
                    iCon="fa-id-card"
                    type="text"
                    name="driversLicense"
                    value={this.state.formFieldSS.driversLicense.value}
                    placeholder="Drivers License Number"
                    changeFunction={e => this.handleInput(e)}
                    err={this.renderErrorMsgs(
                      this.state.formFieldSS.driversLicense
                    )}
                  />
                  <InputValue
                    validation={this.inputClassName(
                      this.state.formFieldSS.birthPlace
                    )}
                    label="Place of Birth"
                    colSize="col-3"
                    iCon="fa-user-md"
                    type="text"
                    name="birthPlace"
                    value={this.state.formFieldSS.birthPlace.value}
                    placeholder="Birth Place"
                    changeFunction={e => this.handleInput(e)}
                    err={this.renderErrorMsgs(
                      this.state.formFieldSS.birthPlace
                    )}
                  />
                  <InputValue
                    validation={this.inputClassName(
                      this.state.formFieldSS.dateOfBirth
                    )}
                    label="Date of Birth"
                    colSize="col-3"
                    iCon="fa-calendar"
                    type="date"
                    name="dateOfBirth"
                    value={moment(
                      this.state.formFieldSS.dateOfBirth.value
                    ).format("YYYY-MM-DD")}
                    changeFunction={e => this.handleInput(e)}
                    err={this.renderErrorMsgs(
                      this.state.formFieldSS.dateOfBirth
                    )}
                  />
                </div>
                <div className="row">
                  <div className="inline-group">
                    <label
                      className={
                        "radio " +
                        this.inputClassName(
                          this.state.formFieldSS.relationshipStatus
                        )
                      }
                    >
                      <input
                        type="radio"
                        name="relationshipStatus"
                        id="inlineRadio8"
                        checked={
                          this.state.formFieldSS.relationshipStatus.value ===
                          "Single"
                        }
                        value="Single"
                        onChange={e => this.handleInput(e)}
                      />
                      <i />Single
                    </label>
                    <label
                      className={
                        "radio " +
                        this.inputClassName(
                          this.state.formFieldSS.relationshipStatus
                        )
                      }
                    >
                      <input
                        type="radio"
                        name="relationshipStatus"
                        id="inlineRadio9"
                        checked={
                          this.state.formFieldSS.relationshipStatus.value ===
                          "Married"
                        }
                        value="Married"
                        onChange={e => this.handleInput(e)}
                      />
                      <i />Married
                    </label>
                    <label
                      className={
                        "radio " +
                        this.inputClassName(
                          this.state.formFieldSS.relationshipStatus
                        )
                      }
                    >
                      <input
                        type="radio"
                        name="relationshipStatus"
                        id="inlineRadio0"
                        checked={
                          this.state.formFieldSS.relationshipStatus.value ===
                          "Registered Domestic Partner"
                        }
                        value="Registered Domestic Partner"
                        onChange={e => this.handleInput(e)}
                      />
                      <i />I Have a REGISTERED Domestic Partner
                    </label>
                  </div>
                  {this.state.formFieldSS.relationshipStatus.value ===
                    "Married" ||
                  this.state.formFieldSS.relationshipStatus.value ===
                    "Registered" ? (
                    <InputValue
                      validation={this.inputClassName(
                        this.state.formFieldSS.currentPartner
                      )}
                      label="Name of Current Spouse/Partner"
                      colSize="col-6"
                      iCon="fa-smile-o"
                      type="text"
                      name="currentPartner"
                      value={this.state.formFieldSS.currentPartner.value}
                      placeholder="Current Spouse/Registered Domestic Partner Name"
                      changeFunction={e => this.handleInput(e)}
                      err={this.renderErrorMsgs(
                        this.state.formFieldSS.currentPartner
                      )}
                    />
                  ) : null}

                  <InputValue
                    validation={this.inputClassName(this.state.formFieldSS.ex)}
                    label="Name of Former Spouse/Partner"
                    colSize="col-6"
                    iCon="fa-frown-o"
                    type="text"
                    name="ex"
                    value={this.state.formFieldSS.ex.value}
                    placeholder="Former Spouse/Regiestered Domestic Partner Name"
                    changeFunction={e => this.handleInput(e)}
                    err={this.renderErrorMsgs(this.state.formFieldSS.ex)}
                  />
                </div>
              </fieldset>
              <fieldset>
                <div>
                  <h4 style={{ justifyContent: "center" }}>
                    OCCUPATIONS FOR LAST 10 YEARS
                  </h4>
                </div>
                <div className="row">
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Occupation</th>
                          <th>Firm Name</th>
                          <th>Address</th>
                          <th>Number of Years</th>
                          <th />
                        </tr>
                      </thead>
                      {this.state.formFieldSS.jobs.value.map(job => (
                        <tbody key={job.jobId || uuidv4()}>
                          <tr>
                            <td>{job.title}</td>
                            <td>{job.firm}</td>
                            <td>{job.address}</td>
                            <td>{job.tenure}</td>
                            <td style={{ float: "right" }}>
                              <button
                                type="button"
                                className="btn btn-xs btn-warning"
                                onClick={e => this.selectJob(job, e)}
                              >
                                Edit
                              </button>{" "}
                              <button
                                type="button"
                                className="btn btn-xs btn-danger"
                                onClick={e => this.deleteJob(job, e)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      ))}
                    </table>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-info"
                  onClick={e => this.onJobAdd(e)}
                >
                  Add Employment
                </button>{" "}
                <div>
                  {this.state.jobFormData && (
                    <div>
                      <SoiJobsForm
                        formData={this.state.jobFormData}
                        onAdd={e => this.onJobAdded(e)}
                        onCancel={e => this.onJobCancel(e)}
                      />
                    </div>
                  )}
                </div>
              </fieldset>
              <fieldset>
                <h4>RESIDENCES FOR LAST 10 YEARS</h4>
                <div className="row">
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Street</th>
                          <th>City</th>
                          <th>State</th>
                          <th>Zip</th>
                          <th />
                        </tr>
                      </thead>
                      {this.state.formFieldSS.residences.value.map(
                        residence => (
                          <tbody key={residence.residenceId || uuidv4()}>
                            {/*checks to see if there's an id, if not, generate one with uuidv4 component function*/}
                            <tr>
                              <td>{residence.street}</td>
                              <td>{residence.city}</td>
                              <td>{residence.state}</td>
                              <td>{residence.zip}</td>
                              <td style={{ float: "right" }}>
                                <button
                                  type="button"
                                  className="btn btn-xs btn-warning"
                                  onClick={e =>
                                    this.selectResidence(residence, e)
                                  }
                                >
                                  Edit
                                </button>{" "}
                                <button
                                  type="button"
                                  className="btn btn-xs btn-danger"
                                  onClick={e =>
                                    this.deleteResidence(residence, e)
                                  }
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        )
                      )}
                    </table>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-info"
                  onClick={e => this.onResidenceAdd(e)}
                >
                  Add Residence
                </button>
                <div>
                  {this.state.residenceFormData && (
                    <div>
                      <SoiResidenceForm
                        formData={this.state.residenceFormData}
                        onAdd={e => this.onResidenceAdded(e)}
                        onCancel={e => this.onResidenceCancel(e)}
                      />
                    </div>
                  )}
                </div>
              </fieldset>
              <fieldset>
                <button type="submit" className="btn btn-success">
                  Save Draft
                </button>{" "}
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={e => this.finalSave(e)}
                  style={{ float: "right" }}
                >
                  Final Submit
                </button>{" "}
              </fieldset>
            </form>
          }
        />
      </React.Fragment>
    );
  }
}

export default SoiForm;
