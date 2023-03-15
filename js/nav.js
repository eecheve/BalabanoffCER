const navContent =`
  <li><a class="btn" href="../index.html">Home</a></li>
  <li><a class="btn" href="../html/research.html">Research</a></li>
  <li><a class="btn" href="../html/group-members.html">Group Members</a></li>
  <li><a class="btn" href="../html/news.html">News</a></li>
  <li><a class="btn" href="../html/publications.html">Publications</a></li>
  <li><a class="btn" href="../html/contact.html">Contact</a></li>
  <li><a href="https://louisville.edu/chemistry/"><img src="../images/UofLLogo.png" alt="University of Louisville's logo"></a></li>
`;

const mainNav = document.createElement("nav");
mainNav.classList.add("navigation");

const navList = document.createElement("ul");
navList.classList.add("panel");
navList.innerHTML = navContent;
mainNav.append(navList);

document.querySelector(".nav_panel").append(mainNav);