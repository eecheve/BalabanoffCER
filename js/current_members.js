import cMembers_json from '../json/current_members.json' with { type: 'json' };

//accessing the current_members_list section
var current_members = document.getElementsByClassName("members_list")[0];
var wrapper = current_members.getElementsByClassName("content_wrap")[0];

for(var i=0; i<cMembers_json.length; i++){
  //creating past_member div
  var member = document.createElement('div');
  member.className = "member";
  wrapper.appendChild(member);

  //adding member_details to past_member
  var member_details = document.createElement('section');
  member_details.className = "member_details"
  member.appendChild(member_details);

  //adding member details
  var name_header = document.createElement('h3');
  name_header.innerHTML = cMembers_json[i].name;
  member_details.appendChild(name_header);
  var degree_info = document.createElement('em')
  degree_info.innerHTML = cMembers_json[i].degree;
  member_details.appendChild(degree_info);
  var research_info = document.createElement('p');
  research_info.innerHTML = cMembers_json[i].description;
  member_details.appendChild(research_info);
  var email_details = document.createElement('a');
  email_details.href = "mailto:" + cMembers_json[i].email;
  email_details.innerHTML = cMembers_json[i].email;
  member_details.appendChild(email_details);

  //adding member_picture to past_member
  var member_picture = document.createElement('section');
  member_picture.className = "member_picture";
  member.appendChild(member_picture);

  //populating member_picture details
  var member_image = document.createElement('img');
  member_image.className = "center_fit";
  member_image.src = cMembers_json[i].picture;
  member_image.alt = cMembers_json[i].name + " picture";
  member_picture.appendChild(member_image);
}