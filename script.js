// ===============================
// GS NYARUGUGU WEBSITE
// Main JavaScript
// ===============================


// ---------- STORAGE ----------

const getData = (key, fallback = []) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
};

const saveData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};


// ---------- PUBLIC WEBSITE ----------

const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}


// Load News on public website

function loadPublicNews() {

  const container = document.getElementById("newsContainer");

  if (!container) return;

  const news = getData("gs_news");

  if (news.length === 0) {

    container.innerHTML = `
      <div class="card">
        <div class="icon">📰</div>
        <h3>Welcome to GS Nyarugugu</h3>
        <p>
          School news and announcements will appear here.
        </p>
      </div>
    `;

    return;
  }

  container.innerHTML = news.map(item => `
    <article class="card">
      <div class="icon">📰</div>
      <h3>${escapeHTML(item.title)}</h3>
      <p>${escapeHTML(item.content)}</p>
      <small>${item.date}</small>
    </article>
  `).join("");
}


// Contact Form

const contactForm = document.getElementById("contactForm");

if (contactForm) {

  contactForm.addEventListener("submit", function(e) {

    e.preventDefault();

    const messages = getData("gs_messages");

    messages.push({
      id: Date.now(),
      name: document.getElementById("senderName").value,
      email: document.getElementById("senderEmail").value,
      subject: document.getElementById("senderSubject").value,
      message: document.getElementById("senderMessage").value,
      date: new Date().toLocaleString()
    });

    saveData("gs_messages", messages);

    alert("Thank you! Your message has been sent.");

    contactForm.reset();

  });
}


loadPublicNews();


// ===============================
// ADMIN LOGIN
// ===============================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

  loginForm.addEventListener("submit", function(e) {

    e.preventDefault();

    const username =
      document.getElementById("username").value.trim();

    const password =
      document.getElementById("password").value;

    /*
      DEMO LOGIN ONLY.

      Username: admin
      Password: admin123

      DO NOT use this authentication method
      for a real production website.
    */

    if (username === "admin" && password === "admin123") {

      localStorage.setItem("gs_admin_logged_in", "true");

      document.getElementById("loginScreen")
        .classList.add("hidden");

      document.getElementById("dashboard")
        .classList.remove("hidden");

      loadDashboard();

    } else {

      document.getElementById("loginError").textContent =
        "Invalid username or password.";

    }

  });
}


// Check existing login

function checkLogin() {

  const loginScreen = document.getElementById("loginScreen");
  const dashboard = document.getElementById("dashboard");

  if (!loginScreen || !dashboard) return;

  if (localStorage.getItem("gs_admin_logged_in") === "true") {

    loginScreen.classList.add("hidden");
    dashboard.classList.remove("hidden");

    loadDashboard();
  }
}

checkLogin();


// ---------- LOGOUT ----------

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

  logoutBtn.addEventListener("click", function() {

    localStorage.removeItem("gs_admin_logged_in");

    location.reload();

  });
}


// ---------- DASHBOARD NAVIGATION ----------

const sideButtons =
  document.querySelectorAll(".side-btn, .quick-btn");

sideButtons.forEach(button => {

  button.addEventListener("click", function() {

    const sectionName = this.dataset.section;

    if (!sectionName) return;

    showAdminSection(sectionName);

  });

});


function showAdminSection(sectionName) {

  document.querySelectorAll(".admin-section")
    .forEach(section => {

      section.classList.remove("active-section");

    });

  const target = document.getElementById(sectionName);

  if (target) {
    target.classList.add("active-section");
  }

  document.querySelectorAll(".side-btn")
    .forEach(button => {

      button.classList.remove("active");

      if (button.dataset.section === sectionName) {
        button.classList.add("active");
      }

    });

  const titles = {

    overview: "Dashboard",
    newsAdmin: "News Management",
    eventsAdmin: "Events Management",
    teachersAdmin: "Teachers",
    galleryAdmin: "Gallery",
    messagesAdmin: "Messages",
    settingsAdmin: "School Settings"

  };

  const title =
    document.getElementById("pageTitle");

  if (title) {
    title.textContent = titles[sectionName] || "Dashboard";
  }
}


