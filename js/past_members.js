import pMembers_json from '../json/past_members.json' with { type: 'json' };

//accessing the past_members_list section
var past_members = document.getElementsByClassName("past_members_list")[0];

//adding the content wrap to the past_members section
var wrapper = document.createElement('div'); 
wrapper.className = "content_wrap";
past_members.appendChild(wrapper);

//adding the title to the past members section
var section_title = document.createElement('h2');
section_title.innerHTML = "Past Members";
wrapper.appendChild(section_title);

for(var i=0; i<pMembers_json.length; i++){
  //creating past_member div
  var member = document.createElement('div');
  member.className = "past_member";
  wrapper.appendChild(member);

  //adding member_details to past_member
  var member_details = document.createElement('section');
  member_details.className = "past_member_details"
  member.appendChild(member_details);

  //adding member details
  var name_header = document.createElement('h3');
  name_header.innerHTML = pMembers_json[i].name;
  member_details.appendChild(name_header);
  var degree_info = document.createElement('em')
  degree_info.innerHTML = pMembers_json[i].degree;
  member_details.appendChild(degree_info);
  var research_info = document.createElement('p');
  research_info.innerHTML = pMembers_json[i].research;
  member_details.appendChild(research_info);

  //adding member_picture to past_member
  var member_picture = document.createElement('section');
  member_picture.className = "past_member_picture";
  member.appendChild(member_picture);

  //populating member_picture details
  var member_image = document.createElement('img');
  member_image.className = "center_fit";
  member_image.src = pMembers_json[i].picture;
  member_image.alt = pMembers_json[i].name + " picture";
  member_picture.appendChild(member_image);
}