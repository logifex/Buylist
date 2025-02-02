import request from "supertest";
import { UserInput } from "../../types/user";
import { UserService } from "../../services";
import app from "../../app";
import { CreateListInput } from "../../types/list";
import { firebase } from "../../config";

export const createTestUser = async (user: UserInput) => {
  await UserService.upsertUser(user);
};

export const deleteTestUser = async (userId: string) => {
  await UserService.deleteUser(userId);
};

export const getTestJwt = async (userId: string) => {
  const customToken = await firebase.auth().createCustomToken(userId);
  const response = await fetch(
    `http://${process.env.FIREBASE_AUTH_EMULATOR_HOST}/identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${process.env.GOOGLE_API_KEY}`,
    {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ token: customToken, returnSecureToken: true }),
    }
  );

  const {
    idToken,
    error,
  }: {
    idToken?: string;
    error?: {
      code: number;
      message: string;
      errors?: [{ message: string; reason: string; domain: string }];
    };
  } = await response.json();

  if (response.ok && idToken) {
    return idToken;
  }

  const errorMessage: string =
    error?.errors?.map((e) => e.message).join("\n") ??
    "Uknown error fetching authentication token";
  throw new Error(errorMessage);
};

export const getTestList = (jwt: string, listId: string) => {
  return request(app).get(`/api/lists/${listId}`).auth(jwt, { type: "bearer" });
};

export const createTestList = (jwt: string, list: CreateListInput) => {
  return request(app)
    .post("/api/lists")
    .auth(jwt, { type: "bearer" })
    .send(list);
};

export const getTestInviteToken = (jwt: string, listId: string) => {
  return request(app)
    .get(`/api/lists/${listId}/participants/invite/token`)
    .auth(jwt, { type: "bearer" });
};

export const createTestInviteToken = (jwt: string, listId: string) => {
  return request(app)
    .post(`/api/lists/${listId}/participants/invite/token`)
    .auth(jwt, { type: "bearer" });
};

export const joinTestList = async (jwt: string, token: string) => {
  return request(app)
    .post(`/api/lists/join/${token}`)
    .auth(jwt, { type: "bearer" });
};

export const getTestParticipants = async (jwt: string, listId: string) => {
  return request(app)
    .get(`/api/lists/${listId}/participants`)
    .auth(jwt, { type: "bearer" });
};
