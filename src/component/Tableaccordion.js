import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import SelectBasic from "./Selectbasic";

function Tableaccordion({ optionjson }) {
  const [injson, setJson] = React.useState(optionjson.slice(1, 3));
  const [choiceitem, setChoiceItem] = React.useState("주얼");
  const itemlist = [...new Set(optionjson.map((obj) => obj.종류))];

  React.useEffect(() => {
    setJson(optionjson.filter((obj) => obj.종류 === choiceitem));
  }, [choiceitem]);
  return (
    <Container style={{ paddingTop: 56 }}>
      <Row className="justify-content-center mt-2">
        <Col xs={10}>
          <SelectBasic basiclist={itemlist} basicchoice={setChoiceItem} />
        </Col>
      </Row>
      <Row className="justify-content-center mt-2">
        <Col xs={10} className="overflow-auto">
          <Table
            hover
            className="table-sm align-middle text-center"
            variant="dark"
            style={{ fontSize: "0.8rem" }}
          >
            <thead>
              <tr>
                <th>접두접미</th>
                <th className="table-warning">
                  레어/최대수치
                  <br />
                  (접두/접미/겹침)
                </th>
                <th className="table-primary">
                  매직/최대수치
                  <br />
                  (접두/접미/겹침)
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(injson[1]).map((value, idx) =>
                idx > 1 ? (
                  <tr key={idx}>
                    <td>{value}</td>
                    <td className="table-warning">
                      {injson[0][value] ? injson[0][value] : <></>}
                    </td>
                    <td className="table-primary">
                      {injson[1][value] ? injson[1][value] : <></>}
                    </td>
                  </tr>
                ) : (
                  <tr key={idx}></tr>
                )
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

export default Tableaccordion;
