const formContent =`
  <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSdlBxXjbnWmk6TT2gojTAr_bQjh2HmU6Nunm0edZkQIG-QP0w/viewform?embedded=true" width="640" height="709" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>
`;

const divElem = document.createElement("div");
divElem.classList.add("g_form");
divElem.innerHTML = formContent;

document.querySelector(".google_form").append(divElem);