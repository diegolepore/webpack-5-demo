export default ( text = "Hello World" ) => {
  const element = document.createElement('h1')
  element.className = 'rounded bg-white border max-w-md m-4 p-4 text-blue-700'
  element.innerHTML = text
  return element
}