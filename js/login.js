const tabs = document.querySelectorAll(".tab-btn");
const roleInput = document.getElementById("userRole");
const emailField = document.getElementById('emailField');
const passwordField = document.getElementById('passwordField');
const rememberMe = document.getElementById('rememberMe');
const myForm = document.querySelector('.register-form');
emailField.value = Cookies.get("email") || "";
tabs.forEach(tab => {
    tab.addEventListener("click", () => {

        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        roleInput.value = tab.dataset.type;
        
    });
});

let show = async function users() {
    try{
        let response = await fetch("http://localhost:3000/users");
        return await response.json();
    }catch(err){
        console.log(err);
    }
}
if (localStorage.getItem("isLoggedIn") === "true") {
    window.location.href = "home.html";
}

myForm.addEventListener("submit" , async function(e) {
    e.preventDefault();
    let data = await show();
    console.log(data);
console.log(emailField.value);
console.log(passwordField.value);
    const user = data.find( u => u.email == emailField.value.trim() && u.password == passwordField.value.trim());
    if(user){
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("name", user.name);
        if(rememberMe.checked){
            Cookies.set("email", user.email, { expires: 7 });
            Cookies.set("username", user.name, { expires: 7 });
        }
        window.location.href = "home.html";
    } else {
        alert("Email or Password incorrect");
    }
})
