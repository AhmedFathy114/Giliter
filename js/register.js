let myForm = document.querySelector('.register-form');
let name = document.getElementById('name');
let email = document.getElementById('email');
let phone = document.getElementById('phone');
let Shipping = document.getElementById('Shipping');
let password = document.getElementById('password');
let repPassword = document.getElementById('repPassword');

function showError(message,i){
    let alertBox = document.getElementById(`errorAlert${i}`);
    alertBox.classList.remove("d-none");
    alertBox.innerText = message;
}
function hideError(i){
    let alertBox = document.getElementById(`errorAlert${i}`);
    alertBox.classList.add("d-none");
}

name.addEventListener("input", function(){
    hideError(1);
});

email.addEventListener("input", function(){
    hideError(2);
});

phone.addEventListener("input", function(){
    hideError(3);
});
Shipping.addEventListener("input", function(){
    hideError(4);
});
password.addEventListener("input", function(){
    hideError(5);
    hideError(6);
});
repPassword.addEventListener("input", function(){
    hideError(6);
    hideError(5);
});

myForm.addEventListener('submit', async function (e) {

    e.preventDefault();

    if(password.value !== repPassword.value ){
        showError("Passwords do not match",5);
        showError("Passwords do not match",6);
        return;
    }
    if(password.value.trim() == "" && repPassword.value.trim() == "" ){
        showError("Enter A Valid Password",5);
        showError("Enter A Valid Password",6);
        repPassword.value = "";
        password.value = "";
        return;
    }

    let checkUser = await fetch(`http://localhost:3000/users?email=${email.value}`);
    let data = await checkUser.json();
    if(data.length > 0){
    showError("Email already exists",2);
    return;
    }
    let nameReg = /^[a-zA-Z]{3,100}$/;
    if(name.value == "" || !nameReg.test(name.value)){
    showError("Enter A Valid Name",1);
    return;
    }
    let phoneReg = /^\+2(012|010|011)\d{8}$/;
    if(phone.value == "" || !phoneReg.test(phone.value)){
    showError("Enter A Valid phone",3);
    return;
    }

    let response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name.value,
            email: email.value,
            password: password.value,
            phone: phone.value,
            ShippingAddress: Shipping.value
        })
    });

    if(response.ok){
            alert("Regestration successful")
            window.location.href = "index.html";
        } else {
            alert("Failed to update");
        }

});