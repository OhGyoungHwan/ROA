const setMetaTags = ({
  title = "",
  description = "",
  ogtitle = "",
  ogdescription = "",
  ogimageUrl = "",
  link = "",
}) => {
  //set title
  document
    .querySelector('meta[property="title"]')
    .setAttribute("content", `${title}`);

  //set description
  document
    .querySelector('meta[property="description"]')
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
