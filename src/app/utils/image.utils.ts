export function getImageURL(name: string) {
  return name.toLocaleLowerCase().replace(/\s+/g, '-');
}