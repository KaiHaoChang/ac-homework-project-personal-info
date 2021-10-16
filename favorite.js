const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'

const friends = JSON.parse(localStorage.getItem('favoriteFriends')) || []
let filteredFriends = []

const dataPanel = document.querySelector('#data-panel')


dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('#btn-show-friend')) {
    showFriendModal(Number(event.target.dataset.item))
  } else if (event.target.matches('#btn-remove-favorite')) {
    removeFromFavorite(event.target.dataset.item)
  }
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
  <button type="button" id='btn-remove-favorite' class="btn btn-danger" data-item='${item.id}'>
  X
</button>
  </div>
</div>
    </div> 
  `
  })
  dataPanel.innerHTML = rawHTML
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

function removeFromFavorite(id) {
  const friendIndex = friends.findIndex((friend) => friend.id === id)
  friends.splice(friendIndex, 1)
  localStorage.setItem('favoriteFriends', JSON.stringify(friends))
  renderFriendList(friends)
}


console.log(friends)
renderFriendList(friends)