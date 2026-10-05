/* =========================================================
   INDIAN BANK - JAVASCRIPT
========================================================= */


/* =========================================================
   ADMIN ACCOUNT
========================================================= */

const ADMIN_ACCOUNT = {
    name: "Indian Bank Administrator",
    email: "admin@indianbank.demo",
    username: "admin",
    password: "admin123"
};


/* =========================================================
   LOCAL STORAGE KEYS
========================================================= */

const USERS_KEY = "indianBankUsers";
const LOGIN_KEY = "loggedInUser";
const ADMIN_KEY = "loggedInAdmin";


/* =========================================================
   GET USERS
========================================================= */

function getUsers() {

    const data = localStorage.getItem(USERS_KEY);

    if (!data) {
        return [];
    }

    try {
        return JSON.parse(data);
    } catch (error) {
        console.error("User data error:", error);
        return [];
    }
}


/* =========================================================
   SAVE USERS
========================================================= */

function saveUsers(users) {

    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
    );
}


/* =========================================================
   MODAL FUNCTIONS
========================================================= */

function showLogin() {

    closeAllModals();

    const modal = document.getElementById("loginModal");

    if (modal) {
        modal.classList.add("active");
    }
}


function showSignup() {

    closeAllModals();

    const modal = document.getElementById("signupModal");

    if (modal) {
        modal.classList.add("active");
    }
}


function showAdminLogin() {

    closeAllModals();

    const modal = document.getElementById("adminModal");

    if (modal) {
        modal.classList.add("active");
    }
}


function closeModal(id) {

    const modal = document.getElementById(id);

    if (modal) {
        modal.classList.remove("active");
    }
}


function closeAllModals() {

    document.querySelectorAll(".modal").forEach(function(modal) {
        modal.classList.remove("active");
    });
}


function switchToSignup() {

    closeModal("loginModal");

    setTimeout(function() {
        showSignup();
    }, 100);
}


function switchToLogin() {

    closeModal("signupModal");

    setTimeout(function() {
        showLogin();
    }, 100);
}


/* =========================================================
   CREATE ACCOUNT
========================================================= */

function createAccount(event) {

    event.preventDefault();

    const name =
        document.getElementById("signupName").value.trim();

    const email =
        document.getElementById("signupEmail").value.trim().toLowerCase();

    const username =
        document.getElementById("signupUsername").value.trim();

    const phone =
        document.getElementById("signupPhone").value.trim();

    const password =
        document.getElementById("signupPassword").value;

    const depositValue =
        document.getElementById("signupDeposit").value;


    /* Basic validation */

    if (!name || !email || !username || !phone || !password) {

        alert("Please fill all required fields.");

        return;
    }


    /* Email validation */

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

        alert("Please enter a valid email ID.");

        return;
    }


    /* Phone validation */

    const phonePattern =
        /^[6-9][0-9]{9}$/;

    if (!phonePattern.test(phone)) {

        alert(
            "Please enter a valid 10-digit Indian mobile number."
        );

        return;
    }


    /* Password */

    if (password.length < 4) {

        alert(
            "Password must contain at least 4 characters."
        );

        return;
    }


    /* Admin protection */

    if (
        username.toLowerCase() === ADMIN_ACCOUNT.username ||
        email === ADMIN_ACCOUNT.email
    ) {

        alert(
            "This username/email is reserved for the administrator."
        );

        return;
    }


    const users = getUsers();


    /* Duplicate email */

    const emailExists = users.some(function(user) {

        return user.email.toLowerCase() === email;

    });

    if (emailExists) {

        alert(
            "An account with this email already exists."
        );

        return;
    }


    /* Duplicate username */

    const usernameExists = users.some(function(user) {

        return user.username.toLowerCase() ===
               username.toLowerCase();

    });

    if (usernameExists) {

        alert(
            "This username is already taken. Please choose another."
        );

        return;
    }


    /* Initial balance */

    const initialDeposit =
        depositValue === ""
            ? 0
            : Number(depositValue);


    if (initialDeposit < 0) {

        alert("Deposit cannot be negative.");

        return;
    }


    /* New user */

    const newUser = {

        id: Date.now(),

        name: name,

        email: email,

        username: username,

        phone: phone,

        password: password,

        balance: initialDeposit,

        transactions: []

    };


    /* Add initial deposit transaction */

    if (initialDeposit > 0) {

        newUser.transactions.push({

            type: "credit",

            title: "Initial Deposit",

            amount: initialDeposit,

            date: new Date().toLocaleString()

        });

    }


    users.push(newUser);

    saveUsers(users);


    alert(
        "Account created successfully!\n\n" +
        "Username: " + username +
        "\nEmail: " + email +
        "\n\nYou can now login."
    );


    /* Reset form */

    document.querySelector("#signupModal form").reset();


    closeModal("signupModal");


    /* Open login */

    setTimeout(function() {

        showLogin();

        document.getElementById("loginEmail").value =
            email;

        document.getElementById("loginUsername").value =
            username;

    }, 200);

}


