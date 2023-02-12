const GENDER_DEFAULT_VALUE = document.querySelector('#gender').value;
const TEAM_DEFAULT_VALUE = document.querySelector('#team').value;
const STATE_DEFAULT_VALUE = 'off';

// CONSTANT
let employeeId = 0;
let employee = {
  id: employeeId,
  name: '',
  gender: GENDER_DEFAULT_VALUE,
  team: TEAM_DEFAULT_VALUE,
  state: STATE_DEFAULT_VALUE,
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


// CONSTRUCTOR FUNCTION
function Employee({id, name, gender, team, state}) {

  if (!new.target) {
    throw new Error('생성자 함수를 생성하기 위해서는 new 키워드를 붙여주세요.')
  }

  this.id = id;
  this.name = name;
  this.gender = gender;
  this.team = team;
  this.state = state;

  this.setState = function (state) { 
    return this.state = state;
  }
}

// 근로자 시스템
function EmployeeForm() {
  if (!new.target) {
    throw new Error('생성자 함수를 생성하기 위해서는 new 키워드를 붙여주세요.')
  }

  this.checkValid = function (employee) {
    if (employee.name.length === 0) {
      alert('이름을 입력해주세요');
      return;
    }
  };


  this.reset = function () {
    const inputs = document.querySelectorAll('.form input');
  
    inputs.forEach(input => input.value = '');
    document.querySelector('#gender').value = 'male';
    document.querySelector('#team').value = 'frontend';
  }
}

// 메인 관리 시스템
function EmployeeTable() {
  if (!new.target) {
    throw new Error('생성자 함수를 생성하기 위해서는 new 키워드를 붙여주세요.')
  }

  this.update = function (employees) {
    const tbody = document.querySelector('tbody');
    const tr = document.querySelectorAll('tbody tr');

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

    if (tr.length > 1 && !tr[0].classList.contains('hidden')) {
      this.deleteDefaultValue(tr[0])
    }
  };

  this.deleteDefaultValue = function (firstTr) { 
    firstTr.classList.add('hidden');
  }
}

// 어드민 시스템
function AdminSystem() {
  if (!new.target) {
    throw new Error('생성자 함수를 생성하기 위해서는 new 키워드를 붙여주세요.')
  }

  this.employees = [];
  this.manageSystem = new EmployeeTable();
  this.employeeForm = new EmployeeForm();
  

  this.addEmployee = function (employee) {
    this.employees.push(employee);
  };

  this.updateChanges = function () {
    this.manageSystem.update(this.employees);
    this.saveAs();
    this.employeeForm.reset();
  };

  this.saveAs = function () {
    localStorage.setItem('employees', JSON.stringify(this.employees))
  };

  this.loadSavedInfo = function () { 
    const data = JSON.parse(localStorage.getItem('employees'));
    const savedEmployees = data.map(employee => new Employee(employee));

    if (data.length > 0) { 
      this.employees = savedEmployees;
      this.manageSystem.update(this.employees);
    }
  }
}


document.querySelector('#employee-form').addEventListener('change', (e) => { 
  employee = { ...employee, [e.target.name]: e.target.value };
})

document.querySelector('#employee-form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  adminSystem.employeeForm.checkValid(employee);
  adminSystem.addEmployee(new Employee(employee));
  adminSystem.updateChanges();

  alert(`${employee.name}님이 추가되었습니다.`);
  ++employeeId;
  employee = {
    id: employeeId,
    name: '',
    gender: GENDER_DEFAULT_VALUE,
    team: TEAM_DEFAULT_VALUE,
    state: STATE_DEFAULT_VALUE
  }

  return;
});

document.querySelector('tbody').addEventListener('click', (e) => {
  if (e.target.tagName !== 'BUTTON') return;

  const currentId = Number(e.target.parentElement.parentElement.dataset.id);

  adminSystem.employees.forEach(employee => {
    if (employee.id !== currentId) return;
    employee.setState('on');
    })
  
  adminSystem.updateChanges();
})

const adminSystem = new AdminSystem();
if (typeof localStorage.getItem('employees') === 'string') { 
  adminSystem.loadSavedInfo();
  employeeId += adminSystem.employees.length;
  employee.id += adminSystem.employees.length;
}
