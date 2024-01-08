import table from "./index.js";
import { displayWorks } from "./index.js";

const overlay = document.querySelector(".overlay");

let fileList = "";

const gallery = {
  modal : document.querySelector(".modal1"),
  content : document.querySelector(".modal1-content"),
  openButton : document.querySelectorAll(".btn-open-modal1"),
  closeButton : document.querySelector(".btn-close-modal1"),
  removeAllGallery : document.querySelector(".remove-all-gallery")
};

const form = {
  modal : document.querySelector(".modal2"),
  content : document.querySelector(".modal2-content"),
  openButton : document.querySelector(".btn-open-modal2"),
  closeButton : document.querySelector(".btn-close-modal2"),
  backButton : document.querySelector(".btn-back"),
  validateButton : document.querySelector(".button-validate")
}

listenToOpenGallery();
listenToOpenForm();
listenToCloseGallery();
listenToRemoveAllGallery();

function addNewProject(title, categoryId)
{
  const token = localStorage.getItem('token');
  
  const formdata = new FormData();
  formdata.append('image', fileList[0]);
  formdata.append('title', title);
  formdata.append('category', categoryId);

  fetch('http://localhost:5678/api/works', {
      method: 'POST',
      headers: 
      {
          'Authorization': `Bearer ${token}`,
      },
      body: formdata
  })
    .then((res) => res.json())
    .then((work) => {

      updateTableWorksAfterAddProject(work);

      form.modal.classList.add("hidden");
      gallery.modal.classList.remove("hidden");
  })
}

function clearDivErrors ()
{
  if (document.querySelector(".errors") !== null)
    {
      document.querySelector(".errors").remove()
    };
}

function closeForm()
{
  form.modal.classList.add("hidden");
  overlay.classList.add("hidden");
}

function closeGallery()
{
    gallery.modal.classList.add("hidden");
    overlay.classList.add("hidden");

    document.body.style.overflow = "";
}

function collectErrors(title, category, imgPresent)
{
  clearDivErrors()

  let errors = []

  if (isFieldEmpty(title))
  {
      errors.push ("- Le champ \"Titre\" est obligatoire")
  }
  
  if (isFieldEmpty(category))
  {
      errors.push ("- Le champ \"Catégorie\" est obligatoire")
  }

  if (imgPresent === false)
  {
    errors.push ("- La photo n\'est pas chargée")
  }

  if (fileList[0].size > 4000000)
  {
    errors.push("- La taille de la photo est supérieure à 4mo")
  }

  return errors;
}

function createIconArrowsAllDirection(id)
{
  const div = document.querySelector(`.imgedit[data-id="${id}"]`);
  const iconArrowsBg = document.createElement("div");
  iconArrowsBg.classList = "arrows-up-down-left-right";
  div.appendChild(iconArrowsBg);

  const iconArrows = document.createElement("i");
  iconArrows.classList = "fa-solid fa-arrows-up-down-left-right arrows-up-down-left-right-icon";
  iconArrowsBg.appendChild(iconArrows);
}

function createSelectCategories()
  {
    // create list of categories for select list
    let selectCategories = document.querySelector(".modal2-content #categorie").innerHTML = '';
    selectCategories = document.querySelector(".modal2-content #categorie");

    let selectOption = document.createElement("option");
    selectOption.textContent = "";
    selectCategories.appendChild(selectOption)

    table.categories.forEach(e =>
      {
        selectOption = document.createElement("option");
        selectOption.value = e.name.trim();
        selectOption.textContent = e.name;
        selectOption.dataset.id = e.id;
        selectCategories.appendChild(selectOption)
      })
}

function displayErrors(errors)
{
    let divError = document.createElement("div");
    divError.classList.add("errors");
    let html = "";

    errors.forEach(error => {
        html += error + "<br>"
    });

    divError.innerHTML = html;
    document.querySelector(".modal2 form").appendChild(divError);
}

