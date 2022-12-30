import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import setMetaTags from "../component/Setmatatag";
import Tableaccordion from "../component/Tableaccordion";
function Maxtable({ maximumoption, itemlist }) {
  React.useEffect(() => {
    setMetaTags({
      title: "최대옵션표",
      metatitle: "최대옵션표",
      description: "레저렉션2 모든 종류 아이템 최대수치 표",
      ogtitle: "최대옵션표",
      ogdescription: "레저렉션2 모든 종류 아이템 최대수치 표",
      ogimageUrl:
        "https://lh3.googleusercontent.com/u/0/drive-viewer/AFDK6gMTVfARBUAga-wPUx1xVyazlI1YCzbuutGckXdXGq4JNV-Qt3K6J_nT9JAFqzx1O_Ofx5345-EciGZjeyMnqpUGuydH=w1920-h913",
      link: "https://diablo2i2o.com/table",
    });
  }, []);
  return <Tableaccordion maximumoption={maximumoption} itemlist={itemlist} />;
}

export default Maxtable;
