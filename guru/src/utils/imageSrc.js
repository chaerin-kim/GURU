import { url } from "../store/ref";

export const fallbackProfileImage = `${process.env.PUBLIC_URL}/img/common/no_img.jpg`;

export const getProfileImageSrc = (image) => {
  if (!image) {
    return fallbackProfileImage;
  }

  if (/^(https?:)?\/\//i.test(image) || image.startsWith("data:") || image.startsWith("blob:")) {
    return image;
  }

  if (image.startsWith("img/")) {
    return `${process.env.PUBLIC_URL}/${image}`;
  }

  if (image.startsWith("/")) {
    return image;
  }

  return `${url}/${image}`;
};
