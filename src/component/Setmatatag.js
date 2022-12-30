const setMetaTags = ({
  title = "",
  metatitle = "",
  description = "",
  ogtitle = "",
  ogdescription = "",
  ogimageUrl = "",
  link = "",
}) => {
  document.querySelector("title").innerHTML = title;
  //set title
  document
    .querySelector('meta[name="title"]')
    .setAttribute("content", `${metatitle}`);

  //set description
  document
    .querySelector('meta[name="description"]')
    .setAttribute("content", description);

  //set title
  document
    .querySelector('meta[property="og:title"]')
    .setAttribute("content", `${ogtitle}`);

  //set description
  document
    .querySelector('meta[property="og:description"]')
    .setAttribute("content", ogdescription);

  //set images
  document
    .querySelector('meta[property="og:image"]')
    .setAttribute("content", ogimageUrl);

  //set url
  document
    .querySelector('meta[property="og:url"]')
    .setAttribute("content", window.location.href);

  document.querySelector('link[rel="canonical"]').setAttribute("href", link);
};

export default setMetaTags;