function goBackToGallery()
{
  form.modal.classList.add("hidden");
  gallery.modal.classList.remove("hidden");

  clearDivErrors ()
}

function hydrateGallery() 
{
  gallery.content.innerHTML = '';

  // Create gallery modal with all works
  table.works.forEach((work, index) => {
    const div = document.createElement("div");
    div.classList = "imgedit";
    div.dataset.id = work.id;
    gallery.content.appendChild(div);

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;
    div.appendChild(img);

    const input = document.createElement("input");
    input.type = "button";
    input.value = "éditer";
    input.dataset.id = work.id;
    div.appendChild(input);

    const iconTrashBg = document.createElement("div");
    iconTrashBg.classList = "trash-can-background";
    iconTrashBg.dataset.id = work.id;
    div.appendChild(iconTrashBg);

    const iconTrash = document.createElement("i");
    iconTrash.classList = "fa-solid fa-trash-can trash-can-icon";
    iconTrashBg.appendChild(iconTrash);

    if (index === 0)
    {
      createIconArrowsAllDirection(work.id)
    }
  });
}

function hydrateForm()
{
  let foto = document.querySelector(".foto-to-be-added").innerHTML = '';
  foto = document.querySelector(".foto-to-be-added");

  const div = document.createElement("div");
  div.classList = "request-for-foto";
  foto.appendChild(div);
  //
  const pImg = document.createElement("p");
  div.appendChild(pImg);

  const img = document.createElement("img");
  img.src = "./assets/icons/montain-sun.png";
  img.alt = "montain-sun";
  pImg.appendChild(img);
  //
  const pInput = document.createElement("p");
  div.appendChild(pInput);

  const input = document.createElement("input");
  input.type = "file";
  input.id = "file";
  input.accept = ".png, .jpg";
  pInput.appendChild(input);

  const label = document.createElement("label");
  label.htmlFor = "file";
  label.textContent = "+ Ajouter une photo";
  pInput.appendChild(label);
  //
  const pSize = document.createElement("p");
  // 
  pSize.classList = "font-10px-400";
  pSize.textContent = "jpg.png : 4mo max";
  div.appendChild(pSize);

  // Paragraphe to import foto initially hidden
  const pFoto = document.createElement("p");
  pFoto.classList = "uploaded-foto center hidden";
  foto.appendChild(pFoto);

  createSelectCategories()

  form.validateButton.classList.add("bg-color-grey");
  form.validateButton.classList.remove("bg-color-green");

  title.value = "";

  const inputValider = document.querySelector(".button-validate");
  inputValider.disabled = true;

  listenToUploadFoto()
}

function isFieldEmpty(value)
{
    if (value != "")
    {
        return false
    }
    return true
}

function listenToCloseGallery()
{
  // Close the modal when the close button or overlay is clicked
  gallery.closeButton.addEventListener("click", closeGallery);
  overlay.addEventListener("click", closeGallery);

  // Close the Modal on Escape Key pressed
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !gallery.modal.classList.contains("hidden")) 
    {
      closeGallery();
    }
  });
}

function listenToFormValidation()
{
  // Listener on the form (Titre & Catégorie) - button "Valider"
  const formValidation = document.querySelector(".modal2 form");

  formValidation.addEventListener("submit", (event) => 
  {
    event.preventDefault();

    const title = document.querySelector("#title").value; // contenu deu champ "Titre"
    const category = document.querySelector("#categorie");
    const categoryId = category.options.selectedIndex; // Id de la catégorie sélectionnée

    let imgPresent = false;
    if (document.querySelector(".uploaded-foto img") !== null)
    {
      imgPresent = true;   
    }

    const errors = collectErrors(title, categoryId, imgPresent);

    if (errors.length > 0)
    {
        displayErrors(errors);
        return;
    }
    
    addNewProject(title, categoryId)

  })
}

