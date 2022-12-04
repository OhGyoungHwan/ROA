import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import SelectBasic from "./Selectbasic";
import { Button } from "react-bootstrap";

function Imageuploder({
  imginfo,
  setChoiceItem,
  setChoiceRarity,
  fileupload,
  setBlobInfo,
  setImgInfo,
  reader,
}) {
  const itemlist = [
    "주얼",
    "작은부적",
    "거대부적",
    "단도",
    "도검",
    "도끼",
    "곤봉",
    "철퇴",
    "망치",
    "셉터",
    "지팡이",
    "원드",
    "창",
    "미늘창",
    "손톱",
    "오브",
    "아마존창",
    "투척단도",
    "투척도끼",
    "투창",
    "활/쇠뇌",
    "아마존활",
    "서클릿",
    "투구",
    "갑옷",
    "장갑",
    "방패",
    "허리띠",
    "신발",
    "바바투구",
    "드루가죽",
    "네크토템",
    "팔라방패",
    "반지",
    "목걸이",
  ];
  const raritylist = ["매직", "레어"];
  const fileRef = React.useRef();
  const handleFileButtonClick = (e) => {
    e.preventDefault();
    fileRef.current.click();
  };

  const handleFileOnChange = (event) => {
    //파일 불러오기
    event.preventDefault();
    const blob = event.target.files[0];
    setBlobInfo(blob);
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const text = `${reader.result}`;
      setImgInfo(text);
    };
  };

  return (
    <Row className="justify-content-center h-100">
      <Col>
        <Row
          className="h-75
           my-2"
        >
          <input
            ref={fileRef}
            id="file"
            type="file"
            hidden
            onChange={handleFileOnChange}
          ></input>
          {imginfo ? (
            <Col
              onClick={handleFileButtonClick}
              style={{ cursor: "pointer" }}
              className="h-100 d-flex align-items-center justify-content-center shadow p-0 overflow-hidden bg-dark"
            >
              <Image src={imginfo} alt="preview-img" className="w-100" />
            </Col>
          ) : (
            <Col className="h-100 d-flex align-items-center justify-content-center shadow p-0  bg-dark rounded">
              <div className="my-auto">
                <Button onClick={handleFileButtonClick} className="btn-lg">
                  이미지 업로드
                </Button>
                <p className="text-white">또는 붙여넣기</p>
              </div>
            </Col>
          )}
        </Row>
        <Row className="my-2 ">
          <Col>
            <SelectBasic basiclist={itemlist} basicchoice={setChoiceItem} />
          </Col>
          <Col>
            <SelectBasic basiclist={raritylist} basicchoice={setChoiceRarity} />
          </Col>
          <Col>
            <Button onClick={fileupload} variant="dark">
              확인하기
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default Imageuploder;
