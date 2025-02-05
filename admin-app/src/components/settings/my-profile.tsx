"use client";

import { useAuthStore } from "@/store/authStore";
import { Button } from "../ui/button";
import { TabsContent } from "../ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableRow } from "../ui/table";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useUpdateMyProfile } from "@/services/auth_service/auth_mutations";
import { ClipLoader } from "react-spinners";

// Types
interface ProfileField {
  key: "name" | "username" | "email";
  label: string;
  value: string | { firstName: string; lastName: string };
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  onUpdate: () => void;
}

// Components
const EditableField = ({
  field,
  isPending,
  children,
}: {
  field: ProfileField;
  isPending: boolean;
  children: React.ReactNode;
}) => {
  return (
    <TableRow>
      <TableHead className="w-[20rem] font-semibold text-foreground py-[1.3rem]">
        {field.label}
      </TableHead>
      <TableCell className="py-[1.3rem]">
        {field.isEditing
          ? children
          : typeof field.value === "object"
          ? `${field.value.firstName} ${field.value.lastName}`
          : field.value}
      </TableCell>
      <TableCell className="text-right py-[1.3rem]">
        <Button
          type="button"
          className="w-20"
          variant={field.isEditing ? "default" : "outline"}
          onClick={() =>
            field.isEditing ? field.onUpdate() : field.setIsEditing(true)
          }
        >
          {field.isEditing ? (
            isPending ? (
              <ClipLoader color="#fff" size={20} />
            ) : (
              "Save"
            )
          ) : (
            "Edit"
          )}
        </Button>
      </TableCell>
    </TableRow>
  );
};

const InitialsDisplay = ({ initials }: { initials: string }) => (
  <div className="flex justify-center items-center gap-20 border-b py-5">
    <h5 className="font-semibold">Initials</h5>
    <div className="w-16 h-16 text-2xl bg-primary text-white flex items-center justify-center rounded-full">
      {initials}
    </div>
  </div>
);

function MyProfile() {
  const { session } = useAuthStore();
  const user = session?.user;
  const { mutate: updateProfile, isPending } = useUpdateMyProfile();

  // State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
  });

  const [editing, setEditing] = useState({
    name: false,
    username: false,
    email: false,
  });

  // Effects
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username,
        email: user.email,
      });
    }
  }, [user]);

  useEffect(() => {
    if (!isPending) {
      setEditing({
        name: false,
        username: false,
        email: false,
      });
    }
  }, [isPending]);

  // Handlers
  const handleUpdate = (field: keyof typeof editing) => {
    const updates: Record<string, string> = {};

    if (field === "name") {
      updates.first_name = formData.firstName;
      updates.last_name = formData.lastName;
    } else {
      updates[field] = formData[field];
    }

    updateProfile(updates);
  };

  // Field configurations
  const fields: ProfileField[] = [
    {
      key: "name",
      label: "Full Name",
      value: `${user?.first_name} ${user?.last_name}`,
      isEditing: editing.name,
      setIsEditing: (value) => setEditing((prev) => ({ ...prev, name: value })),
      onUpdate: () => handleUpdate("name"),
    },
    {
      key: "username",
      label: "Username",
      value: user?.username || "",
      isEditing: editing.username,
      setIsEditing: (value) =>
        setEditing((prev) => ({ ...prev, username: value })),
      onUpdate: () => handleUpdate("username"),
    },
    {
      key: "email",
      label: "Email",
      value: user?.email || "",
      isEditing: editing.email,
      setIsEditing: (value) =>
        setEditing((prev) => ({ ...prev, email: value })),
      onUpdate: () => handleUpdate("email"),
    },
  ];

  const initials = `${user?.first_name?.charAt(0)}${user?.last_name?.charAt(
    0
  )}`;

  return (
    <TabsContent value="profile" className="px-5 py-5 max-w-5xl mx-auto">
      <InitialsDisplay initials={initials} />
      <Table>
        <TableBody className="[&_tr:last-child]:border-1">
          {fields.map((field) => (
            <EditableField key={field.key} field={field} isPending={isPending}>
              {field.key === "name" ? (
                <div className="flex items-center gap-2">
                  <div>
                    <Label htmlFor="firstName" className="sr-only">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      className="w-full py-4"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="sr-only">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      className="w-full py-4"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <Label htmlFor={field.key} className="sr-only">
                    {field.label}
                  </Label>
                  <Input
                    id={field.key}
                    type={field.key === "email" ? "email" : "text"}
                    className="w-full py-4"
                    placeholder={field.label}
                    value={formData[field.key]}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [field.key]: e.target.value,
                      }))
                    }
                  />
                </div>
              )}
            </EditableField>
          ))}
        </TableBody>
      </Table>
    </TabsContent>
  );
}

export default MyProfile;
