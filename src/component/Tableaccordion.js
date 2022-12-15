import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import {
  Col,
  Container,
  OverlayTrigger,
  Row,
  Table,
  Tooltip,
} from "react-bootstrap";
import SelectBasic from "./Selectbasic";

function Tableaccordion({ maximumoption, itemlist }) {
  const [injson, setJson] = React.useState(
    maximumoption.filter((obj) => obj.종류 === "주얼")
  );

  const [choiceitem, setChoiceItem] = React.useState("주얼");
  const [optionnamelist, setOptionNameList] = React.useState([]);

  React.useEffect(() => {
    setJson(maximumoption.filter((obj) => obj.종류 === choiceitem));
  }, [choiceitem, maximumoption]);

  React.useEffect(() => {
    let optionnamelisttemp = [];
    injson.map((obj) => {
      optionnamelisttemp = optionnamelisttemp.concat(Object.keys(obj));
      return 0;
    });
    setOptionNameList(
      [...new Set(optionnamelisttemp)].filter(
        (e) => e !== "종류" && e !== "희귀도"
      )
    );
  }, [injson]);

  return (
    <Container style={{ paddingTop: 56, height: "100vh" }}>
      <Row className="justify-content-center mt-2">
        <Col xs={10}>
          <SelectBasic
            name={""}
            basiclist={itemlist}
            basicchoice={setChoiceItem}
          />
        </Col>
      </Row>
      <Row className="justify-content-center mt-2 h-75">
        <Col xs={10} className="overflow-auto h-100">
          <Table
            hover
            className="table-sm align-middle text-center table-striped-columns"
            variant="dark"
            style={{ fontSize: "0.8rem" }}
          >
            <thead>
              <tr>
                <th className="align-middle">
                  접두접미&nbsp;
                  <OverlayTrigger
                    overlay={
                      <Tooltip id="tooltip-disabled">
                        접두/접미/겹침(+크래프트)
                      </Tooltip>
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-question-square "
                      viewBox="0 0 16 16"
                      style={{ verticalAlign: "-0.175rem" }}
                    >
                      <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                      <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />
                    </svg>
                  </OverlayTrigger>
                </th>
                {injson.map((obj) => (
                  <th key={obj.희귀도}>{obj.희귀도}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {optionnamelist.map((value, idx) => (
                <tr key={idx}>
                  <td>{value}</td>
                  {injson.map((obj, idx) => (
                    <td key={idx}>{obj[value]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

export default Tableaccordion;
