export default function (src) {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = src;
    image.addEventListener('load', () => resolve(image));
  });
}
