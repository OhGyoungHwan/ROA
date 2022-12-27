import React from "react";

const GoogleAdvertise = ({
  className = "adsbygoogle",
  client = "ca-pub-7450770762856847",
  slot = "8384451580",
  format = "auto",
  responsive = "true",
  layoutKey = "",
}) => {
  React.useEffect(() => {
    window.onload = function () {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        console.log("Advertise is pushed");
      } catch (e) {
        if (process.env.NODE_ENV !== "production")
          console.error("AdvertiseError", e);
      }
    };
  }, []);
  return (
    <ins
      className={className}
      style={{
        display: "block",
      }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive}
      data-ad-layout-key={layoutKey}
    />
  );
};

export default GoogleAdvertise;
