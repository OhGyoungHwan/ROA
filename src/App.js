import "./css/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink, Route, Routes } from "react-router-dom";

import { Container, Nav, Navbar } from "react-bootstrap";

import Maxtable from "./pages/Maxtable";

import maximumoption from "./maximumoption.json";
import availableoption from "./availableoption.json";
import Home from "./pages/Home";

const itemlist = [...new Set(maximumoption.map((obj) => obj.종류))];

const COMPRESSIONOPTIONS = {
  maxSizeMB: 0.5,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
};

function findMaximumOptionList(choiceitem, choicerarity) {
  const choiceoptiontemp = maximumoption.filter(function (optionjson) {
    return optionjson.종류 === choiceitem && optionjson.희귀도 === choicerarity;
  })[0];

  return choiceoptiontemp;
}

function refineOption(optionlist, choiceoptionlist) {
  let allresist = 0;
  let resistidx = [];
  let resistmin = 100;

  const availableoptionlist = Object.keys(
    availableoption.filter(
      (obj) =>
        obj.종류 === choiceoptionlist.종류 &&
        obj.희귀도 === choiceoptionlist.희귀도
    )[0]
  ).filter((e) => e !== "종류" && e !== "희귀도");

  for (const idx in optionlist) {
    if (optionlist[idx].접두접미.includes("피해증폭"))
      optionlist[idx].유효 = "1";
    else if (optionlist[idx].접두접미.includes("연쇄번개"))
      optionlist[idx].유효 = "1";
    if (
      optionlist[idx].접두접미.includes("타격시") ||
      optionlist[idx].접두접미.includes("피격시") ||
      optionlist[idx].접두접미.includes("공격시") ||
      optionlist[idx].접두접미.startsWith("레벨")
    )
      optionlist[idx].최대수치 = "스킬옵션";
    else if (optionlist[idx].접두접미.includes("캐릭터레벨"))
      optionlist[idx].최대수치 = "항상으뜸";
    else if (
      optionlist[idx].접두접미.endsWith("저항") &&
      !optionlist[idx].접두접미.startsWith("마법")
    ) {
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
      유효: "",
    });
  }

  for (const idx in optionlist) {
    if (availableoptionlist.includes(optionlist[idx].접두접미)) {
      optionlist[idx].유효 = "1";
    }
  }
  return optionlist;
}

function responseToJson(response, choiceoptionobj) {
  const optionlist = Object.keys(response).map((value, idx) => {
    return {
      접두접미: value,
      현재수치: response[value],
      최대수치: choiceoptionobj[value],
      유효: "",
    };
  });
  return optionlist;
}

function optionToText(optionlist, choiceitem, choicerarity) {
  let text = `${choicerarity} ${choiceitem}:|`;
  for (const idx in optionlist) {
    text += ` ${optionlist[idx].접두접미} ${optionlist[idx].현재수치} |`;
  }
  return text;
}

function App() {
  return (
    <>
      <Navbar fixed="top" bg="dark" variant="dark">
        <Container>
          <NavLink to="/" className="navbar-brand">
            ROA
          </NavLink>
          <Nav className="me-auto">
            <NavLink to="/table" className="nav-link">
              옵션표
            </NavLink>
          </Nav>
        </Container>
      </Navbar>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              findMaximumOptionList={findMaximumOptionList}
              refineOption={refineOption}
              responseToJson={responseToJson}
              compressionOptions={COMPRESSIONOPTIONS}
              itemlist={itemlist}
              maximumoption={maximumoption}
              optionToText={optionToText}
            />
          }
        />

        <Route
          path="/table"
          element={
            <Maxtable maximumoption={maximumoption} itemlist={itemlist} />
          }
        />
      </Routes>
    </>
  );
}

export default App;
