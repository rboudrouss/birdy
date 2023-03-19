const ImageHelper = {
  get64fromBlob,
  getBlobfrom64,
  postBlob,
  fetchBlob,
  fetchImgById,
};
export default ImageHelper;

async function get64fromBlob(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

function getBlobfrom64(base64: string) {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = Buffer.from(arr[1], "base64").toString("binary");
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

async function postBlob(blob: Blob | File, url: string) {
  let data = new FormData();
  data.append("file", blob);
  let response = await fetch(url, {
    method: "POST",
    body: data,
  });
  return response;
}

async function fetchBlob(url: string) {
  return await fetch(url).then((r) => r.blob());
}

async function fetchImgById(id: string, server?: string) {
  return await fetchBlob(`${server ?? process.env.IMG_SERVER ?? ""}/${id}.jpg`);
}
