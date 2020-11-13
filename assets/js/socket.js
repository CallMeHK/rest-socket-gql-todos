// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "assets/js/app.js".

// To use Phoenix channels, the first step is to import Socket,
// and connect at the socket path in "lib/web/endpoint.ex".
//
// Pass the token on params as below. Or remove it
// from the params if you are not using authentication.
import 'regenerator-runtime/runtime.js'
import { Socket } from 'phoenix'

let socket = new Socket('/socket') //, {params: {token: window.userToken}})
socket.connect()

let channel = socket.channel('values:public', {})
channel
  .join()
  .receive('ok', (resp) => {
    console.log('Joined successfully', resp)
  })
  .receive('error', (resp) => {
    console.log('Unable to join', resp)
  })

function $(elt) {
  return document.querySelector(elt)
}

async function getAll() {
  return new Promise((res, rej) => {
    channel.push('get_all_values', {}).receive('ok', (msg) => res(msg))
  })
}

async function create(todo) {
  return new Promise((res, rej) => {
    channel
      .push('create_value', { value: todo })
      .receive('ok', (msg) => res(msg))
  })
}

async function del(id) {
  return new Promise((res, rej) => {
    channel.push('delete_value', { id })
      .receive('ok', (msg) => res(msg))
  })
}

async function update(id, newTodo) {
  return new Promise((res, rej) => {
    channel.push('update_value', { id: id, value: newTodo })
      .receive('ok', (msg) => res(msg))
  })
}

const todos = {
  getAll: getAll,
  create: create,
  delete: del,
  update: update,
}

function addToList({ id, value }) {
  const todoList = $('#todo-list')
  const newTodo = document.createElement('li')
  newTodo.innerText = value
  newTodo.id = id
  newTodo.setAttribute('style', 'cursor: pointer')
  todoList.appendChild(newTodo)
}

function removeFromList(elt) {
  elt.remove()
}

let fallback
function editListElement(elt) {
  const value = elt.innerText
  const id = elt.id

  fallback = {
    value: value,
    id: id,
  }

  const input = document.createElement('input')
  input.value = value
  input.id = id

  elt.parentNode.replaceChild(input, elt)
  return input
}

function removeInputs(newValues) {
  if (!newValues) return
  let input = $('#todo-list > input')
  if (!input) return
  const listElt = document.createElement('li')
  listElt.innerText = newValues.value
  listElt.id = newValues.id
  listElt.setAttribute('style', 'cursor: pointer')

  input.parentNode.replaceChild(listElt, input)
  fallback = undefined
}

function updateList({id, value}){
  $(`[id="${id}"]`).innerText = value
}

const dom = {
  addToList: addToList,
  removeFromList: removeFromList,
  editListElement: editListElement,
  removeInputs: removeInputs,
  updateList: updateList
}

$('#todo-creator').addEventListener('keydown', function (e) {
  if (e.target.value !== '' && e.key === 'Enter') {
    todos.create($('#todo-creator').value).then(function (res) {
      const { id, value } = res
      dom.addToList({ id, value })
      $('#todo-creator').value = ''
    })
  }
})

$('#todo-list').addEventListener('contextmenu', function (e) {
  e.preventDefault()
  if (e.target.tagName === 'UL') return
  const confirmResponse = true //confirm('Do you want to delete this todo?')
  if (confirmResponse) {
    todos.delete(parseInt(e.target.id)).then(function (res) {
      if (res.success) dom.removeFromList(e.target)
    })
  }
})

$('#todo-list').addEventListener('click', function (e) {
  dom.removeInputs(fallback)
  if (e.target.tagName === 'INPUT') return true
  e.preventDefault()
  if (e.target.tagName === 'UL') return
  const input = dom.editListElement(e.target)
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') return dom.removeInputs(fallback)
    if (e.key === 'Enter' && e.target.value !== '') {
      todos.update(parseInt(e.target.id), e.target.value).then(function (res) {
        console.log(res)
        if (res.success)
          dom.removeInputs({ id: res.updated.id, value: res.updated.value })
      })
    }
  })
  input.focus()
})

channel.on("event:create_value", dom.addToList)
channel.on("event:delete_value", msg => dom.removeFromList($(`[id='${msg.deleted}']`)))
channel.on("event:update_value", msg => dom.updateList(msg.updated))

export default socket

// When you connect, you'll often need to authenticate the client.
// For example, imagine you have an authentication plug, `MyAuth`,
// which authenticates the session and assigns a `:current_user`.
// If the current user exists you can assign the user's token in
// the connection for use in the layout.
//
// In your "lib/web/router.ex":
//
//     pipeline :browser do
//       ...
//       plug MyAuth
//       plug :put_user_token
//     end
//
//     defp put_user_token(conn, _) do
//       if current_user = conn.assigns[:current_user] do
//         token = Phoenix.Token.sign(conn, "user socket", current_user.id)
//         assign(conn, :user_token, token)
//       else
//         conn
//       end
//     end
//
// Now you need to pass this token to JavaScript. You can do so
// inside a script tag in "lib/web/templates/layout/app.html.eex":
//
//     <script>window.userToken = "<%= assigns[:user_token] %>";</script>
//
// You will need to verify the user token in the "connect/3" function
// in "lib/web/channels/user_socket.ex":
//
//     def connect(%{"token" => token}, socket, _connect_info) do
//       # max_age: 1209600 is equivalent to two weeks in seconds
//       case Phoenix.Token.verify(socket, "user socket", token, max_age: 1209600) do
//         {:ok, user_id} ->
//           {:ok, assign(socket, :user, user_id)}
//         {:error, reason} ->
//           :error
//       end
//     end
//
