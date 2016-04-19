
module.exports = function(){
  if(typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined' && typeof window.sessionStorage.getItem !== 'undefined'){
      return window.sessionStorage.getItem
  }

  return undefined
}
