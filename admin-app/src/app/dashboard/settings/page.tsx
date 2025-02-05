import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Metadata } from "next";
import MyProfile from "@/components/settings/my-profile";

export const metadata: Metadata = {
  title: "Settings",
};

const tabTriggerStyles =
  "relative data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none rounded-none data-[state=active]:before:absolute data-[state=active]:before:-bottom-1 data-[state=active]:before:left-0 data-[state=active]:before:w-full data-[state=active]:before:h-[0.1rem] data-[state=active]:before:bg-primary";

const Settings = () => {
  return (
    <section>
      <Tabs defaultValue="profile">
        <div className="bg-muted p-5 pb-0">
          <h1 className="text-3xl font-bold">Settings</h1>
          <TabsList className="bg-transparent mt-3">
            <TabsTrigger value="profile" className={tabTriggerStyles}>
              My Profile
            </TabsTrigger>
            <TabsTrigger value="security" className={tabTriggerStyles}>
              Security
            </TabsTrigger>
            <TabsTrigger value="users" className={tabTriggerStyles}>
              Users
            </TabsTrigger>
          </TabsList>
        </div>
        <MyProfile />
      </Tabs>
    </section>
  );
};

export default Settings;
