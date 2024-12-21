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
// 註冊
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
      console.log(response);
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
// let token = '';
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
      axios.defaults.headers.common['Authorization'] = response.headers.authorization;
      // token = response.headers.authorization;
      passwordHint.innerHTML = `<p>123</p>`;
      emailHint.classList.add('emailHintShow');
      passwordHint.classList.remove('passwordHintShow');
      emailHint.innerHTML = `<p>${response.data.message}！3秒後自動進入TodoList系統...</p>`;
      switchToTodo.disabled = true;
      switchToTodo.classList.add('btn_active');
      const userWelcomeHint = document.querySelector('.todoListArea h4 span');
      if (response.data.nickname != '') {
        userWelcomeHint.innerHTML = `<p style="color: red;">${response.data.nickname}</p>`;
      } else {
        userWelcomeHint.innerHTML = '<p style="color: green;">匿名訪客</p>';
      }
      getTodo();
      setTimeout(function (e) {
        signUp.classList.add('displayNone');
        todoListArea.classList.remove('displayNone');
        emailSignIn.value = '';
        passwordSignIn.value = '';
        emailHint.innerHTML = `<p>123</p>`;
        emailHint.classList.remove('emailHintShow');
        switchToTodo.disabled = false;
        switchToTodo.classList.remove('btn_active');
      }, 3000);
    })
    .catch(function (error) {
      emailHint.innerHTML = `<p>123</p>`;
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
    .delete(`${url}/users/sign_out`)
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
//render清單
const addBtn = document.querySelector('#addBTN');
const todoList = document.querySelector('#todoList');
function getTodo() {
  axios
    .get(`${url}/todos`)
    .then((response) => {
      let array = response.data.todos;
      if (array.length === 0) {
        todoList.innerHTML = `<img src="/image/noTodo.jpg" alt="noTodo pic"></img>`;
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
getTodo();
//新增Todo
function addTodo(inputText) {
  axios
    .post(
      `${url}/todos`,
      {
        todo: {
          content: inputText.value,
        },
      }
    )
    .then(() => getTodo())
    .catch((error) => console.log(error.response));
}
addBtn.addEventListener('click', function (e) {
  if (inputText.value.trim() === '') {
    return alert('請輸入待辦事項！');
  } else {
    addTodo(inputText);
    inputText.value = '';
  }
});
inputText.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    if (inputText.value.trim() === '') {
      return alert('請輸入待辦事項！');
    } else {
      addTodo(inputText);
      inputText.value = '';
    }
  }
});
//刪除、切換checked狀態、編輯（待完成）
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
    .delete(`${url}/todos/${todoId}`)
    .then(() => getTodo())
    .catch((error) => console.log(error.response));
}
function updateTodo(todoId) {
  axios
    .patch(
      `${url}/todos/${todoId}/toggle`, {}
    )
    .then(() => getTodo())
    .catch((error) => console.log(error.response));
}
// 一、初始陣列(使用localStorage儲存資料在瀏覽器)
// let todoData = localStorage.getItem("todoData"); //從updateList內取資料
// todoData = todoData ? JSON.parse(todoData) : [
//       { text: "學習JavaScript", id: new Date().getTime(), checked: "" },
//       { text: "繳交TodoList作業", id: new Date().getTime() + 1, checked: "checked" },
//       { text: "找到一份前端工程師工作", id: new Date().getTime() + 2, checked: "" }
//     ];
// let todoData = [];
// //二、新增Todo
// const addBtn = document.querySelector('#addBTN');
// addBtn.addEventListener('click', function (e) {
//   addTodo();
// });
// inputText.addEventListener('keypress', function (e) {
//   if (e.key === 'Enter') {
//     addTodo();
//   }
// });
// function addTodo() {
//   const todo = {
//     text: inputText.value,
//     id: new Date().getTime(),
//     checked: '',
//   };
//   if (todo.text.trim() === '') {
//     return alert('請輸入待辦事項！');
//   }
//   todoData.unshift(todo);
//   inputText.value = '';
//   switchTabToAll();
// }
// //三、渲染
// const todoList = document.querySelector('#todoList');
// function renderList(array) {
//   let str = '';
//   array.forEach(function (item) {
//     str += `<li data-id="${item.id}">
//     <label class="checkbox">
//     <input type="checkbox" name="checkbox" ${item.checked}/>
//     <span>${item.text}</span>
//     </label>
//     <a href="#" class="delete" ></a>
//     </li>`;
//   });
//   todoList.innerHTML = str;
// }
//四、tab切換
const tab = document.querySelector('#tab');
const tabLi = document.querySelectorAll('#tab li');
let toggleStatus = 'all';
tab.addEventListener('click', changeTab);
function changeTab(e) {
  toggleStatus = e.target.dataset.tab;
  tabLi.forEach(function (item) {
    item.classList.remove('active');
  });
  e.target.classList.add('active');
  // updateList();
}
// //五、刪除個別清單 & 切換checked狀態
// todoList.addEventListener('click', deleteAndChecked);
// function deleteAndChecked(e) {
//   let id = e.target.closest('li').dataset.id;
//   if (e.target.classList.value === 'delete') {
//     e.preventDefault();
//     todoData = todoData.filter((item) => item.id != id);
//   } else {
//     todoData.forEach(function (item, index) {
//       if (item.id == id) {
//         //id為字串需轉型故使用一般相等比較運算子
//         if (todoData[index].checked === 'checked') {
//           todoData[index].checked = '';
//         } else {
//           todoData[index].checked = 'checked';
//         }
//       }
//     });
//   }
//   updateList();
// }
// //六、切換tab後更新清單
// function updateList() {
//   let showData = [];
//   if (toggleStatus === 'all') {
//     showData = todoData;
//   } else if (toggleStatus === 'work') {
//     showData = todoData.filter((item) => item.checked === '');
//   } else {
//     showData = todoData.filter((item) => item.checked === 'checked');
//   }
//   const workNum = document.querySelector('#workNum');
//   let todoLength = todoData.filter((item) => item.checked === '');
//   workNum.textContent = todoLength.length;
//   renderList(showData);
//   localStorage.setItem('todoData', JSON.stringify(todoData));
//   //提交資料到localStorage
//   //stringify方法將JavaScript值轉換成JSON字串(String)
// }
// //七、印出初始清單
// updateList();
// //八、切換tab到"全部"
// function switchTabToAll() {
//   toggleStatus = 'all';
//   tabLi.forEach(function (item) {
//     item.classList.remove('active');
//   });
//   tabFirstLi.classList.add('active');
//   updateList();
// }
// //九、一鍵清除已完成清單
// const deleteBTN = document.querySelector('#deleteBTN');
// const tabFirstLi = document.querySelector('#tab li');
// deleteBTN.addEventListener('click', function (e) {
//   e.preventDefault();
//   if (confirm('確定清除所有已完成嗎？')) {
//     todoData = todoData.filter((item) => item.checked != 'checked');
//     switchTabToAll();
//   }
// });
// //十、清除localStorage儲存資料恢復預設清單
// // const clearLocalStorageBTN = document.querySelector("#clearLocalStorageBTN");
// // clearLocalStorageBTN.addEventListener("click", function (e) {
// //   if (confirm("確定清除儲存資料恢復預設內容嗎？")) {
// //     localStorage.removeItem("todoData");
// //     todoData = [
// //       { text: "學習JavaScript", id: new Date().getTime(), checked: "" },
// //       {
// //         text: "繳交TodoList作業",
// //         id: new Date().getTime() + 1,
// //         checked: "checked"
// //       },
// //       {
// //         text: "找到一份前端工程師工作",
// //         id: new Date().getTime() + 2,
// //         checked: ""
// //       }
// //     ];
// //     switchTabToAll();
// //     alert("已清除儲存資料並恢復預設內容");
// //   }
// // });
