console.log("кукареку");


function User_Login() {

    const form_reg = document.querySelector('#form_reg');
    const data_reg = new FormData(form_reg);

    console.log("User_Login: " + JSON.stringify(data_reg));

}

function User_Register(event) {

    event.preventDefault();

    const data_reg = new FormData(document.forms.form_reg);
    const q_str = new URLSearchParams(data_reg).toString();

    console.log("User_Register: " + q_str);

    const opt = {
        method: 'POST',
        body: q_str,
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
          }
    };

    fetch('/api/v1/user', opt)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
        })



}



document.addEventListener("DOMContentLoaded", () => {


    let btn2 = document.querySelector("#btn_reg");
    btn2.addEventListener('click', User_Register);

});

