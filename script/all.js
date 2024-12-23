//純切換頁面
const switchToSignUp = document.querySelector('.switchToSignUp');
const switchToSignIn2 = document.querySelector('.switchToSignIn2');
const signArea = document.querySelector('.signArea');
const signArea2 = document.querySelector('.signArea2');
switchToSignUp.addEventListener('click', function (e) {
  e.preventDefault();
  signArea.classList.add('displayNone');
  signArea2.classList.remove('displayNone');
});
switchToSignIn2.addEventListener('click', function (e) {
  e.preventDefault();
  signArea2.classList.add('displayNone');
  signArea.classList.remove('displayNone');
});
//註冊
const url = 'https://todoo.5xcamp.us';
const emailSignUp = document.querySelector('#emailSignUp');
const nameSignUp = document.querySelector('#nameSignUp');
const passwordSignUp = document.querySelector('#passwordSignUp');
const passwordSignUp2 = document.querySelector('#passwordSignUp2');
const emailHint2 = document.querySelector('.emailHint2');
const passwordHint2 = document.querySelector('.passwordHint2');
const switchToSignIn = document.querySelector('.switchToSignIn');
function signUpFunc() {
  let axios_password = '';
  if (
    passwordSignUp.value === passwordSignUp2.value &&
    passwordSignUp.value != '' &&
    passwordSignUp2.value != '' &&
    emailSignUp.value != ''
  ) {
    axios_password = passwordSignUp.value;
    axios_SignUp(emailSignUp, nameSignUp, axios_password);
  } else {
    passwordHint2.classList.add('passwordHintShow');
    passwordHint2.innerHTML = `<p>請輸入帳號並檢查密碼</p>`;
    emailHint2.classList.remove('emailHintShow');
    return;
  }
}
function axios_SignUp(emailSignUp, nameSignUp, axios_password) {
  axios
    .post(`${url}/users`, {
      user: {
        email: emailSignUp.value,
        nickname: nameSignUp.value,
        password: axios_password,
      },
    })
    .then(function (response) {
      console.log(response.data);
      emailHint2.classList.add('emailHintShow');
      passwordHint2.classList.remove('passwordHintShow');
      emailHint2.innerHTML = `<p>${response.data.message}！請點右下按鈕返回登入頁面</p>`;
    })
    .catch(function (error) {
      console.log(error.response);
      passwordHint2.classList.add('passwordHintShow');
      emailHint2.classList.remove('emailHintShow');
      passwordHint2.innerHTML = `<p>${error.response.data.error}</p>`;
    });
}
switchToSignIn.addEventListener('click', function (e) {
  e.preventDefault();
  signUpFunc();
});
//登入
const emailSignIn = document.querySelector('#emailSignIn');
const passwordSignIn = document.querySelector('#passwordSignIn');
const emailHint = document.querySelector('.emailHint');
const passwordHint = document.querySelector('.passwordHint');
function switchTabToAll() {
  //切換到tab"全部"並印出清單功能
  toggleStatus = 'all';
  updateList();
  tabLi.forEach(function (item) {
    item.classList.remove('active');
  });
  tabFirstLi.classList.add('active');
}
function signInFunc() {
  if (emailSignIn.value != '' && passwordSignIn.value != '') {
    emailHint.classList.remove('emailHintShow');
    axios_SignIn(emailSignIn, passwordSignIn);
  } else {
    passwordHint.classList.add('passwordHintShow');
    passwordHint.innerHTML = `<p>請輸入帳號與密碼！</p>`;
    return;
  }
}
let token = '';
const switchToTodo = document.querySelector('.switchToTodo');
const signUp = document.querySelector('.signUp');
const todoListArea = document.querySelector('.todoListArea');
function axios_SignIn(emailSignIn, passwordSignIn) {
  axios
    .post(`${url}/users/sign_in`, {
      user: {
        email: emailSignIn.value,
        password: passwordSignIn.value,
      },
    })
    .then(function (response) {
      console.log(response);
      // axios.defaults.headers.common['Authorization'] = response.headers.authorization;
      //axios自動帶入全域token功能(停用)
      token = response.headers.authorization;
      passwordHint.innerHTML = `<p>留白區域</p>`;
      emailHint.classList.add('emailHintShow');
      passwordHint.classList.remove('passwordHintShow');
      emailHint.innerHTML = `<p>${response.data.message}！3秒後自動進入TodoList系統...</p>`;
      switchToTodo.disabled = true;
      switchToTodo.classList.add('btn_active');
      const userWelcomeHint = document.querySelector('.todoListArea h4 span');
      if (response.data.nickname != '') {
        userWelcomeHint.innerHTML = `<p style="color: green;">${response.data.nickname}</p>`;
      } else {
        userWelcomeHint.innerHTML = '<p style="color: blue;">匿名訪客</p>';
      }
      switchTabToAll();
      setTimeout(function (e) {
        signUp.classList.add('displayNone');
        todoListArea.classList.remove('displayNone');
        emailSignIn.value = '';
        passwordSignIn.value = '';
        emailHint.innerHTML = `<p> 留白區域</p>`;
        emailHint.classList.remove('emailHintShow');
        switchToTodo.disabled = false;
        switchToTodo.classList.remove('btn_active');
      }, 3000);
    })
    .catch(function (error) {
      emailHint.innerHTML = `<p> 留白區域</p>`;
      passwordHint.innerHTML = `<p>${error.response.data.message}！請檢查帳密或註冊帳號</p>`;
      passwordHint.classList.add('passwordHintShow');
      emailHint.classList.remove('emailHintShow');
    });
}
switchToTodo.addEventListener('click', function (e) {
  e.preventDefault();
  signInFunc();
});
//登出
function axios_logOut() {
  axios
    .delete(`${url}/users/sign_out`, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => console.log(response))
    .catch((error) => console.log(error.response));
}
const switchToSignIn3 = document.querySelector('.switchToSignIn3');
const inputText = document.querySelector('#inputText');
switchToSignIn3.addEventListener('click', function (e) {
  e.preventDefault();
  if (confirm('確認登出系統嗎？(資料會短暫留存在本帳號)')) {
    axios_logOut();
    todoListArea.classList.add('displayNone');
    signUp.classList.remove('displayNone');
    inputText.value = '';
  }
});
//新增Todo
const addBtn = document.querySelector('#addBTN');
function addTodo(inputText) {
  axios
    .post(
      `${url}/todos`,
      {
        todo: {
          content: inputText.value,
        },
      },
      {
        headers: {
          Authorization: token,
        },
      }
    )
    .then(() => {
      updateList();
      switchTabToAll();
      inputText.value = '';
    })
    .catch((error) => console.log(error.response));
}
addBtn.addEventListener('click', function (e) {
  if (inputText.value.trim() === '') {
    return alert('請輸入待辦事項！');
  } else {
    addTodo(inputText);
  }
});
inputText.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    if (inputText.value.trim() === '') {
      return alert('請輸入待辦事項！');
    } else {
      addTodo(inputText);
    }
  }
});
//刪除、切換checked狀態、編輯（待完成）
const todoList = document.querySelector('#todoList');
todoList.addEventListener('click', multiFunc);
function multiFunc(e) {
  let id = e.target.closest('li').dataset.id;
  if (e.target.classList.value === 'delete') {
    e.preventDefault();
    deleteTodo(`${id}`);
  } else if (e.target.classList.value === 'checkpoint') {
    updateTodo(`${id}`);
  }
}
function deleteTodo(todoId) {
  axios
    .delete(`${url}/todos/${todoId}`, {
      headers: {
        Authorization: token,
      },
    })
    .then(() => updateList())
    .catch((error) => console.log(error.response));
}
function updateTodo(todoId) {
  axios
    .patch(
      `${url}/todos/${todoId}/toggle`,
      {},
      {
        headers: {
          Authorization: token,
        },
      }
    )
    .then(() => updateList())
    .catch((error) => console.log(error.response));
}
//切換tab並render清單
const tab = document.querySelector('#tab');
const tabLi = document.querySelectorAll('#tab li');
let array = '';
let array_tabWork = '';
let todoLength = '';
let toggleStatus = 'all';
tab.addEventListener('click', changeTab);
function changeTab(e) {
  toggleStatus = e.target.dataset.tab;
  tabLi.forEach(function (item) {
    item.classList.remove('active');
  });
  e.target.classList.add('active');
  updateList();
}
function updateList() {
  if (toggleStatus === 'all') {
    getTodo();
  } else if (toggleStatus === 'work') {
    getTodo_tabWork();
  } else {
    getTodo_tabDone();
  }
  (function getWorkNum() {
    axios
      .get(`${url}/todos`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        array = response.data.todos;
        const workNum = document.querySelector('#workNum');
        todoLength = array.filter((item) => item.completed_at === null);
        workNum.textContent = todoLength.length;
      })
      .catch((error) => console.log(error.response));
  })(); //立即調用函式 IIFE
}
function getTodo() {
  axios
    .get(`${url}/todos`, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => {
      array = response.data.todos;
      if (array.length === 0) {
        todoList.innerHTML = `<img src="image/noTodo.jpg" alt="No todos to display">`;
      } else {
        let str = '';
        let checkboxStatus = '';
        array.forEach(function (item) {
          if (item.completed_at === null) {
            checkboxStatus = '';
          } else {
            checkboxStatus = 'checked';
          }
          str += `<li data-id="${item.id}"> <label class="checkbox">
        <input type="checkbox" class="checkpoint" ${checkboxStatus}/>
        <span>${item.content}</span>
        </label>
        <a href="#" class="edit">編輯</a>
        <a href="#" class="delete"></a>
        </li>`;
        });
        todoList.innerHTML = str;
      }
    })
    .catch((error) => console.log(error.response));
}
function getTodo_tabWork() {
  axios
    .get(`${url}/todos`, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => {
      array = response.data.todos;
      array_tabWork = array.filter((item) => item.completed_at === null);
      if (array_tabWork.length === 0) {
        todoList.innerHTML = `<img src="image/allDone.jpg" alt="Todos were all done">`;
      } else {
        let str = '';
        let checkboxStatus = '';
        array_tabWork.forEach(function (item) {
          if (item.completed_at === null) {
            checkboxStatus = '';
          } else {
            checkboxStatus = 'checked';
          }
          str += `<li data-id="${item.id}"> <label class="checkbox">
        <input type="checkbox" class="checkpoint" ${checkboxStatus}/>
        <span>${item.content}</span>
        </label>
        <a href="#" class="edit">編輯</a>
        <a href="#" class="delete"></a>
        </li>`;
        });
        todoList.innerHTML = str;
      }
    })
    .catch((error) => console.log(error.response));
}
function getTodo_tabDone() {
  axios
    .get(`${url}/todos`, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => {
      array = response.data.todos;
      array_tabWork = array.filter((item) => item.completed_at !== null);
      if (array_tabWork.length === 0) {
        todoList.innerHTML = `<img src="image/allWorking.jpg" alt="Todos were all working">`;
      } else {
        let str = '';
        let checkboxStatus = '';
        array_tabWork.forEach(function (item) {
          if (item.completed_at === null) {
            checkboxStatus = '';
          } else {
            checkboxStatus = 'checked';
          }
          str += `<li data-id="${item.id}"> <label class="checkbox">
        <input type="checkbox" class="checkpoint" ${checkboxStatus}/>
        <span>${item.content}</span>
        </label>
        <a href="#" class="edit">編輯</a>
        <a href="#" class="delete"></a>
        </li>`;
        });
        todoList.innerHTML = str;
      }
    })
    .catch((error) => console.log(error.response));
}
//一鍵清除已完成
const deleteBTN = document.querySelector('#deleteBTN');
const tabFirstLi = document.querySelector('#tab li');
deleteBTN.addEventListener('click', function (e) {
  e.preventDefault();
  if (confirm('確定清除所有已完成嗎？')) {
    todoList.innerHTML = `<p style="font-size: 2rem; color: orange;">請稍候...</p>`;
    let array_allDone = array.filter((item) => item.completed_at != null);
    let array_allDone_Promises = array_allDone.map((item) => {
      return axios.delete(`${url}/todos/${item.id}`, {
        headers: {
          Authorization: token,
        },
      });
    });
    Promise.all(array_allDone_Promises) //等候API刪除全部已完成清單後一次性render
      .then(() => switchTabToAll())
      .catch((error) => console.log(error.response));
  }
});
