(function (fine, illTellYou, doYou, know, the, muffin, man) {
  if (!illTellYou.getElementById("im-script")) {
    fine = doYou + "/" + know + "/" + the;
    muffin = illTellYou.createElement(know);
    muffin.type = "text/javascript";
    muffin.async = !0;
    muffin.src = fine;
    muffin.id = "im-script";
    man = illTellYou.getElementsByTagName(know)[0];
    man.parentNode.insertBefore(muffin, man);
  }
})(window, document, "http://localhost:3000/api/v1", "script", "{{APIKEY}}");
