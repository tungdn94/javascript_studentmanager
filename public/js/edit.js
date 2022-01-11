const elInputName = document.querySelector("input#name");
const elInputBirthday = document.querySelector("input#birthday");
const elInputEmail = document.querySelector("input#email");
const elInputPhone = document.querySelector("input#phone");

const elTextName = document.querySelector("#warn-name");
const elTextBirthday = document.querySelector("#warn-birthday");
const elTextEmail = document.querySelector("#warn-email");
const elTextPhone = document.querySelector("#warn-phone");

const elButtonReturn = document.querySelector("#button-return");
const elButtonSave = document.querySelector("#button-save");

// Global variable
let userID;

// API

function getIDAPI(id) {
	return axios.get(`/users/${id}`);
}

async function getIDInfo(id) {
	try {
		const res = await getIDAPI(id);
		const userData = res.data;
		console.log(userData);
		renderData(userData);
	} catch (error) {
		console.log(error);
	}
}

function patchIDAPI(user, ID) {
	return axios.patch(`/users/${ID}`, {
		name: user.name,
		email: user.email,
		phone: user.phone,
		birthday: user.birthday,
	});
}

// Utility function

function getIDUrl() {
	const url = new URL(window.location.href);
	userID = url.searchParams.get("id");
}

function renderData(userData) {
	elInputName.value = userData.name;
	elInputBirthday.value = userData.birthday;
	elInputEmail.value = userData.email;
	elInputPhone.value = userData.phone;
}

function checkInput() {
	let nameCheck = true;
	let birthdayCheck = true;
	let emailCheck = true;
	let phoneCheck = true;
	hideError();

	const name = elInputName.value;
	const birthday = elInputBirthday.value;
	const email = elInputEmail.value;
	const phone = elInputPhone.value;

	checkName();
	checkBirthday();
	checkEmail();
	checkPhone();

	return nameCheck && birthdayCheck && emailCheck && phoneCheck;

	function checkName() {
		if (name.length === 0) {
			nameCheck = false;
			elTextName.classList.remove("hidden");
			elTextName.querySelector("span").innerText = "Không được để trống";
		}

		if (nameCheck) {
			nameCheck = /[a-zA-Z\u0080-\uFFFF]/.test(name);
			if (!nameCheck) {
				elTextName.classList.remove("hidden");
				elTextName.querySelector("span").innerText = "Tên chỉ cho phép chữ";
			}
		}
	}

	function checkBirthday() {
		if (birthday.length === 0) {
			birthdayCheck = false;
			elTextBirthday.classList.remove("hidden");
			elTextBirthday.querySelector("span").innerText = "Không được để trống";
		}

		if (birthdayCheck) {
			birthdayCheck = /^(0[1-9]|[12]\d|3[01])[/](0[1-9]|1[012])[/](19|20)\d\d$/.test(birthday);
			if (!birthdayCheck) {
				elTextBirthday.classList.remove("hidden");
				elTextBirthday.querySelector("span").innerText = "Định dạng ngày sinh không đúng (dd/mm/yyyy)";
			}
		}
	}

	function checkEmail() {
		if (email.length === 0) {
			emailCheck = false;
			elTextEmail.classList.remove("hidden");
			elTextEmail.querySelector("span").innerText = "Không được để trống";
		}

		if (emailCheck) {
			emailCheck = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
			if (!emailCheck) {
				elTextEmail.classList.remove("hidden");
				elTextEmail.querySelector("span").innerText = "Định dạng email không đúng";
			}
		}
	}

	function checkPhone() {
		if (phone.length === 0) {
			phoneCheck = false;
			elTextPhone.classList.remove("hidden");
			elTextPhone.querySelector("span").innerText = "Không được để trống";
		}

		if (phoneCheck) {
			phoneCheck = /^\d{10}$/.test(phone);
			if (!phoneCheck) {
				elTextPhone.classList.remove("hidden");
				elTextPhone.querySelector("span").innerText = "Định dạng số điện thoại không đúng (10 số)";
			}
		}
	}
}

function hideError() {
	elTextName.classList.add("hidden");
	elTextBirthday.classList.add("hidden");
	elTextEmail.classList.add("hidden");
	elTextPhone.classList.add("hidden");
}

// Event listener

elButtonReturn.addEventListener("click", function () {
	location.href = window.location.origin;
});

elButtonSave.addEventListener("click", function () {
	if (checkInput()) {
		const editedUser = {
			name: elInputName.value,
			email: elInputEmail.value,
			phone: elInputPhone.value,
			birthday: elInputBirthday.value,
		};
		patchIDAPI(editedUser, userID);
		location.href = window.location.origin;
	}
});

// Main

window.onload = () => {
	hideError();
	getIDUrl();
	getIDInfo(userID);
};
