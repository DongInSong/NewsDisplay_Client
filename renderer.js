let title = document.getElementById("title");
let description = document.getElementById("description");
let setting = document.getElementById("setting");
let qrcode = document.getElementById("qrcode");
let save_timezone = document.getElementById("save_timezone");
let save_timezone_back = document.getElementById("save_timezone_back");
let save_category = document.getElementById("save_category");
let save_category_back = document.getElementById("save_category_back");
let save_keyword = document.getElementById("save_keyword");
let reset_keyword = document.getElementById("reset_keyword");
let brightness = document.querySelector("#brightness-setter");

//````````````````````````` SEND TEST ```````````````````````````
// saveCountry.addEventListener("click", (evt) => {
//   let obj = new Object();
//   obj.title = title.innerText;
//   obj.description = description.innerHTML;
//   // var content = JSON.stringify(obj);
//   // onInputValue 이벤트 송신
//   window.ipcRender.send("setting:save", obj);
// });
// saveCountry.onclick(window.ipcRender.send("setting:save", "a"))

brightness.addEventListener("change", (evt) => {
  window.ipcRender.send("brightness:update", brightness.value);
});

save_timezone.addEventListener("click", (evt) => {
  let obj = new Object();
  obj.timezone = getURLparam("timezone");
  window.ipcRender.send("setting:save", obj);
  save_timezone.disabled = true;
});

save_timezone_back.addEventListener("click", (evt) => {
  let obj = new Object();
  obj.timezone = getURLparam("timezone");
  document.getElementById("content").style.display = "block";
  document.getElementById("timezone").style.display = "none";
  document.getElementById("slider").style.display = "block";
  window.ipcRender.send("setting:save", obj);
  save_timezone.disabled = true;
  save_timezone_back.disabled = true;
  $(".setting-dropdown-list").removeClass("active");
});

save_category.addEventListener("click", (evt) => {
  let obj = new Object();
  obj.category = getURLparam("category");
  console.log(obj.category, "********");
  window.ipcRender.send("setting:save", obj);
  save_category.disabled = true;
});

save_category_back.addEventListener("click", (evt) => {
  let obj = new Object();
  obj.category = getURLparam("category");
  document.getElementById("content").style.display = "block";
  document.getElementById("category").style.display = "none";
  document.getElementById("slider").style.display = "block";
  window.ipcRender.send("setting:save", obj);
  save_category.disabled = true;
  save_category_back.disabled = true;
  $(".setting-dropdown-list").removeClass("active");
});

save_keyword.addEventListener("click", (evt) => {
  let obj = new Object();
  obj.keyword = getURLparam("keyword");
  if(obj.keyword.length >= 2)
    window.ipcRender.send("setting:save", obj);
  else window.ipcRender.send("setting:error", "keyword");
  save_keyword.disabled = true;
});

reset_keyword.addEventListener("click", (evt) => {
  let obj = new Object();
  obj.keyword = "-";
  window.ipcRender.send("setting:save", obj)
})

//````````````````````````` INVOKE TEST ```````````````````````````
qrcode.addEventListener("click", (evt) => {
  let content = "economy";
  // onInputValue 이벤트 송신
  window.ipcRender.invoke("setting:change", content).then((data) => {
    title.innerText = data.title;
    description.innerText = data.description;
    document.getElementById("qrcode").src = data.qrcode;
    document.getElementById("rsslogo").src =
      "./static/img/newslogo/" + data.rssname + ".jpg";
    console.log(data);
  });
});

//````````````````````````` RECEIVE TEST ```````````````````````````
window.ipcRender.receive("news:update", (data) => {
  title.innerText = data.title;
  description.innerText = data.description;
  document.getElementById("qrcode").src = data.qrcode;
  document.getElementById("rsslogo").src =
    "./static/img/newslogo/" + data.rssname + ".jpg";
});

window.ipcRender.receive("news:loading", () => {
  title.innerText = "검색 중입니다.";
  description.innerText = "";
  document.getElementById("qrcode").src = "./static/img/load_qrcode.webp";
  document.getElementById("rsslogo").src = "./static/img/newslogo/load2.gif";
});

window.ipcRender.receive("internet:disconnect", () => {
  title.innerText = "인터넷 연결을 확인하세요.";
  description.innerText = "";
  document.getElementById("qrcode").src = "./static/img/load_qrcode.webp";
  document.getElementById("rsslogo").src = "./static/img/newslogo/load2.gif";
});

window.ipcRender.receive("stdnotice:update", (data) => {
  var notice01 = [];
  var notice02 = [];
  var notice03 = [];
  for (var i = 0; i < data.length; i++) {
    if (data[i].type === "학사") {
      notice01.push({
        title: data[i].title,
        date: data[i].date,
      });
    } else if (data[i].type === "행사") {
      notice02.push({
        title: data[i].title,
        date: data[i].date,
      });
    } else if (data[i].type === "일반") {
      notice03.push({
        title: data[i].title,
        date: data[i].date,
      });
    }
  }
  console.log(notice01, notice02, notice03);

  document.getElementById("01_1").innerText = notice01[0].title;
  document.getElementById("01_2").innerText = notice01[1].title;
  document.getElementById("01_2").style.fontStyle = "normal";

  if (notice01.length > 2)
    document.getElementById("01_3").innerText = `...${notice01.length - 2}개`;

  document.getElementById("02_1").innerText = notice02[0].title;
  document.getElementById("02_2").innerText = notice02[1].title;
  document.getElementById("02_2").style.fontStyle = "normal";

  if (notice02.length > 2)
    document.getElementById("02_3").innerText = `...${notice02.length - 2}개`;

  document.getElementById("03_1").innerText = notice03[0].title;
  document.getElementById("03_2").innerText = notice03[1].title;
  document.getElementById("03_2").style.fontStyle = "normal";

  if (notice03.length > 2)
    document.getElementById("03_3").innerText = `...${notice03.length - 2}개`;

  // for (var i = 0; i < stdnotice.length; i++)
  //   document.getElementById(stdnotice[i]).innerText = data.stdnotice[i].title
});

window.ipcRender.receive("welfare:update", (data) => {
  document.getElementById(
    "01_1"
  ).innerText = `[${data[0].type} - ${data[0].target}] ${data[0].title}`;
  document.getElementById("01_2").innerText = data[0].description;
  document.getElementById("01_2").style.fontStyle = "italic";

  document.getElementById(
    "02_1"
  ).innerText = `[${data[1].type} - ${data[1].target}] ${data[1].title}`;
  document.getElementById("02_2").innerText = data[1].description;
  document.getElementById("02_2").style.fontStyle = "italic";

  document.getElementById(
    "03_1"
  ).innerText = `[${data[2].type} - ${data[2].target}] ${data[2].title}`;
  document.getElementById("03_2").innerText = data[2].description;
  document.getElementById("03_2").style.fontStyle = "italic";

  // for (var i = 0; i < stdnotice.length; i++)
  //   document.getElementById(stdnotice[i]).innerText = data.stdnotice[i].title
});

window.ipcRender.receive("timezone:update", (data) => {
  // console.log(data);
  window.clockInterval;
  if (window.clockInterval) clearInterval(window.clockInterval);
  setTimezone(data);
  clockInterval = setInterval(() => updateClock(currentTime.utc), 100);
});

function getURLparam(param) {
  var sPageURL = window.location.search.substring(1);
  sPageURL = decodeURIComponent(sPageURL);
  var sURLVariables = sPageURL.split("&");
  for (var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split("=");
    if (sParameterName[0] == param) {
      return sParameterName[1];
    }
  }
}
