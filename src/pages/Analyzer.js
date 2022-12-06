import "bootstrap/dist/css/bootstrap.min.css";

import React from "react";

import axios from "axios";

import Container from "react-bootstrap/Container";
import {
  Button,
  Form,
  Image,
  InputGroup,
  ListGroup,
  Offcanvas,
  Spinner,
} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Imageuploder from "../component/Imageuploder";
import Editabletable from "../component/Editableracttable.tsx";

import maximumoption from "../maximumoption.json";
import SelectBasic from "../component/Selectbasic";

function findMaximumOptionList(choiceitem, choicerarity) {
  const choiceoptiontemp = maximumoption.filter(function (optionjson) {
    return optionjson.종류 === choiceitem && optionjson.희귀도 === choicerarity;
  })[0];

  return choiceoptiontemp;
}

function responseToJson(data, choiceoptiontemp) {
  const optionlist = Object.keys(data).map((value, idx) => {
    return {
      접두접미: value,
      현재수치: data[value],
      최대수치: choiceoptiontemp[value],
    };
  });
  return refineOption(optionlist, choiceoptiontemp);
}

function refineOption(optionlist, choiceoptionlist) {
  let allresist = 0;
  let resistidx = [];
  let resistmin = 100;
  for (const idx in optionlist) {
    if (
      optionlist[idx].접두접미.includes("타격시") ||
      optionlist[idx].접두접미.includes("피격시") ||
      optionlist[idx].접두접미.includes("공격시") ||
      optionlist[idx].접두접미.startsWith("레벨")
    )
      optionlist[idx].최대수치 = "스킬옵션";
    else if (optionlist[idx].접두접미.includes("캐릭터레벨"))
      optionlist[idx].최대수치 = "항상으뜸";
    else if (optionlist[idx].접두접미.endsWith("저항")) {
      if (resistmin > +optionlist[idx].현재수치) {
        resistmin = +optionlist[idx].현재수치;
      }
      allresist = allresist + 1;
      resistidx.push(idx);
    }
  }
  if (allresist === 4) {
    resistidx = resistidx.reverse();
    for (const idx of resistidx) {
      if (+optionlist[idx].현재수치 - resistmin === 0) {
        optionlist.splice(idx, 1);
      } else optionlist[idx].현재수치 = +optionlist[idx].현재수치 - resistmin;
    }
    optionlist.push({
      접두접미: "모든저항",
      현재수치: resistmin,
      최대수치: choiceoptionlist["모든저항"],
    });
  }
  return optionlist;
}

