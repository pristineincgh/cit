import createAxiosInstance from "@/lib/axios-utils";
import { User, UserCreateInput, UserListResponse } from "@/types/user_types";

const client = createAxiosInstance(true);

export const GET_USERS = async (): Promise<UserListResponse> => {
  const response = await client.get<UserListResponse>("/users");

  return response.data;
};

export const GET_USER = async (id: string) => {
  const response = await client.get(`/users/${id}`);

  return response.data;
};

export const CREATE_USER = async (
  user_data: UserCreateInput
): Promise<User> => {
  const response = await client.post<User>("/users", user_data);

  return response.data;
};
