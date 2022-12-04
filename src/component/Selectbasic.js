import React from "react";
import Form from "react-bootstrap/Form";

function SelectBasic({ basiclist, basicchoice }) {
  return (
    <Form.Select
      aria-label="Item select"
      onChange={(e) => {
        basicchoice(e.target.value);
      }}
      className="shadow-none border-dark bg-dark text-white"
    >
      {basiclist.map((item, idx) => (
        <option key={idx} value={item}>
          {item}
        </option>
      ))}
    </Form.Select>
  );
}

export default SelectBasic;
