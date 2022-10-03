// import img from './programmer-desktop.jpg'

export default ( imageUrl = "" ) => {
  const element: HTMLImageElement = document.createElement('img')
  element.className = 'w-full'
  // element.srcset = img
  element.src =  String(new URL("./images/programmer-desktop.jpg", import.meta.url))
  return element
}
