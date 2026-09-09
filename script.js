// =====================================
// PROFILE SETTINGS
// =====================================

let selectedProfileFile = null;


// Profile button
document
  .getElementById("profileBtn")
  .onclick = async () => {

    if (!currentUser) return;

    await openProfileSettings();

  };


// Open profile
async function openProfileSettings(){

  const userSnap =
    await getDoc(
      doc(
        db,
        "users",
        currentUser.uid
      )
    );

  let userData = {};

  if(userSnap.exists()){
    userData = userSnap.data();
  }

  const name =
    userData.name ||
    currentUser.email.split("@")[0];

  const bio =
    userData.bio || "";


  document.getElementById(
    "profileNameInput"
  ).value = name;


  document.getElementById(
    "profileBioInput"
  ).value = bio;


  document.getElementById(
    "profileAvatar"
  ).innerText =
    name.charAt(0).toUpperCase();


  document
    .getElementById("profileModal")
    .classList.remove("hidden");

}


// =====================================
// PROFILE PHOTO
// =====================================

document
  .getElementById("profilePhotoInput")
  .addEventListener(
    "change",
    event => {

      selectedProfileFile =
        event.target.files[0];

      if(!selectedProfileFile) return;

      if(
        !selectedProfileFile
          .type
          .startsWith("image/")
      ){

        alert("Please select an image.");

        selectedProfileFile = null;

        return;

      }


      const reader =
        new FileReader();


      reader.onload =
        e => {

          document.getElementById(
            "profileAvatar"
          ).style.backgroundImage =
            `url(${e.target.result})`;

          document.getElementById(
            "profileAvatar"
          ).style.backgroundSize =
            "cover";

          document.getElementById(
            "profileAvatar"
          ).style.backgroundPosition =
            "center";

          document.getElementById(
            "profileAvatar"
          ).innerText = "";

        };


      reader.readAsDataURL(
        selectedProfileFile
      );

    }
  );


// =====================================
// SAVE PROFILE
// =====================================

document
  .getElementById("saveProfileBtn")
  .onclick =
  async () => {

    if(!currentUser) return;


    const name =
      document
        .getElementById(
          "profileNameInput"
        )
        .value
        .trim();


    const bio =
      document
        .getElementById(
          "profileBioInput"
        )
        .value
        .trim();


    const msg =
      document.getElementById(
        "profileMsg"
      );


    if(!name){

      msg.innerText =
        "Please enter your name.";

      return;

    }


    try{

      msg.innerText =
        "Saving profile...";


      let photoURL = "";


      // Upload profile photo
      if(selectedProfileFile){

        const fileName =
          Date.now() +
          "_" +
          selectedProfileFile.name;


        const storageRef =
          ref(
            storage,
            "profiles/" +
            currentUser.uid +
            "/" +
            fileName
          );


        await uploadBytes(
          storageRef,
          selectedProfileFile
        );


        photoURL =
          await getDownloadURL(
            storageRef
          );

      }


      const updateData = {

        uid:
          currentUser.uid,

        name:
          name,

        email:
          currentUser.email,

        bio:
          bio,

        updatedAt:
          new Date().toISOString()

      };


      if(photoURL){

        updateData.photoURL =
          photoURL;

      }


      await setDoc(
        doc(
          db,
          "users",
          currentUser.uid
        ),
        updateData,
        { merge:true }
      );


      msg.innerText =
        "Profile updated successfully ❤️";


      selectedProfileFile = null;


      // Refresh profile
      await loadUser();


      setTimeout(
        closeProfile,
        1000
      );

    }

    catch(error){

      console.error(error);

      msg.innerText =
        "Profile update failed: " +
        error.message;

    }

  };


// =====================================
// CLOSE PROFILE
// =====================================

document
  .getElementById("closeProfile")
  .onclick =
  closeProfile;


function closeProfile(){

  document
    .getElementById("profileModal")
    .classList.add("hidden");

    }
