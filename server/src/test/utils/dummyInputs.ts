import type { FullList } from "../../types/list.js";
import type { ParticipantDetails } from "../../types/participant.js";
import type { UserInput } from "../../types/user.js";

export const dummyUserInputs: UserInput[] = [
  {
    id: "564de58f-890d-46c6-a764-d0af378240a3",
    email: "test@test.com",
    name: "Testopher",
    photoUrl:
      "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg",
  },
  {
    id: "1d3f6178-1fa2-4ad6-9886-7f51aaa67d41",
    email: "test2@test.com",
    name: "Tophertest",
    photoUrl: "https://lh3.googleusercontent.com/randompicture",
  },
  {
    id: "a04547e0-d7b4-4f64-a4ed-c7e5b43815d2",
    email: "test3@test.com",
    name: "Tostestpher",
    photoUrl: null,
  },
];

export const dummyParticipants: ParticipantDetails[] = dummyUserInputs.map(
  (u, index) => ({
    role: index === 0 ? "OWNER" : "BASIC",
    user: { id: u.id, name: u.name, photoUrl: u.photoUrl ?? null },
  }),
);

export const basicTestList: FullList = {
  id: "",
  name: "A new list",
  color: "GRAY",
  products: [],
  participants: [dummyParticipants[0]],
};