/* =========================================================
   USER LOGIN
========================================================= */

function loginUser(event) {

    event.preventDefault();


    const email =
        document.getElementById("loginEmail").value.trim().toLowerCase();

    const username =
        document.getElementById("loginUsername").value.trim();

    const password =
        document.getElementById("loginPassword").value;


    if (!email || !username || !password) {

        alert("Please enter email, username and password.");

        return;
    }


    /* Prevent admin login through user login */

    if (
        email === ADMIN_ACCOUNT.email &&
        username === ADMIN_ACCOUNT.username
    ) {

        alert(
            "Please use the Admin Login button for administrator access."
        );

        return;
    }


    const users = getUsers();


    const user = users.find(function(item) {

        return (
            item.email.toLowerCase() === email &&
            item.username.toLowerCase() === username.toLowerCase() &&
            item.password === password
        );

    });


    if (!user) {

        alert(
            "Invalid email, username or password.\n\n" +
            "Please check your registered details."
        );

        return;
    }


    /* Save logged-in user */

    localStorage.setItem(
        LOGIN_KEY,
        user.id.toString()
    );


    closeModal("loginModal");


    document.querySelector("#loginModal form").reset();


    openUserDashboard();
}


/* =========================================================
   ADMIN LOGIN
========================================================= */

function adminLogin(event) {

    event.preventDefault();


    const email =
        document.getElementById("adminEmail").value.trim().toLowerCase();

    const username =
        document.getElementById("adminUsername").value.trim();

    const password =
        document.getElementById("adminPassword").value;


    if (
        email === ADMIN_ACCOUNT.email &&
        username.toLowerCase() ===
            ADMIN_ACCOUNT.username &&
        password === ADMIN_ACCOUNT.password
    ) {

        localStorage.setItem(
            ADMIN_KEY,
            "true"
        );


        closeModal("adminModal");


        document.querySelector("#adminModal form").reset();


        openAdminDashboard();

    } else {

        alert(
            "Invalid admin credentials."
        );

    }

}


/* =========================================================
   CURRENT USER
========================================================= */

function getCurrentUser() {

    const id =
        localStorage.getItem(LOGIN_KEY);

    if (!id) {
        return null;
    }


    const users = getUsers();


    return users.find(function(user) {

        return user.id.toString() === id.toString();

    }) || null;
}


/* =========================================================
   SAVE CURRENT USER
========================================================= */

function saveCurrentUser(updatedUser) {

    const users = getUsers();

    const index = users.findIndex(function(user) {

        return user.id === updatedUser.id;

    });


    if (index !== -1) {

        users[index] = updatedUser;

        saveUsers(users);

    }
}


/* =========================================================
   OPEN USER DASHBOARD
========================================================= */

function openUserDashboard() {

    const user = getCurrentUser();


    if (!user) {

        localStorage.removeItem(LOGIN_KEY);

        showLogin();

        return;
    }


    hideMainWebsite();


    const dashboard =
        document.getElementById("userDashboard");


    const adminDashboard =
        document.getElementById("adminDashboard");


    dashboard.classList.add("active");

    adminDashboard.classList.remove("active");


    document.getElementById(
        "dashboardUserName"
    ).textContent = user.name;


    document.getElementById(
        "dashboardUserEmail"
    ).textContent = user.email;


    document.getElementById(
        "cardHolderName"
    ).textContent =
        user.name.toUpperCase();


    updateBalance(user);

    displayTransactions(user);

}


/* =========================================================
   UPDATE BALANCE
========================================================= */

function updateBalance(user) {

    const balanceElement =
        document.getElementById("dashboardBalance");


    if (balanceElement) {

        balanceElement.textContent =
            "₹" +
            Number(user.balance).toLocaleString(
                "en-IN",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            );

    }

}


/* =========================================================
   DEPOSIT
========================================================= */

