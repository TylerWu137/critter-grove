// src/data/questTags.js
//
// Static reference data -- describes a TAG (name + its color), shared
// across all users and all quests. Not owned by anyone, same pattern as
// critterSpecies.js. Quests link to this via tagId (optional).

export const questTags = [
  { id: 1, name: "school", color: "var(--blue)" },
  { id: 2, name: "family", color: "var(--green)" },
  { id: 3, name: "art", color: "var(--red)" },
  { id: 4, name: "nutrition", color: "var(--yellow)" },
  { id: 5, name: "vinny", color: "var(--light-brown)" },
  { id: 6, name: "cs", color: "var(--brown)" },
];