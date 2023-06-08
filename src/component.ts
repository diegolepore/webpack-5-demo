
export default ( text = "Hello World" ) => {
  const element = document.createElement('h1')
  element.className = 'rounded bg-white border max-w-md m-4 p-4 text-blue-700'
  element.innerHTML = text
  element.onclick = () =>
    import (/* webpackChunkName: "optional-name" */ './lazy')
      .then((lazy) => {
        element.textContent = lazy.default
      })
      .catch((err) => console.error(err))
      
  return element
}