function depositMoney() {

    const user = getCurrentUser();


    if (!user) {
        return;
    }


    const value =
        prompt("Enter deposit amount:");

    if (value === null) {
        return;
    }


    const amount = Number(value);


    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        alert("Please enter a valid amount.");

        return;
    }


    user.balance += amount;


    user.transactions.unshift({

        type: "credit",

        title: "Money Deposited",

        amount: amount,

        date: new Date().toLocaleString()

    });


    saveCurrentUser(user);

    openUserDashboard();


    alert(
        "₹" +
        amount.toLocaleString("en-IN") +
        " deposited successfully."
    );

}


/* =========================================================
   WITHDRAW
========================================================= */

function withdrawMoney() {

    const user = getCurrentUser();


    if (!user) {
        return;
    }


    const value =
        prompt("Enter withdrawal amount:");

    if (value === null) {
        return;
    }


    const amount = Number(value);


    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        alert("Please enter a valid amount.");

        return;
    }


    if (amount > user.balance) {

        alert(
            "Insufficient balance."
        );

        return;
    }


    user.balance -= amount;


    user.transactions.unshift({

        type: "debit",

        title: "Money Withdrawn",

        amount: amount,

        date: new Date().toLocaleString()

    });


    saveCurrentUser(user);

    openUserDashboard();


    alert(
        "₹" +
        amount.toLocaleString("en-IN") +
        " withdrawn successfully."
    );

}


/* =========================================================
   TRANSFER
========================================================= */

function transferMoney() {

    const sender = getCurrentUser();


    if (!sender) {
        return;
    }


    const receiverUsername =
        prompt(
            "Enter receiver username:"
        );


    if (!receiverUsername) {
        return;
    }


    const amountValue =
        prompt(
            "Enter transfer amount:"
        );


    if (amountValue === null) {
        return;
    }


    const amount = Number(amountValue);


    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        alert("Please enter a valid amount.");

        return;
    }


    if (amount > sender.balance) {

        alert("Insufficient balance.");

        return;
    }


    const users = getUsers();


    const receiver =
        users.find(function(user) {

            return (
                user.username.toLowerCase() ===
                receiverUsername.trim().toLowerCase()
            );

        });


    if (!receiver) {

        alert(
            "Receiver username not found."
        );

        return;
    }


    if (receiver.id === sender.id) {

        alert(
            "You cannot transfer money to yourself."
        );

        return;
    }


    /* Sender */

    sender.balance -= amount;


    sender.transactions.unshift({

        type: "debit",

        title:
            "Transfer to @" +
            receiver.username,

        amount: amount,

        date: new Date().toLocaleString()

    });


    /* Receiver */

    receiver.balance += amount;


    receiver.transactions.unshift({

        type: "credit",

        title:
            "Received from @" +
            sender.username,

        amount: amount,

        date: new Date().toLocaleString()

    });


    saveUsers(users);


    openUserDashboard();


    alert(
        "₹" +
        amount.toLocaleString("en-IN") +
        " transferred successfully to @" +
        receiver.username
    );

}


/* =========================================================
   DISPLAY TRANSACTIONS
========================================================= */

function displayTransactions(user) {

    const container =
        document.getElementById("transactionsList");


    if (!container) {
        return;
    }


    if (
        !user.transactions ||
        user.transactions.length === 0
    ) {

        container.innerHTML = `
            <p class="no-transactions">
                No transactions yet.
            </p>
        `;

        return;
    }


    container.innerHTML =
        user.transactions
            .map(function(transaction) {

                const isCredit =
                    transaction.type === "credit";


                return `
                    <div class="transaction-item">

                        <div class="transaction-left">

                            <div class="transaction-icon">
                                <i class="fa-solid ${
                                    isCredit
                                        ? "fa-arrow-down"
                                        : "fa-arrow-up"
                                }"></i>
                            </div>

                            <div>

                                <div class="transaction-title">
                                    ${escapeHTML(transaction.title)}
                                </div>

                                <div class="transaction-date">
                                    ${escapeHTML(transaction.date)}
                                </div>

                            </div>

                        </div>


                        <strong class="${
                            isCredit
                                ? "credit"
                                : "debit"
                        }">

                            ${
                                isCredit
                                    ? "+"
                                    : "-"
                            }

                            ₹${Number(transaction.amount)
                                .toLocaleString("en-IN")}

                        </strong>

                    </div>
                `;

            })
            .join("");

}


