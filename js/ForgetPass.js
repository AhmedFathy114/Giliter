let email = document.getElementById('email');
let password = document.getElementById('password');
let repPassword = document.getElementById('repPassword');
let myForm = document.querySelector('.register-form');
function showError(message,i){
    let alertBox = document.getElementById(`errorAlert${i}`);
    alertBox.classList.remove("d-none");
    alertBox.innerText = message;
}
function hideError(i){
    let alertBox = document.getElementById(`errorAlert${i}`);
    alertBox.classList.add("d-none");
}
email.addEventListener("input", function(){
    hideError(1);
});
password.addEventListener("input", function(){
    hideError(2);
    hideError(3);
});
repPassword.addEventListener("input", function(){
    hideError(3);
    hideError(2);
});

myForm.addEventListener('submit' , async function(e){
    e.preventDefault();
    console.log("submit fired");
    if(password.value !== repPassword.value ){
        showError("Passwords do not match",2);
        showError("Passwords do not match",3);
        return;
    }

    if(password.value.trim() == "" && repPassword.value.trim() == "" ){
        showError("Enter A Valid Password",2);
        showError("Enter A Valid Password",3);
        repPassword.value = "";
        password.value = "";
        return;
    }

    let checkUser = await fetch(`http://localhost:3000/users`);
    let data = await checkUser.json();
    const user = data.find( u => u.email == email.value.trim());
    if(!user){
        showError("Email Not Exit Enter Valid Email",1);
        return;
    }else{

        let response = await fetch(`http://localhost:3000/users/${user.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password: password.value.trim()
            })
        });

        if(response.ok){
            alert("Password Change successful")
            window.location.href = "index.html";
        } else {
            alert("Failed to update");
        }

    }
});
