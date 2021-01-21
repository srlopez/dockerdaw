
// MANEJO DEL DOM
var setUsersList = (ul, rows) => {
  ul.innerHTML = "";
  rows.forEach(user => {
    var li = document.createElement("li");
    li.innerHTML = '<a href="' + apiusers + '/'+user._id+'">['+user.name+' '+user.email+']</a>';
    ul.appendChild(li);
  });
}

var setUserForm = ( id , name, email ) =>{
  document.getElementById('_id').value=id
  document.getElementById('name').value=name
  document.getElementById('email').value=email
  document.getElementById('bUpdate').disabled=false
  document.getElementById('bNew').disabled=true
}

function onNew() { 
  api_post(
    document.getElementById('name').value, 
    document.getElementById('email').value
  )
}

function onUpdate () { 
  api_update_id(
    document.getElementById('_id').value, 
    document.getElementById('name').value, 
    document.getElementById('email').value
  )
  document.getElementById('bUpdate').disabled=true
  document.getElementById('bNew').disabled=false
}

// API
var api_post =  (name, email) => {
  console.log('post: ')
  var body = JSON.stringify({ name: name, email: email })
  console.log(body)

  fetch( apiusers, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: body
  }).then( response => {
    location.replace(location.pathname)
    return response
  }).then( response => console.log(response))
}

var api_get_all =  () => {
  console.log('get')
  fetch( apiusers, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log(response)
      if (response.ok) return response.json()
    })
    .then(data => {
      setUsersList(document.getElementById('users'), data)
      console.log(data)
    })
}

var api_update_id = (id, name, email) => {
  console.log('put: ')
  var body = JSON.stringify({  _id: id, name: name, email: email })
  console.log(body)

  fetch( apiusers, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: body
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      ////window.location.reload()
      location.replace(location.pathname)
      console.log(data)
    })
}

var api_delete_id =  (id) => {
  console.log('delete: '+id)
  fetch( apiusers + '/'+id, {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json'
    }
    // ,
    // body: JSON.stringify({
    //   _id: id
    // })
  }).then(response=> {
    console.log(response)
    //window.location.reload()
    location.replace(location.pathname)

  })
}

