function filterNotApplicableEditors(formInputArray) {
  const editorsToPush = [];
  formInputArray.forEach((ed) => {
    if (ed !== "n/a") {
      editorsToPush.push(ed);
    }
  });
  return editorsToPush;
}

function updateRoleToEditor(usersArray) {
  const newArray = usersArray.forEach((newEd) => {
    UserModel.findByIdAndUpdate(
      newEd,
      { role: "Editor" },
      { new: true }
    ).then((users) => console.log(users));
  });
  return newArray;
}
