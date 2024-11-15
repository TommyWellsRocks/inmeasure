(function () {
  if (!document.getElementById("im-script")) {
    const element = document.createElement("script");
    element.type = "text/javascript";
    element.async = true;
    element.src = "http://localhost:3000/api/v1/script/{{APIKEY}}";
    element.id = "im-script";
    const first = document.getElementsByTagName("script")[0]!;
    first.parentNode!.insertBefore(element, first);
  }
})();