// ===============================
// NEWS MANAGEMENT
// ===============================

const newsForm =
  document.getElementById("newsForm");

if (newsForm) {

  newsForm.addEventListener("submit", function(e) {

    e.preventDefault();

    const news = getData("gs_news");

    news.unshift({

      id: Date.now(),

      title:
        document.getElementById("newsTitle").value,

      content:
        document.getElementById("newsContent").value,

      date:
        new Date().toLocaleDateString()

    });

    saveData("gs_news", news);

    newsForm.reset();

    loadDashboard();

    alert("News published successfully.");

  });

}


// ===============================
// EVENTS
// ===============================

const eventForm =
  document.getElementById("eventForm");

if (eventForm) {

  eventForm.addEventListener("submit", function(e) {

    e.preventDefault();

    const events = getData("gs_events");

    events.push({

      id: Date.now(),

      title:
        document.getElementById("eventTitle").value,

      date:
        document.getElementById("eventDate").value,

      description:
        document.getElementById("eventDescription").value

    });

    saveData("gs_events", events);

    eventForm.reset();

    loadDashboard();

    alert("Event added successfully.");

  });

}


// ===============================
// TEACHERS
// ===============================

const teacherForm =
  document.getElementById("teacherForm");

if (teacherForm) {

  teacherForm.addEventListener("submit", function(e) {

    e.preventDefault();

    const teachers = getData("gs_teachers");

    teachers.push({

      id: Date.now(),

      name:
        document.getElementById("teacherName").value,

      subject:
        document.getElementById("teacherSubject").value

    });

    saveData("gs_teachers", teachers);

    teacherForm.reset();

    loadDashboard();

    alert("Teacher added.");

  });

}


// ===============================
// GALLERY
// ===============================

const galleryForm =
  document.getElementById("galleryForm");

if (galleryForm) {

  galleryForm.addEventListener("submit", function(e) {

    e.preventDefault();

    const gallery = getData("gs_gallery");

    gallery.push({

      id: Date.now(),

      url:
        document.getElementById("imageUrl").value,

      caption:
        document.getElementById("imageCaption").value

    });

    saveData("gs_gallery", gallery);

    galleryForm.reset();

    loadDashboard();

  });

}


// ===============================
// SETTINGS
// ===============================

const settingsForm =
  document.getElementById("settingsForm");

if (settingsForm) {

  settingsForm.addEventListener("submit", function(e) {

    e.preventDefault();

    const settings = {

      name:
        document.getElementById("schoolName").value,

      location:
        document.getElementById("schoolLocation").value,

      phone:
        document.getElementById("schoolPhone").value,

      email:
        document.getElementById("schoolEmail").value

    };

    saveData("gs_settings", settings);

    document.getElementById("settingsStatus")
      .textContent =
      "Settings saved successfully.";

  });

}


// ===============================
// DASHBOARD
// ===============================