/* =========================================================
   CLEAR TRANSACTIONS
========================================================= */

function clearTransactions() {

    const user = getCurrentUser();


    if (!user) {
        return;
    }


    if (
        !user.transactions ||
        user.transactions.length === 0
    ) {

        alert(
            "There are no transactions to clear."
        );

        return;
    }


    const confirmClear =
        confirm(
            "Are you sure you want to clear transaction history?"
        );


    if (!confirmClear) {
        return;
    }


    user.transactions = [];

    saveCurrentUser(user);

    openUserDashboard();


    alert(
        "Transaction history cleared."
    );

}


/* =========================================================
   ADMIN DASHBOARD
========================================================= */

function openAdminDashboard() {

    hideMainWebsite();


    document.getElementById(
        "userDashboard"
    ).classList.remove("active");


    document.getElementById(
        "adminDashboard"
    ).classList.add("active");


    displayAdminUsers();

}


/* =========================================================
   DISPLAY ADMIN USERS
========================================================= */

function displayAdminUsers() {

    const users = getUsers();


    const totalUsers =
        document.getElementById("totalUsers");


    const list =
        document.getElementById("adminUsersList");


    if (totalUsers) {

        totalUsers.textContent =
            users.length;

    }


    if (!list) {
        return;
    }


    if (users.length === 0) {

        list.innerHTML = `
            <p class="no-transactions">
                No users registered yet.
            </p>
        `;

        return;
    }


    list.innerHTML =
        users.map(function(user) {

            return `

                <div class="admin-user">

                    <div class="admin-user-info">

                        <div class="admin-avatar">
                            ${escapeHTML(
                                user.name
                                    .charAt(0)
                                    .toUpperCase()
                            )}
                        </div>

                        <div>

                            <div class="admin-user-name">
                                ${escapeHTML(user.name)}
                            </div>

                            <div class="admin-user-email">
                                @${escapeHTML(user.username)}
                                •
                                ${escapeHTML(user.email)}
                            </div>

                        </div>

                    </div>

                    <div class="admin-user-balance">
                        ₹${Number(user.balance)
                            .toLocaleString("en-IN")}
                    </div>

                </div>

            `;

        }).join("");

}


/* =========================================================
   HIDE MAIN WEBSITE
========================================================= */

function hideMainWebsite() {

    const elements = [
        document.querySelector(".navbar"),
        document.querySelector("#home"),
        document.querySelector(".stats-section"),
        document.querySelector("#services"),
        document.querySelector("#security"),
        document.querySelector("#about"),
        document.querySelector("footer")
    ];


    elements.forEach(function(element) {

        if (element) {
            element.style.display = "none";
        }

    });

}


/* =========================================================
   SHOW MAIN WEBSITE
========================================================= */

function showMainWebsite() {

    const elements = [
        document.querySelector(".navbar"),
        document.querySelector("#home"),
        document.querySelector(".stats-section"),
        document.querySelector("#services"),
        document.querySelector("#security"),
        document.querySelector("#about"),
        document.querySelector("footer")
    ];


    elements.forEach(function(element) {

        if (element) {
            element.style.display = "";
        }

    });


    document
        .getElementById("userDashboard")
        .classList.remove("active");


    document
        .getElementById("adminDashboard")
        .classList.remove("active");

}


/* =========================================================
   USER LOGOUT
========================================================= */

function logout() {

    localStorage.removeItem(LOGIN_KEY);

    showMainWebsite();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   ADMIN LOGOUT
========================================================= */

function adminLogout() {

    localStorage.removeItem(ADMIN_KEY);

    showMainWebsite();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
========================================================= */

window.addEventListener(
    "click",
    function(event) {

        document
            .querySelectorAll(".modal")
            .forEach(function(modal) {

                if (event.target === modal) {

                    modal.classList.remove("active");

                }

            });

    }
);


/* =========================================================
   ESC KEY CLOSES MODAL
========================================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            closeAllModals();

        }

    }
);


/* =========================================================
   AUTO LOGIN
========================================================= */

window.addEventListener(
    "DOMContentLoaded",
    function() {

        const loggedUser =
            localStorage.getItem(LOGIN_KEY);

        const loggedAdmin =
            localStorage.getItem(ADMIN_KEY);


        if (loggedUser) {

            openUserDashboard();

        } else if (loggedAdmin === "true") {

            openAdminDashboard();

        }

    }
);
