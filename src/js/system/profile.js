import { supabase, successNotification, errorNotification, doLogout } from "../main";

const friendsImageUrl = 'https://yamqrggncmryqabtohcb.supabase.co/storage/v1/object/public/friends/';

// Load Data
getDatas();

// Assign Logout Functionality
const btn_logout = document.getElementById("btn_logout");

btn_logout.onclick = doLogout;


// Submit Form Functionality; Both Functional for Create and Update
const form_item = document.getElementById("form_item");

form_item.onsubmit = async (e) => {
  e.preventDefault();

  // Get All values from input, select, textarea under form tag
  const formData = new FormData(form_item);

// Upload Image

const image = formData.get("my_photo");
const { data, error } = await supabase
  .storage
  .from('friends')
  .upload('public/' + image.first_name, image, {
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
.from('user_info')
.insert([
  { first_name: formData.get("first_name"), 
    last_name: formData.get("last_name"),
    birthday: formData.get("birthday"),
    address: formData.get("address"), 
    my_photo: image_data == null ? null : image_data.path, 
    },
])
.select();

if (error == null) {
  successNotification ("Profile Updated Successfully!", 15);

  //Reload Data
  getDatas();
}
    else {
      errorNotification(
        "Something wrong happened. Cannot Update Profile.",
        15
      );
      console.log(error);
    }
      
}
// For Update
else{
  
const { data, error } = await supabase
.from('user_info')
.update({ first_name: formData.get("first_name"), 
last_name: formData.get("last_name"),
birthday: formData.get("birthday"),
address: formData.get("address"),  
my_photo: image_data == null ? null : image_data.path, 
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
    
//Get all rows
let { data: user_info, error } = await supabase
  .from('user_info')
  .select('*')
          
    
    //Temporary Storage for html elements and each items
    let container = "";

// Get each user_info and interpolate with html elements
user_info.forEach((user_info) => {
    container += `
    <div class="row row-cols-1 row-cols-md-3 g-3">
    <div class="col-12 mb-5">
        <div class="card h-100 justify-content-center p-4 ms-2" data-id="${user_info.id}">
            <img src="${friendsImageUrl + user_info.my_photo}" alt="" class="rounded-circle p-3" height="315px" width="315px">
            <div class="card-body">
                    <h2 class="card-title">
                      My Profile
                      <a href="#" id="btn_edit" class="btn border-danger-subtle" data-id="${user_info.id}">Edit</a>
                    </h2>
                    

                <div class="text-start mt-3">
                  <h6 class="text-secondary">Full Name</h6>
                  <h4>${user_info.first_name} ${user_info.last_name}</h4>
                  <br>
                  <h6 class="text-secondary">Date of Birth</h6>
                  <h4>${user_info.birthday}</h4>
                  <br>
                  <h6 class="text-secondary">Address</h6>
                  <h4>${user_info.address}</h4>
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

}

 // Delete Functionality
 const deleteAction = async (e) => {
    const id = e.target.getAttribute("data-id");

    // Change background color the card that you want to delete
  document.querySelector(`.card[data-id="${id}"]`).style.backgroundColor =
  "red";

// Supabase Delete Row
const { error } = await supabase.from('user_info').delete().eq("id", id)

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

  // Supabase show by id
    let { data: user_info, error } = await supabase.from('user_info').select('*').eq('id', id);

    if (error == null) {
        // Store id to a variable; id will be utilize for update
        for_update_id = user_info[0].id;
    
        // Assign values to the form
        document.getElementById("first_name").value = user_info[0].first_name;
        document.getElementById("last_name").value = user_info[0].last_name;
        document.getElementById("birthday").value = user_info[0].birthday;
        document.getElementById("address").value = user_info[0].address;
    
        // Change Button Text using textContent; either innerHTML or textContent is fine here
        document.querySelector("#form_item button[type='submit']").textContent =
          "Update";
      } else {
        errorNotification("Something wrong happened. Cannot update profile.", 15);
        console.log(error);
    
      }
        

    // Show Modal Form
    document.getElementById("modal_show").click();
};