function loadDashboard() {

  const news = getData("gs_news");
  const events = getData("gs_events");
  const teachers = getData("gs_teachers");
  const gallery = getData("gs_gallery");
  const messages = getData("gs_messages");

  const newsCount =
    document.getElementById("newsCount");

  const messageCount =
    document.getElementById("messageCount");

  const teacherCount =
    document.getElementById("teacherCount");

  if (newsCount) {
    newsCount.textContent = news.length;
  }

  if (messageCount) {
    messageCount.textContent = messages.length;
  }

  if (teacherCount) {
    teacherCount.textContent =
      teachers.length || 32;
  }


  // NEWS LIST

  const newsList =
    document.getElementById("adminNewsList");

  if (newsList) {

    if (news.length === 0) {

      newsList.innerHTML =
        "<p>No news published yet.</p>";

    } else {

      newsList.innerHTML = news.map(item => `

        <div class="list-item">

          <div>
            <strong>${escapeHTML(item.title)}</strong>
            <p>${escapeHTML(item.content)}</p>
            <small>${item.date}</small>
          </div>

          <button
            class="delete-btn"
            onclick="deleteNews(${item.id})">
            Delete
          </button>

        </div>

      `).join("");

    }

  }


  // EVENTS

  const eventList =
    document.getElementById("eventList");

  if (eventList) {

    if (events.length === 0) {

      eventList.innerHTML =
        "<p>No events added yet.</p>";

    } else {

      eventList.innerHTML = events.map(item => `

        <div class="list-item">

          <div>
            <strong>${escapeHTML(item.title)}</strong>
            <p>${escapeHTML(item.description)}</p>
            <small>${item.date}</small>
          </div>

          <button
            class="delete-btn"
            onclick="deleteEvent(${item.id})">
            Delete
          </button>

        </div>

      `).join("");

    }

  }


  // TEACHERS

  const teacherList =
    document.getElementById("teacherList");

  if (teacherList) {

    if (teachers.length === 0) {

      teacherList.innerHTML =
        "<p>No teachers added yet.</p>";

    } else {

      teacherList.innerHTML = teachers.map(item => `

        <div class="list-item">

          <div>
            <strong>${escapeHTML(item.name)}</strong>
            <p>${escapeHTML(item.subject)}</p>
          </div>

          <button
            class="delete-btn"
            onclick="deleteTeacher(${item.id})">
            Delete
          </button>

        </div>

      `).join("");

    }

  }


  // GALLERY

  const adminGallery =
    document.getElementById("adminGallery");

  if (adminGallery) {

    adminGallery.innerHTML = gallery.map(item => `

      <div>

        <img src="${escapeAttribute(item.url)}"
             alt="${escapeAttribute(item.caption)}">

        <p>${escapeHTML(item.caption)}</p>

        <button
          class="delete-btn"
          onclick="deleteGallery(${item.id})">
          Delete
        </button>

      </div>

    `).join("");

  }


  // MESSAGES

  const messagesList =
    document.getElementById("messagesList");

  if (messagesList) {

    if (messages.length === 0) {

      messagesList.innerHTML =
        "<p>No messages yet.</p>";

    } else {

      messagesList.innerHTML =
        messages.map(item => `

        <div class="list-item">

          <div>
            <strong>
              ${escapeHTML(item.name)}
            </strong>

            <p>
              <strong>
                ${escapeHTML(item.subject)}
              </strong>
            </p>

            <p>
              ${escapeHTML(item.message)}
            </p>

            <small>
              ${escapeHTML(item.email)}
              • ${item.date}
            </small>
          </div>

          <button
            class="delete-btn"
            onclick="deleteMessage(${item.id})">
            Delete
          </button>

        </div>

      `).join("");

    }

  }

}


// ===============================
// DELETE FUNCTIONS
// ===============================

function deleteNews(id) {

  const news =
    getData("gs_news")
      .filter(item => item.id !== id);

  saveData("gs_news", news);

  loadDashboard();
}


function deleteEvent(id) {

  const events =
    getData("gs_events")
      .filter(item => item.id !== id);

  saveData("gs_events", events);

  loadDashboard();
}


function deleteTeacher(id) {

  const teachers =
    getData("gs_teachers")
      .filter(item => item.id !== id);

  saveData("gs_teachers", teachers);

  loadDashboard();
}


function deleteGallery(id) {

  const gallery =
    getData("gs_gallery")
      .filter(item => item.id !== id);

  saveData("gs_gallery", gallery);

  loadDashboard();
}


function deleteMessage(id) {

  const messages =
    getData("gs_messages")
      .filter(item => item.id !== id);

  saveData("gs_messages", messages);

  loadDashboard();
}


// ===============================
// SECURITY HELPERS
// ===============================

function escapeHTML(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function escapeAttribute(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
