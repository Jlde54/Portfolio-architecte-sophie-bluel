const works = await get("http://localhost:5678/api/works");
const categories = await get("http://localhost:5678/api/categories");

const table = {works, categories};
export default table;

testTypeConnection();

displayWorks(works);

displayCategories(categories);

listenForLogout();

function createFilterButtons(id, name)
{
    const button = document.createElement("button");
    
    button.classList = "button-myprojects";
    button.innerText = name;
    button.dataset.id = id;
    listenForFilters(button)
    return button;            
}

function displayCategories(categories)
{
    if (localStorage.getItem('token'))
    {
        return;
    }

    const filterListButtons = document.querySelector(".myprojects");
    const button = createFilterButtons("tous", "Tous");
    filterListButtons.appendChild(button);

    categories.forEach(category => 
    {        
        const button = createFilterButtons(category.id, category.name);                
        filterListButtons.appendChild(button);
    });
}

export function displayWorks(works)
{
    let gallery = document.querySelector(".gallery").innerHTML = '';
    gallery = document.querySelector(".gallery");
    
    works.forEach(work => 
    {
            const figure = document.createElement("figure");
            figure.dataset.id = work.id;
            gallery.appendChild(figure);
        
            const img = document.createElement("img");
            img.src = work.imageUrl;
            img.alt = work.title;
            figure.appendChild(img);

            const caption = document.createElement("figcaption");
            caption.innerHTML = work.title;
            figure.appendChild(caption);
    });
}

export async function get(url)
{
    const reponse = await fetch(url)
    return await reponse.json()
}

function hideAdminButtons()
{
    showLoginLogoutButton ("login")

    // Hide buttons "modifier"
    const btnUpdate = document.querySelectorAll(".btn-modifier");
    btnUpdate.forEach (e => {
        e.classList.add("hidden");
    })
}

function highlightActiveFilterButton(button)
{
    const buttonsProject = document.querySelectorAll(".button-myprojects");
        buttonsProject.forEach(e =>
            {
                e.classList.remove("bg-green");
            })

        button.classList.add("bg-green");
}

function listenForFilters(button)
{
    button.addEventListener("click", function (event)
    {
        const id = event.target.dataset.id;

        let worksFiltered = (id === "tous") ? works : works.filter((work) => work.categoryId == id); // ternaire

        displayWorks(worksFiltered);

        highlightActiveFilterButton(button);
        
    });
}

function listenForLogout()
{
    const logout = document.querySelector("#li-logout");
    if (logout !== null)
    {
        logout.addEventListener("click", () =>
        {
            window.localStorage.clear();
        })
    }
}

function showLoginLogoutButton(type)
{
    // Create new "li" element
    const newLi = document.createElement("li");
    newLi.id = "li-" + type;
    if (type == "login") {
        newLi.innerHTML = "<a href=\"" + type + ".html\">" + type + "</a>";
    } else{
        newLi.innerHTML = "<a href=\"index.html\">" + type + "</a>";
    }
    
    // Insert new "li" before the last element in the list
    const lastLi = document.querySelector("#nav-list li:last-child");
    const parentLi = lastLi.parentNode;
    parentLi.insertBefore(newLi, lastLi);
}

function testTypeConnection()
{
    if (!localStorage.getItem('token'))
    {
        hideAdminButtons();
        return;
    }

    if (!localStorage.getItem('token').length === 143)
    {
        hideAdminButtons();
        return;
    }

    showLoginLogoutButton ("logout")
}