function listenToOpenForm()
{
  // Open the modal Form (modal2) when the open button ("Ajouter une photo") is clicked
  form.openButton.addEventListener("click", openForm);

  // Open the modal1 when the back button is clicked
  form.backButton.addEventListener("click", goBackToGallery);

  // close the modal when the close button or overlay is clicked
  form.closeButton.addEventListener("click", () => {
    closeGallery()
    closeForm()
    clearDivErrors ()
  })
  overlay.addEventListener("click", () => {
    closeGallery()
    closeForm()
    clearDivErrors ()
  })

  listenToFormValidation()
}

function listenToOpenGallery()
{
  gallery.openButton.forEach( e => 
    {
      e.addEventListener("click", () =>
      {
        hydrateGallery()
        openGallery()
        listenToRemoveAProject();
      })
    })
}

function listenToRemoveAllGallery()
{
// Listener to remove all the gallery
gallery.removeAllGallery.addEventListener("click", removeTheGallery);
}

function listenToRemoveAProject()
{
  table.works.forEach(work => {
    const button = document.querySelector(`.trash-can-background[data-id="${work.id}"]`);

    button.addEventListener("click", (e) =>
      {
        e.preventDefault();
        remove(work.id);
      })
  });
}

function listenToUploadFoto()
{
  // listener on "+Ajouter une photo"

  const selectedFile = document.querySelector(".request-for-foto input");

  selectedFile.addEventListener("change", (event) =>
  {
    fileList = event.target.files;

    const imgNew = document.createElement("img");
    imgNew.classList = "foto-added";
    imgNew.src = URL.createObjectURL(fileList[0]);
    imgNew.alt = fileList[0].name;

    const pFoto = document.querySelector(".uploaded-foto");
    pFoto.appendChild(imgNew);
    pFoto.classList.remove("hidden");

    const div = document.querySelector(".request-for-foto");
    div.classList.add("hidden");

    let title = document.querySelector("#title");
    title.value = fileList[0].name;
    
    form.validateButton.classList.remove("bg-color-grey");
    form.validateButton.classList.add("bg-color-green");

    const inputValider = document.querySelector(".button-validate");
    inputValider.disabled = false;
  });
}

function openForm() 
{
  // Remove the hidden class from the modal and overlay
  form.modal.classList.remove("hidden");
  gallery.modal.classList.add("hidden");
  overlay.classList.remove("hidden");

  hydrateForm()
}

function openGallery() 
{
  // Remove the hidden class from the modal and overlay
  gallery.modal.classList.remove("hidden");
  overlay.classList.remove("hidden");

  document.body.style.overflow = "hidden";
}

async function remove(id)
{
  const token = localStorage.getItem('token');
  // Send request to delete a project
  const response = await fetch(`http://localhost:5678/api/works/${id}`,
  {
    method: 'DELETE',
    headers: 
    {
      'Authorization': `bearer ${token}`
    }
  })

  document.querySelector(`figure[data-id="${id}"]`).remove();
  document.querySelector(`.imgedit[data-id="${id}"]`).remove();

  updateTableWorksAfterRemoveProject(id);

  if (table.works[0])
  {
    createIconArrowsAllDirection(table.works[0].id);
  }
}

function removeTheGallery() 
{
  const idsToDelete = [];
  document.querySelectorAll('.imgedit').forEach(e =>
    {
      idsToDelete.push(e.dataset.id)
    })

  idsToDelete.forEach(work => 
  {
    // Send request to delete a project
    remove(work)
  })
}

async function updateTableWorksAfterAddProject(work)
{
  table.works.push(work);

  // afficher la gallerie dans index.html
  displayWorks(table.works)

  // afficher la gallerie dans modal1
  hydrateGallery()

  listenToRemoveAProject()
}

function updateTableWorksAfterRemoveProject(id)
{
  for (let i=table.works.length - 1; i>=0; i--)
  {

    if(table.works[i].id == id)
    {
      table.works.splice(i,1)
    }
  }
}