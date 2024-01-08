const form = document.querySelector("form");

listenForSubmission(form);

function collectErrors(email, password)
{
    // Remove all previous error messages
    if (document.querySelector(".errors") !== null)
    {
        document.querySelector(".errors").remove()
    };

    // Re-init table of errors
    const errors = []

    // Test if E-mail and Password are empty
    if (isFieldEmpty(email))
    {
        errors.push("Le champ E-mail est obligatoire")
    }
    if (isFieldEmpty(password))
    {
        errors.push("Le champ Mot de passe est obligatoire")
    }

    // Test if E-mail is valid
    if (!isEmailValid(email) && email !== "")
    {
        errors.push("Le champ E-mail n\'est pas valide")
    }

    return errors;
}

function displayErrors(errors)
{
    // Create "div" to display the errors
    let div = document.createElement("div");
    div.classList.add("errors");

    let html = "";

    errors.forEach(error => {
        html += error + "<br>"
    });

    div.innerHTML = html;
    document.querySelector("form").appendChild(div);
}

function getToken(email, password)
{
    window.localStorage.clear();

    fetch('http://localhost:5678/api/users/login', 
    {
        method: 'POST',
        body: JSON.stringify({email, password}), // data we are sending in json format
        headers: {'Content-Type': 'application/json'} // we are sending json data
    })
    .then(response => response.json())
    .then(({userId, token}) => 
    {
        if (!userId)
        {
            alert("Accès refusé. Vérifiez votre e-mail et votre mot de passe")
            return;
        }
        // Token storage in the localstorage
        window.localStorage.setItem("token", token);
        // Display index.html
        document.location.href="index.html";
    })
}

function isEmailValid(email)
{
    let regex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    let result = regex.test(email);
    if(!result) {
        return false
    }
    return true
}

function isFieldEmpty(value)
{
    if (value != "")
    {
        return false
    }
    return true
}

function listenForSubmission(form)
{
    form.addEventListener("submit", (event) => 
    {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        const errors = collectErrors(email, password);

    if (errors.length > 0)
    {
        displayErrors(errors);
        return;
    }

    getToken(email, password);

    });
}