(function () {
  if (!document.getElementById("im-script")) {
    const element = document.createElement("script");
    element.type = "text/javascript";
    element.async = true;
    element.src = "https://www.inmeasure.com/api/v1/script/{{APIKEY}}";
    element.id = "im-script";
    document.head.appendChild(element);
  }
})();
