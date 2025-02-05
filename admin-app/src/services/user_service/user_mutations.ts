import { useMutation } from "@tanstack/react-query";
import { CREATE_USER } from "./user_endpoints";
import { useUserStore } from "@/store/userStore";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export const useCreateUser = (setOpen: (value: boolean) => void) => {
  const { addUser } = useUserStore();

  return useMutation({
    mutationKey: ["create-user"],
    mutationFn: CREATE_USER,
    onSuccess: (data) => {
      addUser(data);
      toast.success("User added successfully");
      setOpen(false);
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.detail);
      } else {
        toast.error(`An error occurred: ${error.message}`);
      }

      setOpen(true);
    },
  });
};
