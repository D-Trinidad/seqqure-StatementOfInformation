import React from "react";

const InputValue = props => {
  return (
    <section className={`col ${props.colSize}`}>
      <label className="label" htmlFor={props.name}>
        {props.label}
      </label>
      <label className={props.validation}>
        <i className={`icon-prepend fa ${props.iCon}`} />
        <input
          type={props.type}
          name={props.name}
          value={props.value}
          placeholder={props.placeholder}
          onChange={props.changeFunction}
        />
      </label>

      {props.err}
    </section>
  );
};

// InputValue.defaultProps = {
//   colSize: "col-3"
// };

export default InputValue;
