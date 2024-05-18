// show a message with a type of the input
function showMessage(input, message, type) {
	// get the small element and set the message
	const msg = input.parentNode.querySelector("small");
	msg.innerText = message;
	// update the class for the input
	input.className = type ? "success" : "error";
	return type;
}

function showError(input, message) {
	return showMessage(input, message, false);
}

function showSuccess(input) {
	return showMessage(input, "", true);
}

function hasValue(input, message) {
	if (input.value.trim() === "") {
		return showError(input, message);
	}
	return showSuccess(input);
}

function validateEmail(input, requiredMsg, invalidMsg) {
	// check if the value is not empty
	if (!hasValue(input, requiredMsg)) {
		return false;
	}
	// validate email format
	const emailRegex =
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	const email = input.value.trim();
	if (!emailRegex.test(email)) {
		return showError(input, invalidMsg);
	}
	return true;
}

function sendEmail(form){ 
  const f_name = form.elements['name'].value;
  const f_email = form.elements['email'].value;
  const f_message = form.elements['message'].value;
  
  console.log(f_name, f_email, f_message);
}

const contact_form = document.getElementById("contact_us");
const submit_button = document.getElementById("submit");

const NAME_REQUIRED = "Please enter your name";
const EMAIL_REQUIRED = "Please enter your email";
const EMAIL_INVALID = "Please enter a correct email address format";

// contact_form.addEventListener("submit", function (event) {
// 	// stop form submission
// 	event.preventDefault();

// 	// validate the form
// 	let nameValid = hasValue(form.elements["name"], NAME_REQUIRED);
// 	let emailValid = validateEmail(form.elements["email"], EMAIL_REQUIRED, EMAIL_INVALID);
// 	// if valid, submit the form.
// 	if (nameValid && emailValid) {
// 		alert("Demo only. No form was posted.");
// 	}
// });

//submit_button.onclick = sendEmail(contact_form);

//console.log(contact_form.elements);

//console.log(submit_button.onclick);



