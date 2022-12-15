import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import { Button } from "react-bootstrap";

import SelectBasic from "./Selectbasic";

import imageCompression from "browser-image-compression";

function Imageuploder({
  imginfo,
  choiceitem,
  setChoiceItem,
  setChoiceRarity,
  fileupload,
  setBlobInfo,
  setImgInfo,
  reader,
  compressionOptions,
  itemlist,
  raritylist,
}) {
  const fileRef = React.useRef();

  const handleFileButtonClick = (e) => {
    e.preventDefault();
    fileRef.current.click();
  };

  const handleFileOnChange = async (e) => {
    //파일 불러오기
    e.preventDefault();
    const blob = e.target.files[0];
    const compressedFile = await imageCompression(blob, compressionOptions);
    setBlobInfo(compressedFile);
    reader.readAsDataURL(compressedFile);
    reader.onloadend = () => {
      const text = `${reader.result}`;
      setImgInfo(text);
    };
  };

  return (
    <Col>
      <Row className="mt-2">
        <input
          ref={fileRef}
          id="file"
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileOnChange}
        ></input>
        {imginfo ? (
          <Col
            onClick={handleFileButtonClick}
            style={{ cursor: "pointer" }}
            className="d-flex align-items-center justify-content-center shadow p-0 overflow-hidden bg-dark"
          >
            <Image
              src={imginfo}
              alt="preview-img"
              className="w-100"
              style={{ height: "75vh" }}
            />
          </Col>
        ) : (
          <Col
            style={{ height: "70vh" }}
            className="d-flex align-items-center justify-content-center shadow p-0  bg-dark rounded"
          >
            <div className="my-auto">
              <Button onClick={handleFileButtonClick} className="btn-lg">
                이미지 업로드
              </Button>
              <p className="text-white">또는 붙여넣기</p>
            </div>
          </Col>
        )}
      </Row>
      <Row className="my-2">
        <Col>
          <SelectBasic
            name={""}
            basiclist={itemlist}
            basicchoice={setChoiceItem}
          />
        </Col>
        <Col>
          <SelectBasic
            name={choiceitem}
            basiclist={raritylist}
            basicchoice={setChoiceRarity}
          />
        </Col>
        <Col>
          <Button onClick={fileupload} variant="dark">
            확인하기
          </Button>
        </Col>
      </Row>
    </Col>
  );
}

export default Imageuploder;
