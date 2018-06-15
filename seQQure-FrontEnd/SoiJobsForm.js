import React from "react";
import deepmerge from "deepmerge";
import InputValue from "../helpers/inputComponent";
import {
  FormField,
  FormFieldConfig,
  validate as formFieldValidate
} from "../helpers/form.helper";
import FormPanel from "../components/FormPanel";
import uuidv4 from "uuid/v4";

class SoiJobsForm extends React.Component {
  constructor(props) {
    super(props);
    const formFields = this.convertPropsToFormFields(props);
    const hasProps =
      this.props.formData && Object.keys(props.formData).length > 0; //reference Object.keys/values, other types of Object.
    this.state = {
      formFields,
      formValid: this.validateForm(formFields),
      propsReceived: hasProps
    };
    this.onSubmit = this.onSubmit.bind(this);
  }
  static defaultProps = {
    formData: {
      title: "",
      firm: "",
      address: "",
      tenure: ""
    }
  };
  static formDataConfig = {
    title: new FormFieldConfig("Present Occupation", {
      required: { value: true }
    }),
    firm: new FormFieldConfig("Firm Name", {
      required: { value: true }
    }),
    address: new FormFieldConfig("Address", {
      required: { value: true }
    }),
    tenure: new FormFieldConfig("Tenure", {
      required: { value: true }
    })
  };
  validateForm(formToValidate) {
    return Object.values(formToValidate).reduce((valid, formField) => {
      return valid && formField.valid;
    }, true);
  }
  convertPropsToFormFields(props) {
    let jobFormData = deepmerge(
      SoiJobsForm.defaultProps.formData,
      props.formData
    );
    const formFields = {
      title: new FormField(jobFormData.title),
      firm: new FormField(jobFormData.firm),
      address: new FormField(jobFormData.address),
      tenure: new FormField(jobFormData.tenure)
    };
    return formFields;
  }
  handleInput(event) {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    const name = event.target.name;
    const config = SoiJobsForm.formDataConfig[name];

    this.setState(prevState => {
      const field = {
        ...prevState.formFields[name]
      };
      field.value = value;
      field.touched = true;
      formFieldValidate(field, config);
      const formFields = {
        ...prevState.formFields,
        [name]: field
      };
      let formValid = this.validateForm(formFields);
      return { formFields: formFields, formValid: formValid };
    });
  }
  renderErrorMsgs(field) {
    return !field.valid && field.touched
      ? field.brokenRules.map(br => {
          //ONLY STRINGS CAN BE PASSED THROUGH INPUT FIELDS NOT OBJECT MESSAGES
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
  onSubmit() {
    if (!this.state.formValid) {
      const testFormData = JSON.parse(JSON.stringify(this.state.formFields));
      for (let fieldIdentifier in testFormData) {
        testFormData[fieldIdentifier].touched = true;
      }
      this.setState({ formFields: testFormData });
      return;
    }
    const job = {
      title: this.state.formFields.title.value,
      firm: this.state.formFields.firm.value,
      address: this.state.formFields.address.value,
      tenure: this.state.formFields.tenure.value,
      id: this.props.formData.id || uuidv4() //checks if the id exist in props, if not, uuidv4
    };
    this.props.onAdd(job);
  }
  onCancel() {
    this.props.onCancel();
  }
  render() {
    return (
      <React.Fragment>
        <FormPanel
          title="Add a Job"
          children={
            <div className="smart-form">
              <fieldset>
                <div className="row">
                  <InputValue
                    validation={this.inputClassName(
                      this.state.formFields.title
                    )}
                    label="Present Occupation"
                    colSize="col-3"
                    iCon="fa-suitcase"
                    type="text"
                    name="title"
                    value={this.state.formFields.title.value}
                    placeholder="Present Occupation"
                    changeFunction={e => this.handleInput(e)}
                    err={this.renderErrorMsgs(this.state.formFields.title)}
                  />
                  <InputValue
                    validation={this.inputClassName(this.state.formFields.firm)}
                    label="Firm Name"
                    colSize="col-3"
                    iCon="fa-building"
                    type="text"
                    name="firm"
                    value={this.state.formFields.firm.value}
                    placeholder="Firm Name"
                    changeFunction={e => this.handleInput(e)}
                    err={this.renderErrorMsgs(this.state.formFields.firm)}
                  />
                  <InputValue
                    validation={this.inputClassName(
                      this.state.formFields.address
                    )}
                    label="Address"
                    colSize="col-3"
                    iCon="fa-map-marker"
                    type="text"
                    name="address"
                    value={this.state.formFields.address.value}
                    placeholder="Address"
                    changeFunction={e => this.handleInput(e)}
                    err={this.renderErrorMsgs(this.state.formFields.address)}
                  />
                  <InputValue
                    validation={this.inputClassName(
                      this.state.formFields.tenure
                    )}
                    label="No. of Years"
                    colSize="col-3"
                    iCon="fa-calendar-o"
                    type="text"
                    name="tenure"
                    value={this.state.formFields.tenure.value}
                    placeholder="Tenure"
                    changeFunction={e => this.handleInput(e)}
                    err={this.renderErrorMsgs(this.state.formFields.tenure)}
                  />
                </div>
                {!this.state.propsReceived ? (
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={this.onSubmit}
                  >
                    Add Job
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.onSubmit}
                  >
                    Update Job
                  </button>
                )}{" "}
                <button
                  type="button"
                  onClick={e => this.onCancel(e)}
                  className="btn btn-danger"
                >
                  Cancel
                </button>
              </fieldset>{" "}
            </div>
          }
        />
      </React.Fragment>
    );
  }
}

export default SoiJobsForm;
