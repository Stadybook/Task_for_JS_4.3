const template = document.querySelector('.search__input')
const list = document.querySelector('.search__list')
const selectedRepositories = document.querySelector('.selected')
const gitHub = new URL('https://api.github.com/search/repositories?q=Q')




const debounce = (fn, debounceTime) => {
    let timer
    return function(...args){
      clearTimeout(timer)
      timer = setTimeout(() => {
        fn.apply(this, args)
      }, debounceTime)
    }
}

template.addEventListener('input', debounce(promtInTemplate,350)) 


async function promtInTemplate(){
    let entry = template.value
    if (entry === '') {
    clean(list)
    return
    }
    gitHub.searchParams.append('q', entry)
    try {
        let response = await fetch(gitHub)
        if (response.ok) {
            let gits = await response.json()
            showResults(gits.items)
        }
        else {
            console.log('null')
            return null
        }
      } 
    catch(error) {
        return null;
    }
}

function clean(element) {
    element.innerHTML=''
}

function showResults(gits) {
    clean(list)

    for(i = 0; i < 5; i++){
        let name = gits[i].name
        let owner = gits[i].owner.login
        let stars = gits[i].stargazers_count
    
        let item = `<div class="search__item" data-name='${name}' data-owner='${owner}' data-stars='${stars}'>${name}</div>`
        list.innerHTML += item
    }   
}

list.addEventListener('click', function(e){
    addRepository(e.target)
})

selectedRepositories.addEventListener('click', function(e){
    if (!e.target.classList.contains('btn')) return

    e.target.parentElement.remove();  
})


function addRepository(target) {
    let name = target.dataset.name
    let owner = target.dataset.owner
    let stars = target.dataset.stars

    selectedRepositories.innerHTML += `<div class="selected__item">Name: ${name}<br>Owner: ${owner}<br>Stars: ${stars} <button class="btn"></button></div>`
    clean(list)
    template.value = ''
}


