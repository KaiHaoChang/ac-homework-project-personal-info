const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'
const FRIENDS_PER_PAGE = 24

const friends = []
let filteredFriends = []

const dataPanel = document.querySelector('#data-panel')
const searchInput = document.querySelector('#search-input')
const searchForm = document.querySelector('#search-form')
const paginator = document.querySelector('#paginator')

axios.get(INDEX_URL)
  .then((response) => {
    friends.push(...response.data.results)
    renderPaginator(friends.length)
    renderFriendList(getFriendByPage(1))
  })

dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('#btn-show-friend')) {
    showFriendModal(Number(event.target.dataset.item))
  } else if (event.target.matches('#btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.item))
  }
})

searchForm.addEventListener('submit', function onSearchInputSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(keyword) ||
    friend.surname.toLowerCase().includes(keyword)
  )
  if (!keyword.length) {
    return alert('Please enter a valid keyword')
  }
  if (filteredFriends.length === 0) {
    return alert('Cannot find name/surname by keyword:' + keyword)
  }
  renderPaginator(filteredFriends.length)
  renderFriendList(getFriendByPage(1))
})

paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  renderFriendList(getFriendByPage(page))
})

function renderFriendList(data) {
  let rawHTML = ''
  data.forEach((item) => {
    rawHTML += `
  <div class="col-sm-3">
      <div class="card">
  <img src="${item.avatar}" class="card-img-top rounded" alt="avatar">
  <div class="card-body">
    <h5 class="card-title">${item.name} ${item.surname}</h5>
    <button type="button" id='btn-show-friend' class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" data-item='${item.id}'>
  More
</button>
<button type="button" id='btn-add-favorite' class="btn btn-danger"  data-item='${item.id}'>
   ♥ 
   </button>
  </div>
</div>
    </div> 
  `
  })
  dataPanel.innerHTML = rawHTML
}

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteFriends')) || []
  const friend = friends.find((friend) => friend.id === id)

  if (list.some((friend) => friend.id === id)) {
    return alert('Friend is in Favorite')
  }
  list.push(friend)
  localStorage.setItem('favoriteFriends', JSON.stringify(list))
  return alert('Favorite added')
}

function renderPaginator(amount) {
  const numberOfPage = Math.ceil(amount / FRIENDS_PER_PAGE)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPage; page++) {
    rawHTML += ` <li class="page-item"><a class="page-link" href="#" data-page='${page}'>${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

function getFriendByPage(page) {
  const data = filteredFriends.length ? filteredFriends : friends
  const startIndex = (page - 1) * FRIENDS_PER_PAGE
  return data.slice(startIndex, startIndex + FRIENDS_PER_PAGE)
}

function showFriendModal(id) {
  let friendName = document.querySelector('#friend-name')
  let friendGender = document.querySelector('#friend-gender')
  let friendAge = document.querySelector('#friend-age')
  let friendBirthday = document.querySelector('#friend-birthday')
  let friendEmail = document.querySelector('#friend-email')
  let friendRegion = document.querySelector('#friend-region')
  let friendAvatar = document.querySelector('#friend-avatar')
  friendAvatar.src = ''
  friendName.innerHTML = ''
  friendGender.innerHTML = ''
  friendAge.innerHTML = ''
  friendBirthday.innerHTML = ''
  friendEmail.innerHTML = ''
  friendRegion.innerHTML = ''

  axios.get(INDEX_URL + id)
    .then((response) => {
      const data = response.data
      console.log(data)
      friendAvatar.src = `${data.avatar}`
      friendName.innerHTML = `${data.name} ${data.surname}`
      friendGender.innerHTML = `➤Gender: ${data.gender}`
      friendAge.innerHTML = `➤Age: ${data.age}`
      friendBirthday.innerHTML = `➤Birthday: ${data.birthday}`
      friendEmail.innerHTML = `➤Email: ${data.email}`
      friendRegion.innerHTML = `➤Region: ${data.region}`
    })
}


