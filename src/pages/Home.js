import "bootstrap/dist/css/bootstrap.min.css";

import React from "react";

import axios from "axios";

import imageCompression from "browser-image-compression";

import Container from "react-bootstrap/Container";
import {
  Button,
  Form,
  InputGroup,
  ListGroup,
  Offcanvas,
  Spinner,
} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Imageuploder from "../component/Imageuploder";
import Editabletable from "../component/Editableracttable.tsx";
import SelectBasic from "../component/Selectbasic";

const listItemStyle = "bg-dark text-secondary fs-5 lh-lg";

function Home({
  findMaximumOptionList,
  refineOption,
  responseToJson,
  compressionOptions,
  itemlist,
  maximumoption,
  optionToText,
}) {
  const [choiceitem, setChoiceItem] = React.useState("주얼");
  const [choicerarity, setChoiceRarity] = React.useState("매직");
  const [optionlist, setOptionList] = React.useState([]);
  const [raritylist, setRarityList] = React.useState(
    maximumoption.filter((e) => e.종류 === choiceitem).map((obj) => obj.희귀도)
  );
  const [imginfo, setImgInfo] = React.useState("");
  const [blobinfo, setBlobInfo] = React.useState("");
  const [addoption, setAddOption] = React.useState("");
  const [addfigure, setAddFigure] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [choiceoptionlist, setChoiceOptionList] = React.useState({
    종류: "",
    희귀도: "",
    옵션: "",
  });
  const [optiontext, setOptionText] = React.useState("");

  React.useEffect(() => {
    const raritylisttemp = maximumoption
      .filter((e) => e.종류 === choiceitem)
      .map((obj) => obj.희귀도);
    setRarityList([...raritylisttemp]);
    setChoiceRarity(raritylisttemp[0]);
  }, [choiceitem, maximumoption]);

  React.useEffect(() => {
    setOptionText(optionToText(optionlist, choiceitem, choicerarity));
  }, [optionlist]);

  const reader = new FileReader();

  const fileUpload = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", blobinfo);
    axios({
      method: "post",
      url: "api/uploadimg",
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
        if (JSON.stringify(e.data) === "{}")
          alert("옵션확인이 불가능한 사진입니다.");
        const optionlisttemp = refineOption(
          responseToJson(e.data, choiceoptiontemp),
          choiceoptiontemp
        );
        setChoiceOptionList(choiceoptiontemp);
        setOptionList([...optionlisttemp]);
        setLoading(false);
        setAddOption(Object.keys(choiceoptiontemp)[2]);
        setOptionText(optionToText(optionlisttemp, choiceitem, choicerarity));
      })
      .catch(function (error) {
        if (error.response) {
          // 요청이 이루어졌으며 서버가 2xx의 범위를 벗어나는 상태 코드로 응답했습니다.
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
      const compressedFile = await imageCompression(blob, compressionOptions);
      setBlobInfo(compressedFile);
      reader.readAsDataURL(compressedFile);
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
      className="App"
      onPaste={handleOnPaste}
      style={{ paddingTop: 56 }}
    >
      {/* 로딩 컴포넌트 */}
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
      <Row>
        {optionlist[0] ? (
          // 옵션 확인 후 컴포넌트
          <Col xs={12} sm={12} lg={8}>
            <Row>
              <Col xs={12}>
                <InputGroup className="mt-2">
                  <InputGroup.Text
                    id="inputGroup-sizing-default"
                    className="bg-dark text-white shadow-none border-secondary rounded-0 border-1"
                  >
                    옵션텍스트
                  </InputGroup.Text>
                  <Form.Control
                    className="bg-dark text-white border-secondary border-1 rounded-0 shadow-none"
                    aria-label="Default"
                    aria-describedby="inputGroup-sizing-default"
                    value={optiontext}
                    onChange={(e) => setOptionText(e.target.value)}
                  />
                </InputGroup>
              </Col>
            </Row>
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
                  name={choiceitem + choicerarity}
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
                  }}
                >
                  옵션추가
                </Button>
              </Col>
            </Row>
          </Col>
        ) : (
          // 옵션 확인 전 컴포넌트
          <Col xs={12} sm={12} lg={8}>
            <ListGroup className="mt-2 h-100 ">
              <ListGroup.Item className="bg-dark text-white">
                <p className="fs-1">어떻게 할까?</p>
                <p className="text-secondary">
                  본사이트는 PC에 최적화 되어있습니다.
                </p>
              </ListGroup.Item>
              <ListGroup.Item className={listItemStyle}>
                1 레저렉션에서 궁금한 아이템의 옵션부분을{" "}
                <strong className="text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-windows"
                    viewBox="0 0 16 16"
                  >
                    <path d="M6.555 1.375 0 2.237v5.45h6.555V1.375zM0 13.795l6.555.933V8.313H0v5.482zm7.278-5.4.026 6.378L16 16V8.395H7.278zM16 0 7.33 1.244v6.414H16V0z" />
                  </svg>
                  +Shift+S 로 캡쳐
                </strong>
                합니다.
                <br />
                ※아이템의 <strong className="text-white">
                  옵션 부분만
                </strong>{" "}
                캡쳐해야 인식률이 좋습니다.※
                <br />
                ※이미 아이템 사진을 가지고 있다면 바로 업로드 합니다.※
              </ListGroup.Item>
              <ListGroup.Item className={listItemStyle}>
                2 캡쳐된 사진을{" "}
                <strong className="text-white">Ctrl+V 로 붙여넣기</strong>
                합니다.
              </ListGroup.Item>
              <ListGroup.Item className={listItemStyle}>
                3 <strong className="text-white">아이템종류 희귀도</strong>를
                선택 후 <strong className="text-white">확인하기</strong> 버튼을
                클릭합니다.
              </ListGroup.Item>
              <ListGroup.Item className={listItemStyle}>
                4 잠시 후 나온 결과를 확인하고{" "}
                <strong className="text-white">옵션</strong>을{" "}
                <strong className="text-white">추가</strong>하거나{" "}
                <strong className="text-white">수치</strong>를{" "}
                <strong className="text-white">변경</strong>합니다.
              </ListGroup.Item>
              <ListGroup.Item className={listItemStyle}>
                5 결과를 확인합니다.{" "}
                <strong className="text-warning">노란글씨</strong>는
                <strong className="text-white"> 괜찮은 옵션</strong>
                입니다.{" "}
              </ListGroup.Item>
              <ListGroup.Item className={listItemStyle}>
                6 <strong className="text-white">옵션텍스트</strong>를 통해 쉽게{" "}
                <strong className="text-white">복사</strong>할 수 있습니다.{" "}
              </ListGroup.Item>
            </ListGroup>
          </Col>
        )}

        {/* 이미지 업로드 공간 */}
        <Col xs={12} sm={12} lg={4}>
          <Imageuploder
            reader={reader}
            imginfo={imginfo}
            choiceitem={choiceitem}
            setChoiceItem={setChoiceItem}
            setChoiceRarity={setChoiceRarity}
            fileupload={fileUpload}
            setBlobInfo={setBlobInfo}
            setImgInfo={setImgInfo}
            compressionoptions={compressionOptions}
            itemlist={itemlist}
            raritylist={raritylist}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
