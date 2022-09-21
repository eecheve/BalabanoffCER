const navContent =`
  <li><a class="btn" href="index.html">Home</a></li>
  <li><a class="btn" href="research.html">Research</a></li>
  <li><a class="btn" href="group-members.html">Group Members</a></li>
  <li><a class="btn" href="news.html">News</a></li>
  <li><a class="btn" href="publications.html">Publications</a></li>
  <li><a class="btn" href="contact.html">Contact</a></li>
`;

const mainNav = document.createElement("nav");
mainNav.classList.add("navigation");

const navList = document.createElement("ul");
navList.classList.add("panel");
navList.innerHTML = navContent;
mainNav.append(navList);

document.querySelector(".nav_panel").append(mainNav);