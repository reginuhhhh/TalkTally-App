import { NavigatorLockAcquireTimeoutError } from "@supabase/supabase-js";
import { supabase, successNotification, errorNotification, doLogout } from "../main";

const friendsImageUrl = 'https://yamqrggncmryqabtohcb.supabase.co/storage/v1/object/public/friends/';

// Load Data
getDatas();

// Assign Logout Functionality
const btn_logout = document.getElementById("btn_logout");

btn_logout.onclick = doLogout;

// Search Form Functionality
const form_search = document.getElementById("form_search");

form_search.onsubmit = async (e) => {
  e.preventDefault();

    // Get All values from input, select, textarea under form tag
    const formData = new FormData(form_search);

    getDatas(formData.get ("keyword"));

};

// Submit Form Functionality; Both Functional for Create and Update
const form_item = document.getElementById("form_item");

form_item.onsubmit = async (e) => {
  e.preventDefault();

  // Get All values from input, select, textarea under form tag
  const formData = new FormData(form_item);

// Upload Image

const image = formData.get("profile_photo");
const { data, error } = await supabase
  .storage
  .from('friends')
  .upload('public/' + image.name, image, {
    cacheControl: '3600',
    upsert: true,
  });

  const image_data = data;

  if (error){
    errorNotification(
      "Something wrong happened. Cannot upload image, image size might be too big.", 15
    );
    console.log(error);
  }

if (for_update_id == ''){
// Supabase Create Data
const { data, error } = await supabase
.from('contacts')
.insert([
  { name: formData.get("name"), 
    points_to_deduct: formData.get("points_to_deduct"), 
    profile_photo: image_data == null ? null : image_data.path, 
    },
])
.select();

if (error == null) {
  successNotification ("A Friend Was Succesfully Added to Contacts!", 15);

  //Reload Data
  getDatas();
}
    else {
      errorNotification(
        "Something wrong happened. Cannot add friend.",
        15
      );
      console.log(error);
    }
      
}
// For Update
else{
  
const { data, error } = await supabase
.from('contacts')
.update({ name: formData.get("name"), 
points_to_deduct: formData.get("points_to_deduct"), 
profile_photo: image_data == null ? null : image_data.path, 
 })
.eq('id', for_update_id)
.select()
      
if (error == null) {
  successNotification ("Updated Successfully!", 15);

  // Reset Storage Id
  for_update_id = "";

  //Reload Data
  getDatas();
}
    else {
      errorNotification(
        "Something wrong happened. Cannot add friend.",
        15
      );
      console.log(error);
    }

}

  // Modal Close
  document.getElementById('modal_close').click();

  // Reset Form
  form_item.reset();

}

// Load Data Functionality
async function getDatas(keyword = ""){
// Get all rows
let { data: contacts, error } = await supabase
    .from('contacts')
    .select('*')
    .ilike('name', "%" + keyword + "%");


//Temporary Storage for html elements and each items
let container = "";
// Get each contacts and interpolate with html elements
contacts.forEach((contacts) => {
    container += `
    <div class="col-6 mb-2">
        <div class="card h-100" data-id="${contacts.id}">
            <img src="${friendsImageUrl + contacts.profile_photo}" class="rounded-circle p-2" alt="">
            <div class="card-body">
                <a href="person1.html" class="link-offset-2 link-underline link-underline-opacity-0 text-dark">
                    <h3 class="card-title">${contacts.name}</h3>
                </a>
                <div class="d-flex justify-content-center align-items-center">
                <h4 class = "text-danger">Points: ${contacts.points_to_deduct}</h4>

                    <div class="dropdown float-end">
                    <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button>
                    <ul class="dropdown-menu">
                        <li>
                            <a class="dropdown-item" href="#" id="btn_edit" data-id="${
                              contacts.id
                            }">Edit</a>
                        </li>
                        <li>
                            <a class="dropdown-item" href="#" id="btn_delete" data-id="${
                              contacts.id
                            }">Remove from Contacts</a>
                        </li>
                    </ul>
                </div>
                </div>
            
                
            </div>
        </div>
    </div>
</div>`;

});

  // Assign container to the html element to be displayed
document.getElementById("get_data").innerHTML = container;

  // Assign click event on Edit Btns
  document.querySelectorAll("#btn_edit").forEach((element) => {
    element.addEventListener("click", editAction);
  })

  // Assign click event on Delete Btns
  document.querySelectorAll("#btn_delete").forEach((element) => {
    element.addEventListener("click", deleteAction);

  });

}

  // Delete Functionality
  const deleteAction = async (e) => {
    const id = e.target.getAttribute("data-id");

    // Change background color the card that you want to delete
  document.querySelector(`.card[data-id="${id}"]`).style.backgroundColor =
  "red";

// Supabase Delete Row
const { error } = await supabase.from('contacts').delete().eq("id", id)

if (error == null) {
    successNotification ("A Contact Was Succesfully Removed!", 15);

    // Remove the Card from the list
    document.querySelector(`.card[data-id="${id}"]`).remove(); // recommended approach
}
else {
    errorNotification(
      "Something wrong happened. Cannot remove friend.",
      15
    );
    console.log(error);

        // Change background color the card that you want to delete
        document.querySelector(`.card[data-id="${id}"]`).style.backgroundColor =
        "white";
  }
        
  };

  // Storage of Id of chosen data to update
let for_update_id = "";

  // Edit Functionality; but show first
const editAction = async (e) => {
    const id = e.target.getAttribute("data-id");

    // Change background color the card that you want to edit
  document.querySelector(`.card[data-id="${id}"]`).style.backgroundColor =
  "violet";

  // Supabase show by id
    let { data: contacts, error } = await supabase.from('contacts').select('*').eq('id', id);

    if (error == null) {
        // Store id to a variable; id will be utilize for update
        for_update_id = contacts[0].id;
    
        // Assign values to the form
        document.getElementById("name").value = contacts[0].name;
        document.getElementById("points_to_deduct").value = contacts[0].points_to_deduct;
    
        // Change Button Text using textContent; either innerHTML or textContent is fine here
        document.querySelector("#form_item button[type='submit']").textContent =
          "Update";
      } else {
        errorNotification("Something wrong happened. Cannot show friend.", 15);
        console.log(error);
    
        // Change background color the card that you want to delete
        document.querySelector(`.card[data-id="${id}"]`).style.backgroundColor =
          "white";
      }
        

    // Show Modal Form
    document.getElementById("modal_show").click();
};
