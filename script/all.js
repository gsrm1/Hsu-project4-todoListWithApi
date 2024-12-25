//一：切換登入與註冊頁面
//二：註冊
//三：登入
//四：登出
//五：新增Todo
//六：複雜功能> 刪除、切換checked狀態、編輯
//七：切換tab並render清單
//八：一鍵清除已完成

//DOM宣告集中區
//一
const switchToSignUp = document.querySelector('.switchToSignUp');
const switchToSignIn2 = document.querySelector('.switchToSignIn2');
const signArea = document.querySelector('.signArea');
const signArea2 = document.querySelector('.signArea2');
//二
const url = 'https://todoo.5xcamp.us';
const emailSignUp = document.querySelector('#emailSignUp');
const nameSignUp = document.querySelector('#nameSignUp');
const passwordSignUp = document.querySelector('#passwordSignUp');
const passwordSignUp2 = document.querySelector('#passwordSignUp2');
const emailHint2 = document.querySelector('.emailHint2');
const passwordHint2 = document.querySelector('.passwordHint2');
const switchToSignIn = document.querySelector('.switchToSignIn');
//三
const emailSignIn = document.querySelector('#emailSignIn');
const passwordSignIn = document.querySelector('#passwordSignIn');
const emailHint = document.querySelector('.emailHint');
const passwordHint = document.querySelector('.passwordHint');
const switchToTodo = document.querySelector('.switchToTodo');
const signUp = document.querySelector('.signUp');
const todoListArea = document.querySelector('.todoListArea');
const tabFirstLi = document.querySelector('#tab li');
let token = '';
//四
const switchToSignIn3 = document.querySelector('.switchToSignIn3');
//五
const addBtn = document.querySelector('#addBTN');
const inputText = document.querySelector('#inputText');
//六
const todoList = document.querySelector('#todoList');
//七
const tab = document.querySelector('#tab');
const tabLi = document.querySelectorAll('#tab li');
let array = '';
let array_tabWork = '';
let todoLength = '';
let toggleStatus = 'all';
//八
const deleteBTN = document.querySelector('#deleteBTN');

//一：切換登入與註冊頁面
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

//二：註冊
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
      passwordHint2.classList.add('passwordHintShow');
      emailHint2.classList.remove('emailHintShow');
      passwordHint2.innerHTML = `<p>${response.data.message}！請點右下按鈕返回登入頁面</p>`;
    })
    .catch(function (error) {
      console.log(error.response);
      passwordHint2.classList.add('passwordHintShow');
      emailHint2.classList.remove('emailHintShow');
      passwordHint2.innerHTML = `<p>${error.response.data.error}</p>`;
    });
}
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
switchToSignIn.addEventListener('click', function (e) {
  e.preventDefault();
  signUpFunc();
});

//三：登入
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
function switchTabToAll() {
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
switchToTodo.addEventListener('click', function (e) {
  e.preventDefault();
  signInFunc();
});

//四：登出
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
switchToSignIn3.addEventListener('click', function (e) {
  e.preventDefault();
  openLogoutAlert();
  function openLogoutAlert(e) {
    Swal.fire({
      title: '確認登出系統嗎？',
      text: '說明：資料會短暫留存在帳號',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '是，我要登出',
      cancelButtonText: '不登出',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: '已登出!',
          text: '歡迎再次登入使用本系統',
          icon: 'success',
        });
        axios_logOut();
        token = '';
        todoListArea.classList.add('displayNone');
        signUp.classList.remove('displayNone');
        inputText.value = '';
      } else if (result.dismiss === 'backdrop') {
      } else if (!result.isConfirmed) {
      }
    });
  }
});

//五：新增Todo
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
    return Swal.fire('請輸入待辦事項！');
  } else {
    addTodo(inputText);
  }
});
inputText.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    if (inputText.value.trim() === '') {
      return Swal.fire('請輸入待辦事項！');
    } else {
      addTodo(inputText);
    }
  }
});

//六：複雜功能> 刪除、切換checked狀態、編輯
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
function multiFunc(e) {
  let id = e.target.closest('li').dataset.id;
  if (e.target.classList.value === 'delete') {
    e.preventDefault();
    deleteTodo(`${id}`);
  } else if (e.target.classList.value === 'checkpoint') {
    updateTodo(`${id}`);
  } else if (e.target.classList.value === 'edit') {
    e.preventDefault();
    let editArea = e.target.previousElementSibling;
    if (editArea.classList.contains('displayShow')) {
      let editID = e.target.closest('li').dataset.id;
      let editInput =
        e.target.previousElementSibling.firstChild.children[0].children[0];
      axios
        .put(
          `${url}/todos/${editID}`,
          {
            todo: {
              content: editInput.value,
            },
          },
          {
            headers: {
              Authorization: token,
            },
          }
        )
        .then(() => updateList())
        .catch((error) => console.log(error.response));
      editArea.classList.remove('displayShow');
    } else {
      editArea.classList.add('displayShow');
    }
  }
}
todoList.addEventListener('click', multiFunc);

//七：切換tab並render清單
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
        <div class="editArea"><ul class="editList">
          <li><input class="editInput" type="text" placeholder="輸入修改內容後再點編輯"></li>
        </ul></div>
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
        <div class="editArea"><ul class="editList">
          <li><input class="editInput" type="text" placeholder="輸入修改內容後再點編輯"></li>
        </ul></div>
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
        <div class="editArea"><ul class="editList">
          <li><input class="editInput" type="text" placeholder="輸入修改內容後再點編輯"></li>
        </ul></div>
        <a href="#" class="edit">編輯</a>
        <a href="#" class="delete"></a>
        </li>`;
        });
        todoList.innerHTML = str;
      }
    })
    .catch((error) => console.log(error.response));
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
function changeTab(e) {
  toggleStatus = e.target.dataset.tab;
  tabLi.forEach(function (item) {
    item.classList.remove('active');
  });
  e.target.classList.add('active');
  updateList();
}
tab.addEventListener('click', changeTab);

//八：一鍵清除已完成
deleteBTN.addEventListener('click', function (e) {
  e.preventDefault();
  openDeleteAllAlert();
  function openDeleteAllAlert(e) {
    Swal.fire({
      title: '確定清除所有已完成嗎？',
      text: '說明：清除後會返回到"全部"頁籤',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '是的，請清除',
      cancelButtonText: '取消清除',
    }).then((result) => {
      if (result.isConfirmed) {
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
      } else if (result.dismiss === 'backdrop') {
      } else if (!result.isConfirmed) {
      }
    });
  }
});
