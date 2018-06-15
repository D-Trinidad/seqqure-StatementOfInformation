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

class SoiResidenceForm extends React.Component {
  constructor(props) {
    super(props);
    const formFields = this.convertPropsToFormFields(props);
    const hasProps =
      this.props.formData && Object.keys(props.formData).length > 0;

    this.state = {
      formFields,
      formValid: this.validateForm(formFields),
      propsReceived: hasProps
    };
    this.onSubmit = this.onSubmit.bind(this);
  }
  static defaultProps = {
    formData: {
      street: "",
      city: "",
      state: "",
      zip: ""
    }
  };
  static formDataConfig = {
    street: new FormFieldConfig("Street", {
      required: { value: true }
    }),
    city: new FormFieldConfig("City", {
      required: { value: true }
    }),
    state: new FormFieldConfig("State", {
      required: { value: true }
    }),
    zip: new FormFieldConfig("Zip", {
      required: { value: true }
    })
  };
  validateForm(formToValidate) {
    return Object.values(formToValidate).reduce((valid, formField) => {
      return valid && formField.valid;
    }, true);
  }
  convertPropsToFormFields(props) {
    let residenceFormData = deepmerge(
      SoiResidenceForm.defaultProps.formData,
      props.formData
    );
    const formFields = {
      street: new FormField(residenceFormData.street),
      city: new FormField(residenceFormData.city),
      state: new FormField(residenceFormData.state),
      zip: new FormField(residenceFormData.zip)
    };
    return formFields;
  }
  handleInput(event) {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    const name = event.target.name;
    const config = SoiResidenceForm.formDataConfig[name];

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
    const residence = {
      street: this.state.formFields.street.value,
      city: this.state.formFields.city.value,
      state: this.state.formFields.state.value,
      zip: this.state.formFields.zip.value,
      id: this.props.formData.id || uuidv4() //checks if the id exist in props, if not, uuidv4
    };
    this.props.onAdd(residence);
  }
  onCancel() {
    this.props.onCancel();
  }
  render() {
    return (
      <React.Fragment>
        <FormPanel
          title="Add a Residence"
          children={
            <div className="smart-form">
              <fieldset>
                <div className="row">
                  <InputValue
                    validation={this.inputClassName(
                      this.state.formFields.street
                    )}
                    label="Street"
                    colSize="col-3"
                    iCon="fa-road"
                    type="text"
                    name="street"
                    value={this.state.formFields.street.value}
                    placeholder="Street"
                    changeFunction={e => this.handleInput(e)}
                    err={this.renderErrorMsgs(this.state.formFields.street)}
                  />
                  <InputValue
                    validation={this.inputClassName(this.state.formFields.city)}
                    label="City"
                    colSize="col-3"
                    iCon="fa-university"
                    type="text"
                    name="city"
                    value={this.state.formFields.city.value}
                    placeholder="City"
                    changeFunction={e => this.handleInput(e)}
                    err={this.renderErrorMsgs(this.state.formFields.city)}
                  />
                  <InputValue
                    validation={this.inputClassName(
                      this.state.formFields.state
                    )}
                    label="State"
                    colSize="col-3"
                    iCon="fa-globe"
                    type="text"
                    name="state"
                    value={this.state.formFields.state.value}
                    placeholder="State"
                    changeFunction={e => this.handleInput(e)}
                    err={this.renderErrorMsgs(this.state.formFields.state)}
                  />
                  <InputValue
                    validation={this.inputClassName(this.state.formFields.zip)}
                    label="Zip"
                    colSize="col-3"
                    iCon="fa-location-arrow"
                    type="text"
                    name="zip"
                    value={this.state.formFields.zip.value}
                    placeholder="Zip Code"
                    changeFunction={e => this.handleInput(e)}
                    err={this.renderErrorMsgs(this.state.formFields.zip)}
                  />
                </div>
                {!this.state.propsReceived ? (
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={this.onSubmit}
                  >
                    Add Residence
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.onSubmit}
                  >
                    Update Residence
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

export default SoiResidenceForm;
