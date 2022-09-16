let server_prefix = "http://localhost:8080/";
let url = `${server_prefix}/GetDiaryMovie`;
video.src = url;
video.onpause = (event) => image.setAttribute("href", toDataURL(video));
video.onseeked = (event) => image.setAttribute("href", toDataURL(video));
textarea.oninput = (event) => (g.innerHTML = textarea.value);
body.ondragover = (event) => event.preventDefault();

body.ondrop = async function (event) {
  event.preventDefault();

  for (const file of event.dataTransfer.files) {
    const img = await toImage(file);
    textarea.value += `\n<image x="0" y="0" width="${img.width}" height="${
      img.height
    }" href="${toDataURL(img)}" />\n`;
    textarea.oninput();
  }
};

button.onclick = async function (event) {
  const a = document.createElement("a");
  a.href = await toJPEG(svg);
  a.download = "thumbnail.jpg";
  a.click();
};

function toDataURL(target, type) {
  const canvas = document.createElement("canvas");
  canvas.width = target.width;
  canvas.height = target.height;
  canvas.getContext("2d").drawImage(target, 0, 0, target.width, target.height);

  return canvas.toDataURL(type);
}

async function toImage(file, width, height) {
  const img = new Image(width, height);
  img.src = URL.createObjectURL(file);
  await img.decode();

  return img;
}

async function toJPEG(svg) {
  const file = new Blob([svg.outerHTML], { type: "image/svg+xml" });
  const img = await toImage(
    file,
    svg.width.baseVal.value,
    svg.height.baseVal.value
  );

  return toDataURL(img, "image/jpeg");
}
