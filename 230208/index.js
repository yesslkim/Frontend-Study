// CONSTANT
let employeeId = 0;

let employee = {
  id: employeeId,
  name: '',
  gender: '',
  team: ''
}

const employees = [];

// CONSTRUCTOR FUNCTION
function Employee(id, name, gender, team) {

  if (!new.target) {
    return new Employee(id, name, gender, team);
  }

  this.id = id;
  this.name = name;
  this.gender = gender;
  this.team = team;
  this.state = 'off';

  this.setState = function (state) { 
    return this.state = state;
  }
}

const translateToKor = (eng) => { 
  const dictionary = {
    frontend: '프론트엔드',
    backend: '백엔드',
    publisher: '퍼블리셔',
    pm: 'PM',
    design: '디자인',
    on: '출근',
    off: '출근 전',
    'day-off' : '휴가'
  }

  return dictionary[eng];
}

const resetForm = () => { 
  const inputs = document.querySelectorAll('.form input');

  inputs.forEach(input => input.value = '');
  document.querySelector('#gender').value = 'male';
  document.querySelector('#team').value = 'frontend';
}

const deleteDefaultState = () => { 
  const tr = document.querySelectorAll('tbody tr');

  if (tr.length > 1 && !tr[0].classList.contains('hidden')) {
    tr[0].classList.add('hidden');
   }
}

const updateTable = () => { 
  const tbody = document.querySelector('tbody');

  tbody.innerHTML = '';

  employees.forEach(employee => {
    const team = translateToKor(employee.team);
    const state = translateToKor(employee.state);

    const baseTempl = `
    <tr data-id='${employee.id}'>
      <td><button type="button">출근하기</button></td>
      <td>${employee.name}</td>
      <td>${team}</td>
      <td class=${employee.state}>${state}</td>
    </tr>
    `;

    tbody.innerHTML += baseTempl;
  })

  deleteDefaultState();
  resetForm();
}

document.querySelector('#employee-form').addEventListener('change', (e) => { 
  employee = { ...employee, [e.target.name]: e.target.value };
})

document.querySelector('#employee-form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  if (employee.name.length === 0) {
    alert('이름을 입력해주세요');
    return;
  }

  document.querySelectorAll('.form select').forEach(select => {
    if (employee[select.name] !== '') return;

    employee = { ...employee, [select.name]: select.value };
  })

  const { id, name, gender, team } = employee;
  const newEmployee = new Employee( id, name, gender, team);

  employees.push(newEmployee);
  updateTable();

  alert(`${employee.name}님이 추가되었습니다.`);

  ++employeeId;
  employee = {
    id: employeeId,
    name: '',
    gender: '',
    team: ''
  };
  
  return;
});

document.querySelector('tbody').addEventListener('click', (e) => {
  if (e.target.tagName !== 'BUTTON') return;

  const currentId = Number(e.target.parentElement.parentElement.dataset.id);

  employees.forEach(employee => {
    if (employee.id !== currentId) return;
      employee.setState('on');
    })
  
    updateTable();
})