function Analyzer() {
  const [choiceitem, setChoiceItem] = React.useState("주얼");
  const [choicerarity, setChoiceRarity] = React.useState("매직");
  const [optionlist, setOptionList] = React.useState([]);
  const [choiceoptionlist, setChoiceOptionList] = React.useState({
    종류: "",
    희귀도: "",
    옵션: "",
  });
  const [imginfo, setImgInfo] = React.useState("");
  const [blobinfo, setBlobInfo] = React.useState("");
  const [addoption, setAddOption] = React.useState("");
  const [addfigure, setAddFigure] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  const reader = new FileReader();

  const fileUpload = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", blobinfo);
    axios({
      method: "post",
      url: "http://34.64.132.65:8000/uploadimg",
      data: formData,
      params: { type: choiceitem, rarity: choicerarity },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then(function (e) {
        const choiceoptiontemp = findMaximumOptionList(
          choiceitem,
          choicerarity
        );
        const optionlisttemp = responseToJson(e.data, choiceoptiontemp);
        setChoiceOptionList(choiceoptiontemp);
        setOptionList([...optionlisttemp]);
        setLoading(false);
      })
      .catch(function (error) {
        if (error.response) {
          // 요청이 이루어졌으며 서버가 2xx의 범위를 벗어나는 상태 코드로 응답했습니다.
          console.log(error.response.status);
          alert(error.response.status + " 오류가 발생했습니다");
          setLoading(false);
        }
      });
  };

  const handleOnPaste = async (e) => {
    e.preventDefault();
    const item = e.clipboardData.items[0];
    if (item.type.indexOf("image") === 0) {
      const blob = item.getAsFile();
      setBlobInfo(blob);
      reader.readAsDataURL(blob);
      reader.onload = () => {
        const text = `${reader.result}`;
        setImgInfo(text);
      };
    }
  };

  const handleOnClick = () => {
    setOptionList((prevlist) => {
      const templist = [
        ...prevlist,
        {
          접두접미: addoption,
          현재수치: addfigure,
          최대수치: choiceoptionlist[addoption],
        },
      ];
      refineOption(templist, choiceoptionlist);

      return templist;
    });
  };

  return (
    <Container
      className="App "
      onPaste={handleOnPaste}
      style={{ paddingTop: 56, height: "100vh" }}
    >
      <Offcanvas
        className="bg-transparent position-absolute top-50 start-50 translate-middle"
        show={loading}
        backdrop="static"
      >
        <Spinner
          className="m-auto text-light fs-1"
          animation="border"
          role="status"
          style={{ width: "20rem", height: "20rem" }}
        />
      </Offcanvas>
      <Row className="h-100">
        {optionlist[0] ? (
          <Col xs={12} sm={12} lg={8}>
            <Row>
              <Col xs={12}>
                <Editabletable
                  optionlist={optionlist}
                  setOptionList={setOptionList}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={4} sm={4}>
                <SelectBasic
                  basiclist={Object.keys(choiceoptionlist).slice(2)}
                  basicchoice={setAddOption}
                />
              </Col>
              <Col xs={4} sm={4}>
                <InputGroup className="mb-3">
                  <Form.Control
                    className="shadow-none border-dark bg-dark text-white"
                    aria-label="Small"
                    placeholder="현재수치"
                    onChange={(e) => {
                      setAddFigure(e.target.value);
                    }}
                  />
                </InputGroup>
              </Col>
              <Col xs={4} sm={4}>
                <Button
                  variant="dark"
                  onClick={() => {
                    handleOnClick();
                    // setOptionList((prevlist) =>
                    //   refineOption([...prevlist], choiceoptionlist)
                    // );
                  }}
                >
                  옵션추가
                </Button>
              </Col>
            </Row>
          </Col>
        ) : (
          <Col xs={12} sm={12} lg={8}>
            <ListGroup className="mt-2">
              <ListGroup.Item className="bg-dark text-white">
                <p className="fs-1">어떻게 할까?</p>
              </ListGroup.Item>
              <ListGroup.Item className="bg-dark text-white">
                <Image
                  src={`${process.env.PUBLIC_URL}/설명.png`}
                  alt="설명.png"
                />
              </ListGroup.Item>
              <ListGroup.Item className="bg-dark text-secondary">
                1 레저렉션에서 옵션이 궁금한 아이템의 옵션을{" "}
                <strong className="text-white">캡쳐</strong>합니다.
              </ListGroup.Item>
              <ListGroup.Item className="bg-dark text-secondary">
                2 옵션 사진을 <strong className="text-white">업로드</strong>{" "}
                혹은 <strong className="text-white">붙여넣기</strong>합니다.
              </ListGroup.Item>
              <ListGroup.Item className="bg-dark text-secondary">
                3 <strong className="text-white">아이템종류 희귀도</strong>를
                선택 후 <strong className="text-white">확인하기</strong> 버튼을
                클릭합니다.
              </ListGroup.Item>
              <ListGroup.Item className="bg-dark text-secondary">
                4 잠시 후 나온 결과를 확인하고{" "}
                <strong className="text-white">옵션</strong>을{" "}
                <strong className="text-white">추가</strong>하거나{" "}
                <strong className="text-white">수치</strong>를{" "}
                <strong className="text-white">변경</strong>하여 확인합니다.
              </ListGroup.Item>
            </ListGroup>
          </Col>
        )}

        {/* 이미지 업로드 공간 ctrl + v 를 이용해 클립보드에 복사된 내용을 업로드 가능 */}
        <Col xs={12} sm={12} lg={4}>
          <Imageuploder
            reader={reader}
            imginfo={imginfo}
            setChoiceItem={setChoiceItem}
            setChoiceRarity={setChoiceRarity}
            fileupload={fileUpload}
            setBlobInfo={setBlobInfo}
            setImgInfo={setImgInfo}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Analyzer;
