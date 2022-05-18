var formData = [];

const wrapper = document.querySelector('.wrapper'),
      form    = wrapper.querySelectorAll('.form'),
      submitInput = form[0].querySelector('input[type="submit"]');
      
function getDataForm(e) {
    e.preventDefault();

    formData = new FormData(form[0]);
}

document.addEventListener('DOMContentLoaded', function(){
    submitInput.addEventListener('click', getDataForm, false);
}, false);

async function loadWeb3() {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        window.ethereum.enable();
    }
}

async function loadContract() {
    return await new window.web3.eth.Contract([
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "pName",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "dName",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "pDOB",
                    "type": "string"
                },
                {
                    "internalType": "int256",
                    "name": "pID",
                    "type": "int256"
                }
            ],
            "name": "set_patient_details",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "show_patient_details",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                },
                {
                    "internalType": "int256",
                    "name": "",
                    "type": "int256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ],'0x009024ede0816d63226ae71ef8954681d273524c');
}
async function printPatientDetails() {
    //let myPatient = [];
    updateStatus('fetching detalis...');
    const myPatient = await window.contract.methods.show_patient_details().call()
    //const myPatient = await window.contract.methods.myString().call();
    updateStatus(`<br> Name: ${myPatient[0]} <br> Doctor Name: ${myPatient[1]} <br> Date Of Birth: ${myPatient[2]} <br> Patient ID: ${myPatient[3]}`);
}

async function getCurrentAccount() {
    const accounts = await window.web3.eth.getAccounts();
    return accounts[0];
}

async function setDetails() {
    const pname = String(formData.get('pName'));
    const dname = String(formData.get('dName'));
    const dob = String(formData.get('pDOB'));
    const pid = parseInt(formData.get('pID'));
    updateStatus(`<br> Updating string with these details - 
                  <br> Name          - ${pname}
                  <br> Doctor Name   - ${dname}
                  <br> Date Of Birth - ${dob}
                  <br> Patient ID    - ${pid}`);
    const account = await getCurrentAccount();
    //const myString = 
    await window.contract.methods.set_patient_details(pname,dname,dob,pid).send({ from: account });
    updateStatus('Updated.');
}

async function load() {
    await loadWeb3();
    window.contract = await loadContract();
    updateStatus('Ready!');
}

function updateStatus(status) {
    const statusEl = document.getElementById('status');
    statusEl.innerHTML = status;
    console.log(status);
}
load();